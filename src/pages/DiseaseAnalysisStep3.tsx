import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ContentWrapper } from '../components/Layout';
import StepIndicator from '../components/DiseaseAnalysisStep3/StepIndicator';
import ChartPanel from '../components/DiseaseAnalysisStep3/ChartPanel';
import DetailsPanel from '../components/DiseaseAnalysisStep3/DetailsPanel';

import { MainContent } from '../components/DiseaseAnalysisStep3/SharedStyles';
import { generateDiagnosisStream, saveDiagnosisResult, fileToBase64 } from '../services';

// 타입 정의
interface AnalysisResult {
  file: File;
  result: unknown;
  error?: unknown;
}

interface LocationState {
  uploadedFiles: File[];
  analysisResults: AnalysisResult[];
  selectedResult: AnalysisResult;
  additionalInfo?: {
    symptoms: string[];
    itchLevel: number;
    duration: string;
    additionalInfo: string;
  };
}

interface DiseaseInfo {
  disease_name: string;
  confidence: number;
}

interface StreamingContent {
  summary: string;
  description: string;
  precautions: string;
  management: string;
}

const DiseaseAnalysisStep3: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasInitializedRef = useRef<boolean>(false); // 초기화 여부 추적
  
  // 상태 관리
  const [streamingContent, setStreamingContent] = useState<StreamingContent>({
    summary: '',
    description: '',
    precautions: '',
    management: ''
  });
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResult, setFinalResult] = useState<unknown>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');
  const [analysisMetrics, setAnalysisMetrics] = useState<{
    skin_score?: number;
    severity?: string;
    estimated_treatment_period?: string;
  } | null>(null);
  
  // 이전 페이지에서 전달받은 데이터
  const locationState = location.state as LocationState | null;
  const { uploadedFiles, selectedResult, additionalInfo } = locationState || { 
    uploadedFiles: [], 
    selectedResult: null, 
    additionalInfo: undefined 
  };

  useEffect(() => {
    // 중복 실행 방지를 위한 더 강력한 체크
    if (hasInitializedRef.current) {
      return;
    }

    if (!selectedResult || !selectedResult.result) {
      navigate('/disease-analysis-step1');
      return;
    }

    if (!isLoaded || !user) {
      return;
    }

    // 즉시 플래그 설정하여 중복 실행 완전 차단
    hasInitializedRef.current = true;

    console.log('🚀 SSE 스트리밍 시작 (한 번만 실행)');
    const eventSource = startSSEStreaming();
    
    // Cleanup 함수
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [selectedResult, isLoaded, user]);

  const startSSEStreaming = (): EventSource | null => {
    // 중복 실행 완전 차단
    if (isStreaming || !selectedResult?.result || eventSourceRef.current) {
      return null;
    }

    // 즉시 상태 변경으로 중복 호출 차단
    setIsStreaming(true);
    setIsComplete(false);
    setFinalResult(null);
    setIsSaved(false);
    
    // 스트리밍 내용 완전 초기화
    setStreamingContent({
      summary: '',
      description: '',
      precautions: '',
      management: ''
    });
    setActiveTab('summary'); // 스트리밍 시작시 summary 탭으로 이동

    try {
      // 분석 결과에서 질병명 추출
      const result = selectedResult.result as Record<string, unknown>;
      console.log('🔎 SSE용 API 응답 구조 확인:', result);
      
      const dataArray = result?.data as unknown[];
      const firstResult = (dataArray?.[0] as Record<string, unknown>) || {};
      console.log('🔎 첫 번째 결과:', firstResult);
      
      // 여러 경로에서 병명 찾기 시도
      const diseaseName = (firstResult?.disease_name as string) || 
                         (result?.disease_name as string) || 
                         '아토피 피부염'; // 기본값
      
      console.log('🏥 최종 추출된 병명:', diseaseName);
      console.log('🔍 selectedResult 전체 구조:', selectedResult);
      console.log('🔍 selectedResult.file 확인:', selectedResult.file);
      console.log('🔍 selectedResult.file 타입:', typeof selectedResult.file);
      console.log('🔍 uploadedFiles 확인:', uploadedFiles);
      
      // API 응답에서 base64 이미지 추출
      const base64Image = firstResult?.image as string;
      console.log('🔍 API 응답의 base64 이미지:', base64Image ? '있음' : '없음');
      
      // base64를 File 객체로 변환
      let imageFile = selectedResult.file || uploadedFiles?.[0];
      if (!imageFile && base64Image) {
        try {
          // base64를 Blob으로 변환
          const byteCharacters = atob(base64Image);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          
          // Blob을 File로 변환
          imageFile = new File([blob], 'analysis-image.jpg', { type: 'image/jpeg' });
          console.log('🔍 base64에서 변환된 파일:', imageFile);
        } catch (error) {
          console.error('🔍 base64 변환 오류:', error);
        }
      }
      
      console.log('🔍 최종 사용할 이미지 파일:', imageFile);
      
      // 이미지 파일이 없으면 에러 처리
      if (!imageFile) {
        console.error('❌ 이미지 파일을 찾을 수 없습니다');
        setIsStreaming(false);
        alert('이미지 파일을 찾을 수 없습니다. Step1부터 다시 시작해주세요.');
        navigate('/disease-analysis-step1');
        return null;
      }
      
      const userId = user!.id;

      const eventSource = generateDiagnosisStream(
        userId,
        diseaseName,
        (event) => {
          console.log('🔄 SSE 이벤트 처리:', event.type, event.data);
          
          // AI 의견 (요약) 스트리밍
          if (event.type === 'ai_opinion_start') {
            console.log('📝 AI 의견 시작 - summary 탭으로 전환');
            setActiveTab('summary');
            setStreamingContent(prev => ({ ...prev, summary: '' }));
          } else if (event.type === 'ai_opinion_chunk') {
            console.log('📝 AI 의견 chunk 추가:', event.data);
            setStreamingContent(prev => {
              const newContent = prev.summary + (prev.summary ? ' ' : '') + (event.data || '');
              console.log('📝 업데이트된 summary:', newContent);
              return {
                ...prev,
                summary: newContent
              };
            });
          }
          
          // 상세 설명 스트리밍
          else if (event.type === 'detailed_description_start') {
            setActiveTab('description');
            setStreamingContent(prev => ({ ...prev, description: '' }));
          } else if (event.type === 'detailed_description_chunk') {
            setStreamingContent(prev => {
              const chunk = event.data || '';
              let formattedChunk = chunk;
              
              // 숫자로 시작하는 항목 앞에 줄바꿈 추가 (예: "1.", "2.", "3." 등)
              if (/^\d+\./.test(chunk.trim()) && prev.description) {
                formattedChunk = '\n\n' + chunk;
              }
              // ①, ②, ③ 같은 번호 앞에 줄바꿈 추가
              else if (/^[①②③④⑤⑥⑦⑧⑨⑩]/.test(chunk.trim()) && prev.description) {
                formattedChunk = '\n' + chunk;
              }
              // 일반적인 경우 띄어쓰기 추가
              else if (prev.description) {
                formattedChunk = ' ' + chunk;
              }
              
              return {
                ...prev,
                description: prev.description + formattedChunk
              };
            });
          }
          
          // 주의사항 스트리밍
          else if (event.type === 'precautions_start') {
            setActiveTab('precautions');
            setStreamingContent(prev => ({ ...prev, precautions: '' }));
          } else if (event.type === 'precautions_chunk') {
            setStreamingContent(prev => ({
              ...prev,
              precautions: prev.precautions + (prev.precautions ? ' ' : '') + (event.data || '')
            }));
          } else if (event.type === 'precautions_item_end') {
            setStreamingContent(prev => ({
              ...prev,
              precautions: prev.precautions + '\n\n'
            }));
          }
          
          // 관리방법 스트리밍
          else if (event.type === 'management_start') {
            setActiveTab('management');
            setStreamingContent(prev => ({ ...prev, management: '' }));
          } else if (event.type === 'management_chunk') {
            setStreamingContent(prev => ({
              ...prev,
              management: prev.management + (prev.management ? ' ' : '') + (event.data || '')
            }));
          } else if (event.type === 'management_item_end') {
            setStreamingContent(prev => ({
              ...prev,
              management: prev.management + '\n\n'
            }));
          }
          
          // 완료 처리
          else if (event.type === 'done') {
            console.log('✅ 스트리밍 완료');
            console.log('📊 분석 메트릭스:', event.save_data);
            
            // save_data에서 분석 메트릭스 추출
            if (event.save_data) {
              setAnalysisMetrics({
                skin_score: event.save_data.skin_score,
                severity: event.save_data.severity,
                estimated_treatment_period: event.save_data.estimated_treatment_period
              });
            }
            
            setIsComplete(true);
            setIsStreaming(false);
            setFinalResult(event);
          }
        },
        (error) => {
          console.error('SSE 스트리밍 오류:', error);
          setIsStreaming(false);
          alert('스트리밍 중 오류가 발생했습니다.');
        },
        () => {
          setIsStreaming(false);
          setIsComplete(true);
        },
        imageFile // 원본 이미지 또는 base64에서 변환된 이미지 사용
      );

      // EventSource를 ref에 저장하여 cleanup에서 사용할 수 있도록 함
      eventSourceRef.current = eventSource;
      
      return eventSource;
    } catch (error) {
      console.error('SSE 스트리밍 시작 실패:', error);
      setIsStreaming(false);
      alert('스트리밍 시작에 실패했습니다.');
      return null;
    }
  };

  const handleSaveResult = async () => {
    const hasContent = Object.values(streamingContent).some(content => content.trim().length > 0);
    if (!finalResult || !hasContent || isSaved || isSaving || !user || !selectedResult?.file) return;

    setIsSaving(true);
    try {
      const result = selectedResult?.result as Record<string, unknown>;
      console.log('저장용 API 응답 구조 확인:', result);
      
      const dataArray = result?.data as unknown[];
      const firstResult = (dataArray?.[0] as Record<string, unknown>) || {};
      
      // Step2에서 입력된 추가 정보 포함
      const additionalInfoText = additionalInfo ? 
        `증상: ${additionalInfo.symptoms.join(', ') || '없음'}, 가려움 정도: ${additionalInfo.itchLevel}/10, 기간: ${additionalInfo.duration}, 추가 정보: ${additionalInfo.additionalInfo}` :
        '추가 정보 없음';

      // 스트리밍 내용을 하나의 문자열로 합치기
      const combinedContent = [
        `요약: ${streamingContent.summary}`,
        `상세 설명: ${streamingContent.description}`,
        `주의사항: ${streamingContent.precautions}`,
        `관리법: ${streamingContent.management}`
      ].join('\n\n');

      // 이미지를 base64로 변환
      const imageBase64 = await fileToBase64(selectedResult.file);

      const saveData = {
        user_id: user.id,
        image_base64: imageBase64,
        image_analysis: {
          disease_name: (firstResult?.disease_name as string) || (result?.disease_name as string) || 'unknown',
          confidence: (firstResult?.confidence as number) || (result?.confidence as number) || 0
        },
        text_analysis: {
          ai_opinion: combinedContent,
          detailed_description: `${combinedContent}\n\n[사용자 입력 정보]\n${additionalInfoText}`
        }
      };

      await saveDiagnosisResult(saveData);
      setIsSaved(true);
      alert('진단 결과가 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('결과 저장 실패:', error);
      alert('결과 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadReport = () => {
    // TODO: 리포트 다운로드 기능 구현 예정
    alert('리포트 다운로드 기능을 준비 중입니다.');
  };

  const handleRestartAnalysis = () => {
    navigate('/disease-analysis-step1');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // 분석 결과가 없는 경우
  if (!selectedResult) {
    return (
      <ContentWrapper style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>분석 결과를 찾을 수 없습니다.</h2>
          <button 
            onClick={handleRestartAnalysis}
            style={{ 
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            다시 분석하기
          </button>
        </div>
      </ContentWrapper>
    );
  }

  // 분석 결과에서 질병 정보 추출
  const result = selectedResult?.result as Record<string, unknown>;
  const dataArray = result?.data as unknown[];
  const firstResult = (dataArray?.[0] as Record<string, unknown>) || {};
  
  // 질병 정보 추출 (로그 제거로 반복 감소)
  const diseaseInfo: DiseaseInfo = {
    disease_name: (firstResult?.disease_name as string) || (result?.disease_name as string) || '알 수 없는 질환',
    confidence: Math.round(((firstResult?.confidence as number) || (result?.confidence as number) || 0))
  };

  return (
    <ContentWrapper style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <StepIndicator />
      <MainContent>
        <ChartPanel analysisResult={diseaseInfo} />
        
        <DetailsPanel
          diseaseInfo={diseaseInfo}
          streamingContent={streamingContent}
          additionalInfo={additionalInfo}
          activeTab={activeTab}
          isStreaming={isStreaming}
          isComplete={isComplete}
          isSaved={isSaved}
          analysisMetrics={analysisMetrics}
          onTabChange={handleTabChange}
          onSaveResult={handleSaveResult}
          onDownloadReport={handleDownloadReport}
          onRestartAnalysis={handleRestartAnalysis}
        />
      </MainContent>
    </ContentWrapper>
  );
};

export default DiseaseAnalysisStep3;
