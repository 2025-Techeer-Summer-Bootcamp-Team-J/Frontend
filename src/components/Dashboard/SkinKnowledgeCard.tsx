import React from 'react';
import styled from 'styled-components';

// SVG 아이콘 컴포넌트들
const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

interface KnowledgeItem {
  icon: React.ReactNode;
  title: string;
  text: string;
  color: 'blue' | 'yellow';
}

interface SkinKnowledgeCardProps {
  className?: string;
}

const SkinKnowledgeCard: React.FC<SkinKnowledgeCardProps> = ({ className }) => {
  const knowledgeItems: KnowledgeItem[] = [
    {
      icon: <InfoIcon />,
      title: '보습의 골든타임',
      text: '샤워 후 3분 안에 보습제를 발라주면 피부 수분 손실을 효과적으로 막을 수 있어요.',
      color: 'blue'
    },
    {
      icon: <WarningIcon />,
      title: '자외선 차단제의 진실',
      text: '흐린 날에도 자외선은 존재해요. 날씨와 상관없이 자외선 차단제를 사용하는 습관이 중요합니다.',
      color: 'yellow'
    }
  ];

  return (
    <div className={className}>
      <CardTitle>피부 지식</CardTitle>
      <KnowledgeContainer>
        {knowledgeItems.map((item, index) => (
          <InfoBox key={index} color={item.color}>
            <InfoTitle>
              {item.icon} {item.title}
            </InfoTitle>
            <InfoText>{item.text}</InfoText>
          </InfoBox>
        ))}
      </KnowledgeContainer>
    </div>
  );
};

export default SkinKnowledgeCard;

// Styled Components
const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 1rem;
`;

const KnowledgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoBox = styled.div<{ color: 'blue' | 'yellow' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ color }) => (color === 'blue' ? '#eff6ff' : '#fefce8')};
  h4, p { color: ${({ color }) => (color === 'blue' ? '#1d4ed8' : '#a16207')}; }
`;

const InfoTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin: 0;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
`; 