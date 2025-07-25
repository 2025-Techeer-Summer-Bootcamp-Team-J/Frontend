import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ContentWrapper } from '../components/Layout';
import ChartPanel from '../components/DiseaseAnalysisStep3/ChartPanel';
import DetailsPanel from '../components/DiseaseAnalysisStep3/DetailsPanel';


import { MainContent } from '../components/DiseaseAnalysisStep3/SharedStyles';
import { api, apiClient } from '../services';
import { fileToBase64 } from '../services/utils';
import type { SaveDiagnosisRequest } from '../services/types';


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
  // 새로 추가: 질병별 백분율 목록
  diseaseStats?: Array<{ name: string; percent: number }>;
  topDiseaseName?: string;
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

// 전체 분석 결과(JSON) 타입
export interface FullAnalysisResult {
  image_analysis?: {
    skin_score?: number;
    severity?: string;
    estimated_treatment_period?: string;
  };
  text_analysis?: {
    disease_name?: string;
    ai_opinion?: string;
    detailed_description?: string;
    precautions?: string[];
    management?: Record<string, string>;
  };
}

type TabType = 'summary' | 'description' | 'precautions' | 'management' | 'photos';

const DiseaseAnalysisStep3: React.FC = () => {
  const location = useLocation();
  const { diseaseStats: navDiseaseStats = [], analysisResults: navAnalysisResults = [], uploadedFiles: navUploadedFiles = [] } = (location.state || {}) as Partial<LocationState>;
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const eventSourceRef = useRef<EventSource | null>(null);
  const hasInitializedRef = useRef<boolean>(false); // 초기화 여부 추적
  
  // 상태 관리

// selectedResult.result 타입 (필요한 필드만 정의)
interface BasicAnalysisResult {
  data?: Array<{ image?: string }>;
  image?: string;
}
  const [diseaseStats] = useState<Array<{ name: string; percent: number }>>(navDiseaseStats);

  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo>(() => {
    if (diseaseStats.length > 0) {
      const top = diseaseStats.reduce((a, b) => (b.percent > a.percent ? b : a));
      return { disease_name: top.name, confidence: top.percent };
    }
    return { disease_name: '분석 중', confidence: 0 };
  });

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

  const [activeTab, setActiveTab] = useState<TabType>('summary');
  

  const [analysisMetrics, setAnalysisMetrics] = useState<{
    skin_score?: number;
    severity?: string;
    estimated_treatment_period?: string;
  } | null>(null);

  // 이미지 모달 상태
  // 여러 장의 이미지를 모달로 보여주기 위해 배열로 관리
  

  // 전체 결과(JSON)를 상태에 반영하는 헬퍼
  const processFullResult = (full: FullAnalysisResult) => {
    if (!full) return;

    const { image_analysis, text_analysis } = full;

    if (image_analysis) {
      setAnalysisMetrics({
        skin_score: image_analysis.skin_score,
        severity: image_analysis.severity,
        estimated_treatment_period: image_analysis.estimated_treatment_period,
      });
    }

    if (text_analysis) {
      setStreamingContent({
        summary: text_analysis.ai_opinion || '',
        description: text_analysis.detailed_description || '',
        // 배열을 줄바꿈 두 번으로 연결하여 문단처럼 보이게 함
        precautions: (text_analysis.precautions || []).join('\n\n'),
        // 객체를 "key: value" 형태의 문자열로 변환하고 줄바꿈 두 번으로 연결
        management: text_analysis.management
          ? Object.entries(text_analysis.management)
              .map(([k, v]) => `${k}: ${v}`)
              .join('\n\n')
          : '',
      });
    }
  };

  // finalResult가 업데이트되면 전체 결과를 처리
  useEffect(() => {
    if (finalResult) {
      processFullResult(finalResult as FullAnalysisResult);
    }
  }, [finalResult]);
  
  // 이전 페이지에서 전달받은 데이터
  const locationState = location.state as LocationState | null;
  const { uploadedFiles = [], selectedResult = null } = locationState || {};
  // 이미지 보기 버튼 활성화 여부 (변수 선언 이후 계산)
  // 업로드된(또는 분석 결과 포함) 첫 번째 이미지를 URL 또는 Base64로 추출
  const firstImageUrl = (() => {
    // 1) navAnalysisResults에서 File 우선
    const fileResult = navAnalysisResults.find(r => (r as AnalysisResult)?.file) as AnalysisResult | undefined;
    if (fileResult?.file) {
      return URL.createObjectURL(fileResult.file);
    }
    // 2) navUploadedFiles 배열
    if (navUploadedFiles.length > 0) {
      return URL.createObjectURL(navUploadedFiles[0]);
    }
    // 3) base64 문자열 (selectedResult.result 또는 navAnalysisResults)
    const srcObj: BasicAnalysisResult | undefined = (selectedResult?.result as BasicAnalysisResult) || (navAnalysisResults[0]?.result as BasicAnalysisResult);
    const rawBase64 = srcObj?.data?.[0]?.image || srcObj?.image;
    if (typeof rawBase64 === 'string' && rawBase64.trim() !== '') {
      // dataURI prefix가 없으면 추가
      if (rawBase64.startsWith('data:')) return rawBase64;
      return `data:image/jpeg;base64,${rawBase64}`;
    }
    return undefined;
  })();


  // 사진 탭에서 사용할 전체 이미지 URL 배열
  const imageUrls: string[] = React.useMemo(() => {
    const urls: string[] = [];
    // 분석 결과 파일
    navAnalysisResults.forEach(r => {
      const ar = r as AnalysisResult;
      if (ar?.file) {
        urls.push(URL.createObjectURL(ar.file));
      } else if (ar?.result) {
        const obj = ar.result as BasicAnalysisResult;
        const raw = obj?.data?.[0]?.image || obj?.image;
        if (typeof raw === 'string' && raw.trim() !== '') {
          urls.push(raw.startsWith('data:') ? raw : `data:image/jpeg;base64,${raw}`);
        }
      }
    });
    // 업로드 파일
    if (navUploadedFiles.length > 0) {
      urls.push(...navUploadedFiles.map(f => URL.createObjectURL(f)));
    }
    if (firstImageUrl) urls.unshift(firstImageUrl);
    return Array.from(new Set(urls));
  }, [navAnalysisResults, navUploadedFiles, firstImageUrl]);





  useEffect(() => {
    if (hasInitializedRef.current) return;
    if (!selectedResult || !selectedResult.result) {
      navigate('/disease-analysis-step1');
      return;
    }
    if (!isLoaded || !user) return;

    hasInitializedRef.current = true;
    const eventSource = startSSEStreaming();

    return () => {
      if (eventSource) eventSource.close();
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
    // eslint-disable-next-line
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
      
      
      const dataArray = result?.data as unknown[];
      const firstResult = (dataArray?.[0] as Record<string, unknown>) || {};
      
      
      // 여러 경로에서 병명 찾기 시도
      const diseaseName: string = ((firstResult?.disease_name as string) || (result?.disease_name as string) || '아토피 피부염');
      
      // API 응답에서 base64 이미지 추출
      const base64Image = firstResult?.image as string;
      
      
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
          
        } catch (error) {
          console.error('🔍 base64 변환 오류:', error);
        }
      }
      
      
      
      // 이미지 파일이 없으면 에러 처리
      if (!imageFile) {
        console.error('❌ 이미지 파일을 찾을 수 없습니다');
        setIsStreaming(false);
        alert('이미지 파일을 찾을 수 없습니다. Step1부터 다시 시작해주세요.');
        navigate('/disease-analysis-step1');
        return null;
      }
      
      const userId = user!.id;

      const eventSource = api.diagnoses.generateStream(
        userId,
        diseaseName,
        (event) => {
          
          // 질병명 스트리밍
          // 질병명 / 진단명 스트리밍
          if (event.type === 'disease_name_start' || event.type === 'diagnosed_name_start') {
            setDiseaseInfo(prev => ({ ...prev, disease_name: '' }));
          } else if (event.type === 'disease_name_chunk' || event.type === 'diagnosed_name_chunk') {
            setDiseaseInfo(prev => ({
              ...prev,
              disease_name: (prev.disease_name ? prev.disease_name : '') + (event.data || '')
            }));
          }
          
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
          
          // 진행 중 스트리밍 (백엔드 'progress' 타입 처리)
          else if (event.type === 'progress') {
            const tab = event.tab as TabType | undefined;
            if (tab && event.content) {
              // 탭이 명시되어 있으면 해당 탭 콘텐츠 업데이트
              setStreamingContent(prev => ({
                ...prev,
                [tab]: event.content,
              }));
            }
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
          
          // 완료 처리: event.data에 전체 JSON 결과가 담겨옴
          else if (event.type === 'complete' || event.type === 'tab_complete') {
            // 전체 스트리밍 완료(백엔드 단일 섹션 완료 포함)
            setIsStreaming(false);
            // 진행 중이던 탭 콘텐츠가 마지막 값으로 확정되도록 이미 업데이트된 상태 사용
            // 'tab_complete'의 경우 추가 로직이 필요하면 여기에 작성
          }
          else if (event.type === 'done') {
            
            if (event.data) {
              const fullResult = JSON.parse(event.data) as FullAnalysisResult;
              setIsComplete(true);
              setIsStreaming(false);
              setFinalResult(fullResult);
            }
            return;
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
    if (isSaved || isSaving) return;

    if (!user) return;

    // 이미지 파일 결정: 선택된 결과의 파일이 없으면 업로드된 첫 이미지 사용
    let imageFile = selectedResult?.file || uploadedFiles?.[0];
    if (!imageFile) {
      // selectedResult.result에서 base64 추출 시도
      const resultObj = selectedResult?.result as BasicAnalysisResult | undefined;
      const base64Str = resultObj?.data?.[0]?.image || resultObj?.image;

      if (typeof base64Str === 'string') {
        try {
          const byteCharacters = atob(base64Str);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });
          imageFile = new File([blob], 'analysis-image.jpg', { type: 'image/jpeg' });
        } catch (e) {
          console.error('base64 → File 변환 실패:', e);
        }
      }
    }

    if (!imageFile) {
      alert('저장할 이미지 파일을 찾을 수 없습니다. 다시 시도해주세요.');
      return;
    }

    setIsSaving(true);
    try {
      const imageBase64 = await fileToBase64(imageFile);
      
      // API 스키마에 맞는 데이터 구조로 변환 (finalResult가 없더라도 안전하게 처리)
      const fullResult = (finalResult || {}) as Partial<FullAnalysisResult>;
      const saveData: SaveDiagnosisRequest = {
        user_id: user.id,
        disease_name: diseaseInfo.disease_name,
        image_base64: imageBase64,
        image_analysis: {
          disease_name: diseaseInfo.disease_name,
          confidence: diseaseInfo.confidence,
          skin_score: fullResult.image_analysis?.skin_score,
          severity: fullResult.image_analysis?.severity,
          estimated_treatment_period: fullResult.image_analysis?.estimated_treatment_period,
        },
        text_analysis: {
          ai_opinion: streamingContent.summary || fullResult.text_analysis?.ai_opinion || 'N/A',
          detailed_description: streamingContent.description || fullResult.text_analysis?.detailed_description || 'N/A',
          precautions:
            streamingContent.precautions ||
            (Array.isArray(fullResult.text_analysis?.precautions)
              ? (fullResult.text_analysis?.precautions ?? []).join('\n')
              : typeof fullResult.text_analysis?.precautions === 'string'
                ? (fullResult.text_analysis?.precautions as string)
                : 'N/A'),
          management:
            streamingContent.management ||
            (fullResult.text_analysis?.management
              ? typeof fullResult.text_analysis.management === 'object'
                ? JSON.stringify(fullResult.text_analysis.management)
                : fullResult.text_analysis.management
              : 'N/A'),
        },
      };

      // FormData 구성 (multipart/form-data)
      // Clerk 문자열 ID 그대로 사용
      const clerkId = user.id;
      const formData = new FormData();
      formData.append('user_id', user.id); // 백엔드 검증을 위해 user_id도 FormData에 포함
      formData.append('image', imageFile);
      formData.append('image_analysis', JSON.stringify(saveData.image_analysis));
      formData.append('disease_name', diseaseInfo.disease_name);
      formData.append('text_analysis', JSON.stringify(saveData.text_analysis));

      console.log('📤 진단 결과 저장 FormData:', formData);

      // Content-Type 헤더를 명시적으로 지정하지 않으면 브라우저가 boundary를 포함해 자동 설정합니다.
      await apiClient.post(`/api/diagnoses/save?user_id=${clerkId}`, formData);
      
      setIsSaved(true);
  
    } catch (error) {
      console.error('결과 저장 실패:', error);
      alert('결과 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRestart = () => {
    navigate('/disease-analysis-step1');
  };

  return (

    <ContentWrapper>
      <MainContent>
        <ChartPanel />
        <DetailsPanel
          imageUrls={imageUrls}
          diseaseInfo={diseaseInfo}
          streamingContent={streamingContent}
          analysisMetrics={analysisMetrics}
          activeTab={activeTab}
          isStreaming={isStreaming}
          isComplete={isComplete}
          isSaved={isSaved}
          isSaving={isSaving}
          setActiveTab={setActiveTab}
          onSave={handleSaveResult}
          onRestart={handleRestart}
        />
      </MainContent>
    </ContentWrapper>

  );
};

export default DiseaseAnalysisStep3;
