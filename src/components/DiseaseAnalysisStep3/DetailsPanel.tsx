import React from 'react';

import styled from 'styled-components';


// 1. 재사용할 부품들 앞에 export를 붙여줍니다.

// 이 함수는 1번 파일에서 마크다운 변환을 위해 계속 사용합니다.
/* convertLinesToMarkdown 함수를 markdownUtils.ts로 이동했습니다. */

// 아래의 모든 스타일 컴포넌트들은 1번 파일에서 UI를 조립할 때 사용합니다.
export const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  .label { font-weight: 600; color: #374151; }
  .value { color: #1f2937; font-weight: 500; }
  .disease-name { color: #05A6FD; font-weight: 700; }
`;

export const SeverityBar = styled.div`
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  width: 200px;
`;

export const SeverityBarInner = styled.div<{ $severity: number }>`
  height: 100%;
  background: ${props => 
    props.$severity >= 70 ? '#ef4444' : 
    props.$severity >= 40 ? '#f97316' : '#10b981'
  };
  width: ${props => props.$severity}%;
  transition: width 0.3s ease;
`;





const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CarouselImg = styled.img`
  width: 100%;
  height: auto;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 0.5rem;
`;
const NavBtns = styled.div`
  margin-top: 0.5rem;
  button { margin: 0 0.5rem; padding: 0.25rem 0.75rem; }
`;
export const PhotoCarousel: React.FC<{imageUrls:string[]}> = ({ imageUrls }) => {
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

/* export default {}; */
import { CardTitle, InfoCard, FullWidthInfoCard, AIOpinionBox } from './SharedStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faFileMedical, faCircleInfo, faTriangleExclamation, faBookMedical, faLink } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';
import { convertLinesToMarkdown } from './markdownUtils';

// DetailsPanel 컴포넌트가 부모로부터 받을 데이터의 타입을 정의합니다.
// DiagnosisDetailPage에서 보내주는 props와 일치해야 합니다.
interface DetailsPanelProps {
  /** 출처 문자열(줄바꿈 \n 구분) – 존재하면 하단 카드 렌더링 */
  references?: string;
  showProbabilitySeverity?: boolean;
  imageUrls: string[];
  /** 첨부 사진 카드 표시 여부 (기본 true) */
  showImageCard?: boolean;
  diseaseInfo: { disease_name?: string; confidence?: number };
  streamingContent: { summary?: string; description?: string; precautions?: string; management?: string; };
  analysisMetrics: { skin_score?: number; estimated_treatment_period?: string };
  // 분석 실시간 여부
  isStreaming: boolean;
  // 👇 부모로부터 추가로 받아올 데이터 타입을 여기에 모두 적어줍니다.
  isComplete: boolean;
  isSaved: boolean;
  isSaving: boolean;
  onSave: () => void;
  onRestart: () => void;
}

// 기존 부품들을 조립하여 진짜 DetailsPanel 컴포넌트를 만듭니다.
const DetailsPanel: React.FC<DetailsPanelProps> = ({
  imageUrls,
  diseaseInfo,
  streamingContent,
  analysisMetrics,
  isStreaming,
  showImageCard = true,
  showProbabilitySeverity = true,
  references,
}) => {
  return (
    <>
      
      {/* 상단 2열: 첨부 사진 | 종합 요약 (부모 MainContent 그리드 2열 활용) */}
      {showImageCard && (
        <InfoCard>
          <CardTitle><FontAwesomeIcon icon={faCamera} /> 첨부 사진</CardTitle>
          {imageUrls.length > 0 ? <PhotoCarousel imageUrls={imageUrls} /> : <p>첨부된 사진이 없습니다.</p>}
        </InfoCard>
      )}
      <InfoCard>
          <CardTitle><FontAwesomeIcon icon={faFileMedical} /> 종합 요약</CardTitle>
          <SummaryItem>
              <span className="label">의심 질환</span>
              <span className="value disease-name">{diseaseInfo.disease_name}</span>
          </SummaryItem>
          {showProbabilitySeverity && (
            <>
           <SummaryItem>
               <span className="label">확률</span>
               <span className="value">{diseaseInfo.confidence}%</span>
           </SummaryItem>
           <SummaryItem>
               <span className="label">심각도</span>
               <SeverityBar><SeverityBarInner $severity={diseaseInfo.confidence || 0} /></SeverityBar>
           </SummaryItem>
           </>
          )}
          <SummaryItem>
              <span className="label">피부 점수</span>
              <span className="value">{isStreaming ? '분석중입니다.' : (analysisMetrics?.skin_score ?? '-')}</span>
          </SummaryItem>
          <SummaryItem>
              <span className="label">예상 치료 기간</span>
              <span className="value">{isStreaming ? '분석중입니다.' : (analysisMetrics?.estimated_treatment_period ?? '-') }</span>
          </SummaryItem>
          <AIOpinionBox>
              <CardTitle as="h3"><FontAwesomeIcon icon={faFileMedical} /> AI 소견</CardTitle>
              {streamingContent.summary ? (
                <ReactMarkdown>{convertLinesToMarkdown(streamingContent.summary)}</ReactMarkdown>
              ) : (
                <p>상세 소견 분석 중입니다...</p>
              )}
          </AIOpinionBox>
      </InfoCard>
      <InfoCard>
          <CardTitle><FontAwesomeIcon icon={faCircleInfo} /> 상세 설명</CardTitle>
          {streamingContent.description ? (
            <ReactMarkdown>{convertLinesToMarkdown(streamingContent.description)}</ReactMarkdown>
          ) : (
            <p>상세 설명이 없습니다.</p>
          )}
      </InfoCard>
      <InfoCard>
          <CardTitle><FontAwesomeIcon icon={faTriangleExclamation} /> 주의사항</CardTitle>
          {streamingContent.precautions ? (
            <ReactMarkdown>{convertLinesToMarkdown(streamingContent.precautions)}</ReactMarkdown>
          ) : (
            <p>주의사항이 없습니다.</p>
          )}
      </InfoCard>
      <FullWidthInfoCard>
          <CardTitle><FontAwesomeIcon icon={faBookMedical} /> 관리법</CardTitle>
          {streamingContent.management ? (
            <ReactMarkdown>{convertLinesToMarkdown(streamingContent.management)}</ReactMarkdown>
          ) : (
            <p>관리법 정보가 없습니다.</p>
          )}
      </FullWidthInfoCard>

      {references && (
        <FullWidthInfoCard>
          <CardTitle><FontAwesomeIcon icon={faLink} /> 출처</CardTitle>
          <ReactMarkdown>{convertLinesToMarkdown(references)}</ReactMarkdown>
        </FullWidthInfoCard>
      )}
    </>
  );
};

// 진짜 DetailsPanel 컴포넌트를 기본값으로 내보냅니다.
export default DetailsPanel;