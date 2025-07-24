import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FaCommentMedical } from 'react-icons/fa';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

// 라인 배열을 마크다운 리스트로 변환

const convertLinesToMarkdown = (text?: string): string => {
  if (!text) return '';
  // "정의:", "특징:", "원인:" 등 주요 구분 키워드 앞에 줄바꿈 삽입
  const preSection = text.replace(/\s*(?=(정의|특징|원인|증상)\s*[:：])/g, '\n');
  // 마침표/물음표/느낌표 뒤에 줄바꿈 추가해 문장 단위 분리
  const preProcessed = preSection.replace(/([.!?])\s+/g, '$1\n');
  const lines = preProcessed.split('\n').filter(l => l.trim() !== '');
  return lines
    .map((line) => {
      const trimmed = line.trim();
      // 이미 번호가 있는 경우(1. 또는 ① 등) 그대로 사용
      if (/^(\d+\.|[①②③④⑤⑥⑦⑧⑨⑩])/.test(trimmed)) {
        return trimmed;
      }
      // key: value 구조 → **key**: value
      if (trimmed.includes(':')) {
        const splitIndex = trimmed.indexOf(':');
        const key = trimmed.slice(0, splitIndex).trim();
        const value = trimmed.slice(splitIndex + 1).trim();
        // 값이 없으면 키만 볼드 처리하여 반환
        if (!value) {
          return `- **${key}**`;
        }
        return `- **${key}**:\n  ${value}`;
      }
      return `- ${trimmed}`;
    })
    .join('\n');
};
import {
  DetailsPanelContainer,
  DetailsBox,
  TabNav,
  TabButton,
  TabContentContainer,
  TabContent,
  ButtonGroup,
  StyledButton,
  SectionTitle,
} from './SharedStyles';

// 새로운 스타일 컴포넌트들
const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: #374151;
  }

  .value {
    color: #1f2937;
    font-weight: 500;
  }

  .disease-name {
    color: #2563eb;
    font-weight: 700;
  }
`;

const SeverityBar = styled.div`
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  width: 200px;
`;

const SeverityBarInner = styled.div<{ $severity: number }>`
  height: 100%;
  background: ${props => 
    props.$severity >= 70 ? '#ef4444' : 
    props.$severity >= 40 ? '#f97316' : '#10b981'
  };
  width: ${props => props.$severity}%;
  transition: width 0.3s ease;
`;

const AIOpinionBox = styled.div`
  background: #f0f9ff;
  border-left: 4px solid #2563eb;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 0.5rem 0.5rem 0;

  h4 {
    color: #1e40af;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }

  p {
    color: #1e40af;
    margin: 0;
  }
`;

const StreamingTabContent = styled(TabContent)`
  /* 커서 애니메이션 제거 */

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

`;

export type TabType = 'photos' | 'summary' | 'description' | 'precautions' | 'management';

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

interface AnalysisMetrics {
  skin_score?: number;
  severity?: string;
  estimated_treatment_period?: string;
}

interface DetailsPanelProps {
  imageUrls?: string[];
  diseaseInfo: DiseaseInfo;
  streamingContent: StreamingContent;
  analysisMetrics: AnalysisMetrics | null;
  activeTab: TabType;
  isStreaming: boolean;
  isComplete: boolean;
  isSaved: boolean;
  isSaving: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<TabType>>;
  onSave: () => void;
  onRestart: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  diseaseInfo,
  streamingContent,
  analysisMetrics,
  activeTab,
  isStreaming,
  isComplete,
  isSaved,
  isSaving,
  setActiveTab,
  onSave,
  onRestart,
  imageUrls = [],
}) => {
  // 개발 시 스트리밍 상태 확인용 (프로덕션에서 제거 가능)
  console.log('🎭 DetailsPanel 스트리밍 상태:', isStreaming);
  console.log('🎭 DetailsPanel streamingContent:', streamingContent);
  console.log('🎭 DetailsPanel activeTab:', activeTab);
  return (
    <DetailsPanelContainer>
      <SectionTitle>AI 진단 결과</SectionTitle>
      
      <DetailsBox>
        <TabNav>
        <TabButton $isActive={activeTab==='photos'} onClick={()=>setActiveTab('photos')}>사진</TabButton>
          <TabButton $isActive={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
            요약
          </TabButton>
          <TabButton $isActive={activeTab === 'description'} onClick={() => setActiveTab('description')}>
            상세 설명
          </TabButton>
          <TabButton $isActive={activeTab === 'precautions'} onClick={() => setActiveTab('precautions')}>
            주의사항
          </TabButton>
          <TabButton $isActive={activeTab === 'management'} onClick={() => setActiveTab('management')}>
            관리법
          </TabButton>
        </TabNav>

        <TabContentContainer>
          {activeTab === 'photos' && (
            <StreamingTabContent>
              {imageUrls.length === 0 ? (
                <p>이미지가 없습니다.</p>
              ) : (
                <PhotoCarousel imageUrls={imageUrls} />
              )}
            </StreamingTabContent>
          )}

          {activeTab === 'summary' && (
            <StreamingTabContent>
              <SummaryItem>
                <span className="label">의심 질환</span>
                <span className="value disease-name">{diseaseInfo.disease_name}</span>
              </SummaryItem>
              <SummaryItem>
                <span className="label">확률</span>
                <span className="value">{diseaseInfo.confidence}%</span>
              </SummaryItem>
              {analysisMetrics && (
                <>
                  <SummaryItem>
                    <span className="label">피부 점수</span>
                    <span className="value">{analysisMetrics.skin_score}점</span>
                  </SummaryItem>
                  <SummaryItem>
                    <span className="label">심각도</span>
                    <span className="value">{analysisMetrics.severity || '중등도'}</span>
                  </SummaryItem>
                  <SummaryItem>
                    <span className="label">예상 치료 기간</span>
                    <span className="value">{analysisMetrics.estimated_treatment_period || '2-4주'}</span>
                  </SummaryItem>
                </>
              )}
              {!analysisMetrics && (
                <>
                  <SummaryItem>
                    <span className="label">심각도</span>
                    <SeverityBar>
                      <SeverityBarInner $severity={diseaseInfo.confidence} />
                    </SeverityBar>
                  </SummaryItem>
                  <SummaryItem>
                    <span className="label">예상 치료 기간</span>
                    <span className="value">
                      {diseaseInfo.confidence >= 70 ? '2-3주' : diseaseInfo.confidence >= 40 ? '3-4주' : '4-6주'}
                    </span>
                  </SummaryItem>
                </>
              )}
              
              <AIOpinionBox>
                <h4><FaCommentMedical style={{ marginRight: '0.5rem' }} />AI 소견 및 주의사항</h4>
                {streamingContent.summary ? (
                  <ReactMarkdown>{convertLinesToMarkdown(streamingContent.summary)}</ReactMarkdown>
                ) : (
                  <p>AI가 상세 소견을 분석중입니다. 잠시만 기다려주세요...</p>
                )}
              </AIOpinionBox>
            </StreamingTabContent>
          )}

          {activeTab === 'description' && (
            <StreamingTabContent>
              <h3>{diseaseInfo.disease_name}이란?</h3>
              <div style={{ marginBottom: '1rem' }}>
                {streamingContent.description ? (
                  <ReactMarkdown>{convertLinesToMarkdown(streamingContent.description)}</ReactMarkdown>
                ) : (
                  <p>분석중입니다. 잠시만 기다려주세요...</p>
                )}
              </div>
            </StreamingTabContent>
          )}

          {activeTab === 'precautions' && (
            <StreamingTabContent>
              <h3>{diseaseInfo.disease_name} 주의사항</h3>
              {streamingContent.precautions ? (
                <ReactMarkdown>{convertLinesToMarkdown(streamingContent.precautions)}</ReactMarkdown>
              ) : (
                <p>분석중입니다. 잠시만 기다려주세요...</p>
              )}
            </StreamingTabContent>
          )}

          {activeTab === 'management' && (
            <StreamingTabContent>
              <h3>{diseaseInfo.disease_name} 관리법</h3>
              {streamingContent.management ? (
                <ReactMarkdown>{convertLinesToMarkdown(streamingContent.management)}</ReactMarkdown>
              ) : (
                <p>분석중입니다. 잠시만 기다려주세요...</p>
              )}
            </StreamingTabContent>
          )}
        </TabContentContainer>
      </DetailsBox>

      <ButtonGroup>
        {isComplete && (
          <StyledButton 
            $variant="primary" 
            onClick={onSave} 
            disabled={isSaving || isSaved}
          >
            {isSaving ? (
              <FontAwesomeIcon icon={faSpinner} />
            ) : (
              <FontAwesomeIcon icon={faSave} />
            )}
            {isSaving ? '저장 중...' : isSaved ? '저장됨' : '결과 저장'}
          </StyledButton>
        )}


        <StyledButton onClick={onRestart}>
          <FontAwesomeIcon icon={faRedo} /> 다시 분석하기
        </StyledButton>
      </ButtonGroup>
    </DetailsPanelContainer>
  );
};

// 간단한 캐러셀 컴포넌트
const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CarouselImg = styled.img`
  max-width: 100%;
  max-height: 60vh;
  object-fit: contain;
  border-radius: 0.5rem;
`;
const NavBtns = styled.div`
  margin-top: 0.5rem;
  button {
    margin: 0 0.5rem;
    padding: 0.25rem 0.75rem;
  }
`;
const PhotoCarousel: React.FC<{imageUrls:string[]}> = ({ imageUrls }) => {
  const [idx,setIdx]=React.useState(0);
  if(imageUrls.length===0) return null;
  const prev=()=>setIdx((idx-1+imageUrls.length)%imageUrls.length);
  const next=()=>setIdx((idx+1)%imageUrls.length);
  return (
    <CarouselWrapper>
      <CarouselImg src={imageUrls[idx]} alt={`photo-${idx+1}`} />
      {imageUrls.length>1 && (
        <NavBtns>
          <button onClick={prev}>이전</button>
          <span>{idx+1}/{imageUrls.length}</span>
          <button onClick={next}>다음</button>
        </NavBtns>
      )}
    </CarouselWrapper>
  );
};

export default DetailsPanel;
