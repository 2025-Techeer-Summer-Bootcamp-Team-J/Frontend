import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
// 👇 3번 파일에서 Card 스타일들을 가져옵니다.
import { ResultPageFrame, MainContent, MainTitlePanel, MainTitle, ButtonGroup, StyledButton, InfoCard, CardTitle } from '../components/DiseaseAnalysisStep3/SharedStyles';
import { api, apiClient } from '../services';
import { fileToBase64 } from '../services/utils';
import type { SaveDiagnosisRequest } from '../services/types';

// 👇 2번 파일(부품 창고)에서 모든 부품을 가져옵니다.
import { SummaryItem,AIOpinionBox, PhotoCarousel, convertLinesToMarkdown } from '../components/DiseaseAnalysisStep3/DetailsPanel';
import ReactMarkdown from 'react-markdown'; // 마크다운 렌더링 도구
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // 아이콘 도구
// 👇 카드 제목에 사용할 아이콘들을 미리 다 가져옵니다.
import { faFileMedical, faCamera, faCircleInfo, faTriangleExclamation, faBookMedical, faSpinner, faSave, faRedo } from '@fortawesome/free-solid-svg-icons';
import {FullWidthInfoCard } from '../components/DiseaseAnalysisStep3/SharedStyles';


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
// interface BasicAnalysisResult {
//   data?: Array<{ image?: string }>;
//   image?: string;
// }

  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo>(() => {
    if (navDiseaseStats.length > 0) {
      const top = navDiseaseStats[0];
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
  // const firstImageUrl = (() => {
  //   // 1) navAnalysisResults에서 File 우선
  //   const fileResult = navAnalysisResults.find(r => (r as AnalysisResult)?.file) as AnalysisResult | undefined;
  //   if (fileResult?.file) {
  //     return URL.createObjectURL(fileResult.file);
  //   }
  //   // 2) navUploadedFiles 배열
  //   if (navUploadedFiles.length > 0) {
  //     return URL.createObjectURL(navUploadedFiles[0]);
  //   }
  //   // 3) base64 문자열 (selectedResult.result 또는 navAnalysisResults)
  //   const srcObj: BasicAnalysisResult | undefined = (selectedResult?.result as BasicAnalysisResult) || (navAnalysisResults[0]?.result as BasicAnalysisResult);
  //   const rawBase64 = srcObj?.data?.[0]?.image || srcObj?.image;
  //   if (typeof rawBase64 === 'string' && rawBase64.trim() !== '') {
  //     // dataURI prefix가 없으면 추가
  //     if (rawBase64.startsWith('data:')) return rawBase64;
  //     return `data:image/jpeg;base64,${rawBase64}`;
  //   }
  //   return undefined;
  // })();


  // 사진 탭에서 사용할 전체 이미지 URL 배열
  const imageUrls: string[] = React.useMemo(() => {
    const urlMap = new Map<string, string>();

    // 1. navAnalysisResults에서 File 객체 또는 base64 이미지 추출 (순서 유지)
    navAnalysisResults.forEach(r => {
      const result = r as AnalysisResult;
      let url: string | undefined;
      let key: string | undefined;

      if (result?.file) {
        url = URL.createObjectURL(result.file);
        key = `${result.file.name}-${result.file.size}`;
      } else if (result?.result) {
        const resultData = result.result as { image?: string; data?: Array<{ image?: string }> };
        const base64Image = resultData.image || resultData.data?.[0]?.image;
        if (base64Image) {
          url = base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`;
          key = base64Image.substring(0, 100); // Use part of the base64 as a key
        }
      }

      if (url && key && !urlMap.has(key)) {
        urlMap.set(key, url);
      }
    });

    // 2. navUploadedFiles에서 URL 생성 (중복 방지)
    navUploadedFiles.forEach(file => {
      const key = `${file.name}-${file.size}`;
      if (!urlMap.has(key)) {
        urlMap.set(key, URL.createObjectURL(file));
      }
    });

    return Array.from(urlMap.values());
  }, [navAnalysisResults, navUploadedFiles]);





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

    // 순서가 보장된 첫 번째 분석 결과 또는 업로드된 파일 찾기
    const firstResult = navAnalysisResults.length > 0 ? navAnalysisResults[0] : null;
    const firstFile = navUploadedFiles.length > 0 ? navUploadedFiles[0] : null;

    let imageFile = firstResult?.file || firstFile;

    if (!imageFile && firstResult?.result) {
      const resultData = firstResult.result as { image?: string; data?: Array<{ image?: string }> };
      const base64Image = resultData.image || resultData.data?.[0]?.image;
      if (base64Image) {
        try {
          const blob = await (await fetch(base64Image.startsWith('data:') ? base64Image : `data:image/jpeg;base64,${base64Image}`)).blob();
          imageFile = new File([blob], 'analysis-image.jpg', { type: blob.type });
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
    <ResultPageFrame>
        <MainTitlePanel>
            <MainTitle>AI 진단 결과</MainTitle>
        </MainTitlePanel>
        
        {/* 2단 그리드가 여기서 시작됩니다. */}
        <MainContent>

            {/* 카드 3: 첨부 사진 */}
            <InfoCard>
                <CardTitle><FontAwesomeIcon icon={faCamera} /> 첨부 사진</CardTitle>
                {imageUrls.length > 0 ? <PhotoCarousel imageUrls={imageUrls} /> : <p>첨부된 사진이 없습니다.</p>}
            </InfoCard>

            {/* 카드 2: 종합 요약 */}
            <InfoCard>
                <CardTitle><FontAwesomeIcon icon={faFileMedical} /> 종합 요약</CardTitle>
                <SummaryItem>
                    <span className="label">의심 질환</span>
                    <span className="value disease-name">{diseaseInfo.disease_name}</span>
                </SummaryItem>
                <SummaryItem>
                    <span className="label">예상 치료 기간</span>
                    <span className="value">{analysisMetrics?.estimated_treatment_period || '4-6주'}</span>
                </SummaryItem>
                <AIOpinionBox>
                    <h4><FontAwesomeIcon icon={faFileMedical} style={{ marginRight: '0.5rem' }} />AI 소견</h4>
                    {streamingContent.summary ? <ReactMarkdown>{convertLinesToMarkdown(streamingContent.summary)}</ReactMarkdown> : <p>AI가 상세 소견을 분석중입니다...</p>}
                </AIOpinionBox>
            </InfoCard>

            {/* 카드 4: 상세 설명 */}
            <InfoCard>
                <CardTitle><FontAwesomeIcon icon={faCircleInfo} /> 상세 설명</CardTitle>
                {streamingContent.description ? <ReactMarkdown>{convertLinesToMarkdown(streamingContent.description)}</ReactMarkdown> : <p>분석중입니다...</p>}
            </InfoCard>

            {/* 카드 5: 주의사항 */}
            <InfoCard>
                <CardTitle><FontAwesomeIcon icon={faTriangleExclamation} /> 주의사항</CardTitle>
                {streamingContent.precautions ? <ReactMarkdown>{convertLinesToMarkdown(streamingContent.precautions)}</ReactMarkdown> : <p>분석중입니다...</p>}
            </InfoCard>

            {/* 카드 6:  관리법 */}
            <FullWidthInfoCard>
                <CardTitle><FontAwesomeIcon icon={faBookMedical} /> 관리법</CardTitle>
                {streamingContent.management ? <ReactMarkdown>{convertLinesToMarkdown(streamingContent.management)}</ReactMarkdown> : <p>분석중입니다...</p>}
            </FullWidthInfoCard>
        </MainContent>

        {/* 버튼들은 그리드 바깥에, 페이지 하단에 위치합니다. */}
        <ButtonGroup>
            {isComplete && (
                <StyledButton 
                    $variant="primary" 
                    onClick={handleSaveResult} 
                    disabled={isSaving || isSaved}
                >
                    {isSaving ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSave} />}
                    {isSaving ? ' 저장 중...' : isSaved ? ' 저장됨' : ' 결과 저장'}
                </StyledButton>
            )}
            <StyledButton onClick={handleRestart}>
                <FontAwesomeIcon icon={faRedo} /> 다시 분석하기
            </StyledButton>
        </ButtonGroup>
    </ResultPageFrame>
);
};

export default DiseaseAnalysisStep3;
