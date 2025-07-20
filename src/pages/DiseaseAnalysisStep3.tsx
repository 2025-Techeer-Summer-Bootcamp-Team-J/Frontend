import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';
import StepIndicator from '../components/DiseaseAnalysisStep3/StepIndicator';
import { MainContent } from '../components/DiseaseAnalysisStep3/SharedStyles';
import { generateDiagnosisStream, saveDiagnosisResult } from '../services';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faDownload, faSave } from '@fortawesome/free-solid-svg-icons';

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

// 스타일 컴포넌트
const StreamingContainer = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const StreamingTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
`;

const StreamingContent = styled.div`
  min-height: 200px;
  font-size: 1rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
  word-break: break-word;
  
  .cursor {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const AdditionalInfoBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const InfoTitle = styled.h4`
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
`;

const InfoItem = styled.div`
  color: #64748b;
  margin-bottom: 0.25rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: #2563eb;
          color: white;
          &:hover { background-color: #1d4ed8; }
        `;
      case 'secondary':
        return `
          background-color: #6b7280;
          color: white;
          &:hover { background-color: #4b5563; }
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: white;
          &:hover { background-color: #059669; }
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover { background-color: #e5e7eb; }
        `;
    }
  }}
`;

const DiseaseAnalysisStep3: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [finalResult, setFinalResult] = useState<unknown>(null);
  const [isSaved, setIsSaved] = useState(false);

  // 이전 페이지에서 전달받은 데이터
  const locationState = location.state as LocationState | null;
  const { selectedResult, additionalInfo } = locationState || { selectedResult: null, additionalInfo: undefined };

  useEffect(() => {
    if (!selectedResult || !selectedResult.result) {
      // 분석 결과가 없으면 Step1로 돌아가기
      navigate('/disease-analysis-step1');
      return;
    }

    startSSEStreaming();
  }, [selectedResult]);

  const startSSEStreaming = () => {
    if (isStreaming || !selectedResult || !selectedResult.result) return;

    setIsStreaming(true);
    setStreamingContent('');

    try {
      // 분석 결과에서 질병명 추출 (API 응답 구조에 따라 수정 필요)
      const result = selectedResult.result as Record<string, unknown>;
      const diseaseName = (result?.disease_name as string) || (result?.data as Record<string, unknown>)?.disease_name as string || 'unknown';
      const userId = 1; // TODO: 실제 사용자 ID로 교체

      generateDiagnosisStream(
        userId,
        diseaseName,
        selectedResult.file,
        (event) => {
          // SSE 이벤트 처리
          if (event.type === 'progress') {
            setStreamingContent(prev => prev + (event.content || ''));
          } else if (event.type === 'complete') {
            setIsComplete(true);
            setIsStreaming(false);
            setFinalResult(event.content);
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
    }
  };

  const handleSaveResult = async () => {
    if (!finalResult || !streamingContent.trim() || isSaved) return;

    try {
      const result = selectedResult?.result as Record<string, unknown>;
      
      // Step2에서 입력된 추가 정보 포함
      const additionalInfoText = additionalInfo ? 
        `증상: ${additionalInfo.symptoms.join(', ') || '없음'}, 가려움 정도: ${additionalInfo.itchLevel}/10, 기간: ${additionalInfo.duration}, 추가 정보: ${additionalInfo.additionalInfo}` :
        '추가 정보 없음';

      const saveData = {
        user_id: 1, // TODO: 실제 사용자 ID로 교체
        image_base64: '', // TODO: 이미지를 base64로 변환 필요
        image_analysis: {
          disease_name: (result?.disease_name as string) || 'unknown',
          confidence: (result?.confidence as number) || 0
        },
        text_analysis: {
          ai_opinion: streamingContent,
          detailed_description: `${streamingContent}\n\n[사용자 입력 정보]\n${additionalInfoText}`
        }
      };

      await saveDiagnosisResult(saveData);
      setIsSaved(true);
      alert('진단 결과가 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('결과 저장 실패:', error);
      alert('결과 저장에 실패했습니다.');
    }
  };

  const handleRestartAnalysis = () => {
    navigate('/disease-analysis-step1');
  };

  const handleDownloadReport = () => {
    // TODO: 리포트 다운로드 기능 구현
    alert('리포트 다운로드 기능을 준비 중입니다.');
  };

  if (!selectedResult) {
    return (
      <ContentWrapper style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>분석 결과를 찾을 수 없습니다.</h2>
          <StyledButton onClick={handleRestartAnalysis} style={{ marginTop: '1rem' }}>
            다시 분석하기
          </StyledButton>
        </div>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <StepIndicator />
      <MainContent>
        {additionalInfo && (
          <AdditionalInfoBox>
            <InfoTitle>입력하신 증상 정보</InfoTitle>
            <InfoItem><strong>증상:</strong> {additionalInfo.symptoms.length > 0 ? additionalInfo.symptoms.join(', ') : '없음'}</InfoItem>
            <InfoItem><strong>가려움 정도:</strong> {additionalInfo.itchLevel}/10</InfoItem>
            <InfoItem><strong>지속 기간:</strong> {additionalInfo.duration}</InfoItem>
            {additionalInfo.additionalInfo && additionalInfo.additionalInfo !== '건너뛰기 선택' && (
              <InfoItem><strong>추가 정보:</strong> {additionalInfo.additionalInfo}</InfoItem>
            )}
          </AdditionalInfoBox>
        )}
        
        <StreamingContainer>
          <StreamingTitle>
            AI 진단 결과 {isStreaming ? '생성 중...' : isComplete ? '완료' : ''}
          </StreamingTitle>
          <StreamingContent>
            {streamingContent || (isStreaming ? '분석 결과를 생성하고 있습니다...' : '준비 중...')}
            {isStreaming && <span className="cursor">|</span>}
          </StreamingContent>
        </StreamingContainer>

        <ButtonGroup>
          {isComplete && !isSaved && (
            <StyledButton $variant="success" onClick={handleSaveResult}>
              <FontAwesomeIcon icon={faSave} />
              진단 결과 저장
            </StyledButton>
          )}
          {isSaved && (
            <StyledButton $variant="secondary" onClick={handleDownloadReport}>
              <FontAwesomeIcon icon={faDownload} />
              결과 리포트 다운로드
            </StyledButton>
          )}
          <StyledButton onClick={handleRestartAnalysis}>
            <FontAwesomeIcon icon={faRedo} />
            다시 분석하기
          </StyledButton>
        </ButtonGroup>
      </MainContent>
    </ContentWrapper>
  );
};

export default DiseaseAnalysisStep3;
