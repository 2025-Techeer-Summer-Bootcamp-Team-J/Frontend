import React from 'react';
import {
  UvInfoBox,
  UvInfoInnerWrapper,
  UvIndexDisplay,
  UvIndexVisual,
  UvIndexText,
  LocationStatus,
  UvSummary,
} from './SharedStyles';
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

interface UvIndexSectionProps {
  uvData: UVIndexData | null;
  isLoading: boolean;
  error: string | null;
  isRealTimeData: boolean;
  currentCareData: CareLevelData;
  displayUVIndex: string;
}

const UvIndexSection: React.FC<UvIndexSectionProps> = ({
  uvData,
  isLoading,
  error,
  isRealTimeData,
  currentCareData,
  displayUVIndex,
}) => {
  if (isLoading) {
    return (
      <UvInfoBox>
        <UvInfoInnerWrapper>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>자외선 지수를 불러오는 중...</p>
          </div>
        </UvInfoInnerWrapper>
      </UvInfoBox>
    );
  }

  return (
    <UvInfoBox>
      <UvInfoInnerWrapper>
        <UvIndexDisplay>
          <UvIndexVisual $bgColor={currentCareData.color}>
            <span>UV 지수</span>
            <span>{displayUVIndex}</span>
          </UvIndexVisual>
          <UvIndexText>
            <LocationStatus $isRealTime={isRealTimeData}>
              {isRealTimeData ? `${uvData?.location || '현재 위치'} (실시간)` : '케어 단계별 정보'}
            </LocationStatus>
            <h2>{currentCareData.summary.title}</h2>
            {isRealTimeData && uvData?.date && (
              <p style={{ fontSize: '0.875rem', color: '#64748B', margin: '0.25rem 0 0 0' }}>
                측정 시간: {uvData.date}
              </p>
            )}
            {error && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{error}</p>}
          </UvIndexText>
        </UvIndexDisplay>
        <UvSummary>
          <p><strong>{currentCareData.summary.title}</strong></p>
          <p>{currentCareData.summary.description}</p>
        </UvSummary>
      </UvInfoInnerWrapper>
    </UvInfoBox>
  );
};

export default UvIndexSection;
