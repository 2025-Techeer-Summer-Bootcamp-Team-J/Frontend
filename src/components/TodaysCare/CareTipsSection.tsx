import React from 'react';
import {
  CareTipsContainer,
  TabsContainer,
  TabButton,
  TabRange,
  TipsContent,
  TipCard,
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';
import type { UVIndexData } from '../../services/types';

interface Tip {
  icon: string;
  title: string;
  description: string;
}

interface CareLevelData {
  index: number;
  color: string;
  range: string;
  summary: {
    title: string;
    description: string;
  };
  tips: Tip[];
}

interface CareData {
  [key: string]: CareLevelData;
}

interface CareTipsSectionProps {
  careData: CareData;
  activeTab: string;
  isRealTimeData: boolean;
  uvData: UVIndexData | null;
  handleRealTimeClick: () => void;
  handleTabClick: (level: string) => void;
}

const CareTipsSection: React.FC<CareTipsSectionProps> = ({
  careData,
  activeTab,
  isRealTimeData,
  uvData,
  handleRealTimeClick,
  handleTabClick,
}) => {
  const currentCareData = careData[activeTab];

  return (
    <ContentWrapper>
      <CareTipsContainer>
        <TabsContainer>
          <TabButton
            $active={isRealTimeData}
            onClick={handleRealTimeClick}
            disabled={!uvData}
          >
            🌡️ 실시간
          </TabButton>
          {Object.entries(careData).map(([level, data]) => (
            <TabButton
              key={level}
              $active={!isRealTimeData && activeTab === level}
              onClick={() => handleTabClick(level)}
            >
              {level}
              <TabRange>({data.range})</TabRange>
            </TabButton>
          ))}
        </TabsContainer>
        <TipsContent>
          {currentCareData.tips.map((tip, index) => (
            <TipCard key={index}>
              <span className="icon" role="img" aria-label="icon">{tip.icon}</span>
              <div>
                <h4>{tip.title}</h4>
                <p>{tip.description}</p>
              </div>
            </TipCard>
          ))}
        </TipsContent>
      </CareTipsContainer>
    </ContentWrapper>
  );
};

export default CareTipsSection;
