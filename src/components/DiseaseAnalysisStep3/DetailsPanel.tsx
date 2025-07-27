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
  .disease-name { color: #2B57E5; font-weight: 700; }
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
  border-left: 4px solid #157FF1;
  padding: 1rem 1rem 0.3rem 1rem;
  margin: 1rem 0;
  border-radius: 0 1rem 1rem 0;

  h4 {
    color: #2B57E5;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }

  p { color: #1e40af; margin: 0; }
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

export default {};