import { useState, useEffect } from 'react';
import { getUVIndex } from '../services/uv_indexApi';
import type { UVIndexData } from '../services/types';

import CareHeader from '../components/TodaysCare/CareHeader';
import UvIndexSection from '../components/TodaysCare/UvIndexSection';
import CareTipsSection from '../components/TodaysCare/CareTipsSection';
import { ContentWrapper } from '../components/Layout';
import { careData, getCareLevelFromUVIndex, getUVIndexFromCareLevel } from '../constants/todayscare';

function TodaysCare() {
  const [activeTab, setActiveTab] = useState<string>('보통');
  const [uvData, setUvData] = useState<UVIndexData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealTimeData, setIsRealTimeData] = useState<boolean>(true);

  useEffect(() => {
    const fetchUVIndex = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUVIndex();
        setUvData(data);
        
        if (data && data.now) {
          const uvIndex = parseInt(data.now, 10);
          const careLevel = getCareLevelFromUVIndex(uvIndex);
          setActiveTab(careLevel);
          setIsRealTimeData(true);
        } else {
          setError('UV 지수 데이터를 찾을 수 없습니다.');
          setIsRealTimeData(false);
        }
      } catch (err) {
        console.error('UV 지수를 불러오는데 실패했습니다:', err);
        setError('UV 지수를 불러오는데 실패했습니다.');
        setIsRealTimeData(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUVIndex();
  }, []);

  const handleTabClick = (level: string) => {
    setActiveTab(level);
    setIsRealTimeData(false);
  };

  // 🌡️ 실시간 버튼 클릭 시 최신 UV 지수 재조회
  const handleRealTimeClick = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 최신 UV 지수 조회
      const data = await getUVIndex();
      setUvData(data);

      if (data && data.now) {
        const uvIndex = parseInt(data.now, 10);
        const careLevel = getCareLevelFromUVIndex(uvIndex);
        setActiveTab(careLevel);
        setIsRealTimeData(true);
      } else {
        setError('실시간 UV 지수 데이터를 가져오지 못했습니다.');
      }
    } catch (err) {
      console.error('실시간 UV 지수를 불러오는데 실패했습니다:', err);
      setError('실시간 UV 지수를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const currentCareData = careData[activeTab];

  const displayUVIndex = isRealTimeData && uvData
    ? uvData.now
    : getUVIndexFromCareLevel(activeTab).toString();

  return (
    <>
      <CareHeader />
      
      <main>
      <ContentWrapper style={{ marginBottom: '2rem' }}>
        <UvIndexSection
          uvData={uvData}
          isLoading={isLoading}
          error={error}
          isRealTimeData={isRealTimeData}
          currentCareData={currentCareData}
          displayUVIndex={displayUVIndex}
        />
        </ContentWrapper>

        <CareTipsSection
          careData={careData}
          activeTab={activeTab}
          isRealTimeData={isRealTimeData}
          uvData={uvData}
          handleRealTimeClick={handleRealTimeClick}
          handleTabClick={handleTabClick} 
        />
      </main>
    </>
  );
}

export default TodaysCare;
