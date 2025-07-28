import React from 'react';

import styled from 'styled-components';


// 1. 재사용할 부품들 앞에 export를 붙여줍니다.

// 이 함수는 1번 파일에서 마크다운 변환을 위해 계속 사용합니다.
export const convertLinesToMarkdown = (text?: string): string => {
  if (!text) return '';
  const preSection = text.replace(/\s*(?=(정의|특징|원인|증상)\s*[:：])/g, '\n');
  const preProcessed = preSection.replace(/([.!?])\s+/g, '$1\n');
  const lines = preProcessed.split('\n').filter(l => l.trim() !== '');
  return lines
    .map((line) => {
      const trimmed = line.trim();
      if (/^(\d+\.|[①②③④⑤⑥⑦⑧⑨⑩])/.test(trimmed)) {
        return trimmed;
      }
      if (trimmed.includes(':')) {
        const splitIndex = trimmed.indexOf(':');
        const key = trimmed.slice(0, splitIndex).trim();
        const value = trimmed.slice(splitIndex + 1).trim();
        if (!value) {
          return `- **${key}**`;
        }
        return `- **${key}**:\n  ${value}`;
      }
      return `- ${trimmed}`;
    })
    .join('\n');
};

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

export const AIOpinionBox = styled.div`
  background: #f0f9ff;
  border-left: 4px solid #05A6FD;
  padding: 1rem 1rem 0.3rem 1rem;
  margin: 1rem 0 0rem 0;
  border-radius: 0 1rem 1rem 0;

  h4 {
    color: #05A6FD;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }

  p { color: #05A6FD; margin: 0; 
    margin-bottom: 0.5rem;}
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
import { CardTitle, InfoCard } from './SharedStyles';

// DetailsPanel 컴포넌트가 부모로부터 받을 데이터의 타입을 정의합니다.
// DiagnosisDetailPage에서 보내주는 props와 일치해야 합니다.
interface DetailsPanelProps {
  imageUrls: string[];
  diseaseInfo: { disease_name?: string; confidence?: number };
  streamingContent: { summary?: string; description?: string; precautions?: string; management?: string; };
  analysisMetrics: { estimated_treatment_period?: string };
  // 👇 부모로부터 추가로 받아올 데이터 타입을 여기에 모두 적어줍니다.
  isStreaming: boolean;
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
}) => {
  return (
    <> 
      
      {/* 종합 요약 카드 */}
      <InfoCard>
          <CardTitle>종합 요약</CardTitle>
          <SummaryItem>
              <span className="label">의심 질환</span>
              <span className="value disease-name">{diseaseInfo.disease_name}</span>
          </SummaryItem>
          <SummaryItem>
              <span className="label">확률</span>
              <span className="value">{diseaseInfo.confidence}%</span>
          </SummaryItem>
          <SummaryItem>
              <span className="label">심각도</span>
              <SeverityBar><SeverityBarInner $severity={diseaseInfo.confidence || 0} /></SeverityBar>
          </SummaryItem>
          <SummaryItem>
              <span className="label">예상 치료 기간</span>
              <span className="value">{analysisMetrics?.estimated_treatment_period || 'N/A'}</span>
          </SummaryItem>
          <AIOpinionBox>
              <h4>AI 소견</h4>
              <p>{streamingContent.summary || '상세 소견 분석 중입니다...'}</p>
          </AIOpinionBox>
      </InfoCard>

      {/* 첨부 사진 카드 */}
      <InfoCard>
          <CardTitle>첨부 사진</CardTitle>
          {imageUrls.length > 0 ? <PhotoCarousel imageUrls={imageUrls} /> : <p>첨부된 사진이 없습니다.</p>}
      </InfoCard>

      {/* 상세 설명 카드 */}
      <InfoCard>
          <CardTitle>상세 설명</CardTitle>
          <p>{streamingContent.description || '상세 설명이 없습니다.'}</p>
      </InfoCard>

      {/* 주의사항 카드 */}
      <InfoCard>
          <CardTitle>주의사항</CardTitle>
          <p>{streamingContent.precautions || '주의사항이 없습니다.'}</p>
      </InfoCard>

      {/* 관리법 카드 */}
      <InfoCard>
          <CardTitle>관리법</CardTitle>
          <p>{streamingContent.management || '관리법 정보가 없습니다.'}</p>
      </InfoCard>
    </>
  );
};

// 진짜 DetailsPanel 컴포넌트를 기본값으로 내보냅니다.
export default DetailsPanel;