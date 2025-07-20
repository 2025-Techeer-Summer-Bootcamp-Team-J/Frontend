import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';
import StepIndicator from '../components/DiseaseAnalysisStep3/StepIndicator';
import ChartPanel from '../components/DiseaseAnalysisStep3/ChartPanel';
import DetailsPanel from '../components/DiseaseAnalysisStep3/DetailsPanel';
import AdditionalInfoDisplay from '../components/DiseaseAnalysisStep3/AdditionalInfoDisplay';
import { MainContent } from '../components/DiseaseAnalysisStep3/SharedStyles';
import { createDiagnosis, generateDiagnosisStream, saveDiagnosisResult } from '../services';

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
  
  // 이전 페이지에서 전달받은 데이터
  const locationState = location.state as LocationState | null;
  const { selectedResult, additionalInfo } = locationState || { selectedResult: null, additionalInfo: undefined };

  useEffect(() => {
    console.log('🎯 useEffect 실행 - selectedResult 체크:', !!selectedResult);
    
    if (!selectedResult || !selectedResult.result) {
      console.log('❌ 분석 결과 없음 - Step1로 이동');
      navigate('/disease-analysis-step1');
      return;
    }

    if (isStreaming) {
      console.log('⚠️ 이미 스트리밍 중');
      return;
    }

    console.log('🚀 POST 진단 요청 시작!');
    startDiagnosisFlow();
    
  }, [selectedResult]);

  // POST 요청 후 SSE 스트리밍 시작
  const startDiagnosisFlow = async () => {
    try {
      console.log('📤 POST /api/diagnoses 요청 시작');
      
      // POST 요청으로 진단 요청
      const diagnosisRequest = {
        user_id: 1, // TODO: 실제 사용자 ID로 교체
        file: selectedResult!.file
      };

      const postResponse = await createDiagnosis(diagnosisRequest);
      console.log('✅ POST 응답 성공:', postResponse);

      // POST 응답이 200이면 바로 기본 정보 표시하고 SSE 스트리밍 시작
      if (postResponse) {
        console.log('🎯 POST 응답 성공 - SSE 스트리밍 시작');
        const eventSource = startSSEStreaming();
        
        // Cleanup 함수 등록
        const cleanup = () => {
          if (eventSource) {
            console.log('🧹 EventSource cleanup - 연결 종료');
            eventSource.close();
          }
        };

        // 컴포넌트 unmount 시 cleanup
        return cleanup;
      }
    } catch (error) {
      console.error('❌ POST 요청 실패:', error);
      alert('진단 요청에 실패했습니다. 다시 시도해주세요.');
      navigate('/disease-analysis-step1');
    }
  };

  const startSSEStreaming = (): EventSource | null => {
    if (isStreaming || !selectedResult || !selectedResult.result) {
      console.log('⚠️ 스트리밍 시작 방지:', { 
        isStreaming, 
        hasResult: !!selectedResult?.result
      });
      return null;
    }

    console.log('🚀 SSE 스트리밍 시작!');
    
    // 모든 상태 초기화
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
      
      const userId = 1; // TODO: 실제 사용자 ID로 교체

      return generateDiagnosisStream(
        userId,
        diseaseName,
        selectedResult.file,
        (event) => {
          console.log('🎯 받은 이벤트:', event);
          
          if (event.type === 'progress' && event.tab && event.content) {
            const tabKey = event.tab as keyof typeof streamingContent;
            console.log(`📥 [${tabKey}] 받은 내용: "${event.content}"`);
            
            // 현재 탭으로 전환
            setActiveTab(event.tab);
            
            // 간단한 내용 추가
            setStreamingContent(prev => {
              const newContent = {
                ...prev,
                [tabKey]: prev[tabKey] + (event.content || '')
              };
              
              console.log(`💾 [${tabKey}] 현재 내용:`, newContent[tabKey]);
              return newContent;
            });
            
          } else if (event.type === 'complete') {
            console.log('🏁 스트리밍 완료');
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
        }
      );
    } catch (error) {
      console.error('SSE 스트리밍 시작 실패:', error);
      setIsStreaming(false);
      alert('스트리밍 시작에 실패했습니다.');
      return null;
    }
  };

  const handleSaveResult = async () => {
    const hasContent = Object.values(streamingContent).some(content => content.trim().length > 0);
    if (!finalResult || !hasContent || isSaved || isSaving) return;

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

      const saveData = {
        user_id: 1, // TODO: 실제 사용자 ID로 교체
        image_base64: '', // TODO: 이미지를 base64로 변환 필요
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
  
  // API 응답 구조 디버깅
  console.log('🔍 API 응답 전체:', selectedResult);
  console.log('🔍 result 객체:', result);
  console.log('🔍 dataArray:', dataArray);
  console.log('🔍 firstResult:', firstResult);
  
  const diseaseInfo: DiseaseInfo = {
    disease_name: (firstResult?.disease_name as string) || (result?.disease_name as string) || '알 수 없는 질환',
    confidence: Math.round(((firstResult?.confidence as number) || (result?.confidence as number) || 0))
  };
  
  console.log('🏥 최종 diseaseInfo:', diseaseInfo);

  return (
    <ContentWrapper style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <StepIndicator />
      <MainContent>
        <ChartPanel analysisResult={diseaseInfo} />
        
        {additionalInfo && <AdditionalInfoDisplay additionalInfo={additionalInfo} />}
        
        <DetailsPanel
          diseaseInfo={diseaseInfo}
          streamingContent={streamingContent}
          additionalInfo={additionalInfo}
          activeTab={activeTab}
          isStreaming={isStreaming}
          isComplete={isComplete}
          isSaved={isSaved}
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
