import { useState, useEffect } from 'react';
import { getUVIndex } from '../services/uv_indexApi';
import type { UVIndexData } from '../services/types';

import CareHeader from '../components/TodaysCare/CareHeader';
import UvIndexSection from '../components/TodaysCare/UvIndexSection';
import CareTipsSection from '../components/TodaysCare/CareTipsSection';

// --- 타입 정의 --- //
interface Tip {
  icon: string;
  title: string;
  description: string;
}

interface CareLevelData {
  index: number;
  color: string;
  range: string; // 범위 속성 추가
  summary: {
    title: string;
    description: string;
  };
  tips: Tip[];
}

interface CareData {
  [key: string]: CareLevelData;
}

// --- 데이터 --- //
const careData: CareData = {
    '낮음': { index: 1, range: '0-2', color: '#22C55E', summary: { title: '오늘은 날씨가 좋아요!', description: '대부분 안전하지만, 민감성 피부는 가벼운 자외선 차단제를 사용하는 것이 좋습니다.'}, tips: [ { icon: '☀️', title: '자외선 차단제', description: '흐린 날에도 자외선은 존재해요. SPF 15 이상의 자외선 차단제를 사용하세요.' }, { icon: '😎', title: '보호 장비', description: '특별한 보호는 필요 없지만, 민감성 피부는 선글라스를 착용하는 것이 좋습니다.' } ]},
    '보통': { index: 4, range: '3-5', color: '#F59E0B', summary: { title: '오늘의 외출, 준비가 필요해요', description: '외출 30분 전 자외선 차단제를 바르고, 햇볕이 강한 시간대에는 그늘을 활용하세요.'}, tips: [ { icon: '🧴', title: '자외선 차단제 필수', description: 'SPF 30, PA++ 이상의 자외선 차단제를 외출 30분 전에 바르세요.' }, { icon: '👒', title: '모자 및 의류', description: '햇볕이 강한 시간대(오전 10시~오후 3시)에는 그늘을 찾고, 넓은 챙의 모자를 쓰세요.' }, { icon: '🕶️', title: '선글라스 착용', description: '눈 건강을 위해 자외선 차단 기능이 있는 선글라스를 착용하세요.' } ]},
    '높음': { index: 7, range: '6-7', color: '#F97316', summary: { title: '오늘은 외출 시 주의가 필요해요', description: '자외선 차단제를 꼼꼼히 바르고, 2시간마다 덧발라주세요. 가능한 한 긴 소매 옷을 착용하는 것이 좋습니다.'}, tips: [ { icon: '🧴', title: '차단 지수 높은 제품 사용', description: 'SPF 50, PA+++ 이상의 강력한 자외선 차단제를 사용하고, 2시간마다 덧발라주세요.' }, { icon: '👕', title: '긴 소매 옷 착용', description: '피부 보호를 위해 긴 소매 옷, 긴 바지를 입어 노출을 최소화하세요.' }, { icon: '🏠', title: '실내 활동 권장', description: '햇볕이 가장 강한 시간에는 가급적 실내에 머무르는 것이 안전합니다.' } ]},
    '매우 높음': { index: 9, range: '8-10', color: '#EF4444', summary: { title: '강한 자외선, 외출을 자제하세요', description: '피부가 쉽게 손상될 수 있습니다. 오전 10시부터 오후 3시까지는 실내에 머무르는 것을 강력히 권장합니다.'}, tips: [ { icon: '🚫', title: '외출 자제', description: '오전 10시부터 오후 3시까지는 외출을 삼가는 것이 가장 좋습니다.' }, { icon: '💧', title: '수분 보충', description: '피부가 쉽게 건조해지고 열을 받을 수 있으니, 물을 충분히 마셔주세요.' }, { icon: '🌿', title: '진정 케어', description: '외출 후에는 알로에 젤 등으로 피부를 진정시켜주는 것이 중요합니다.' } ]},
    '위험': { index: 11, range: '11+', color: '#8B5CF6', summary: { title: '위험 수준! 외출은 절대 금물입니다', description: '짧은 시간의 노출에도 피부가 심각한 화상을 입을 수 있습니다. 반드시 실내에 머무르세요.'}, tips: [ { icon: '🚨', title: '외출 금지 수준', description: '햇볕에 몇 분만 노출되어도 화상을 입을 수 있습니다. 외출을 절대적으로 피하세요.' }, { icon: '🛡️', title: '완벽한 차단', description: '부득이하게 외출 시, 자외선 차단 의류, 모자, 선글라스 등 모든 수단을 동원하세요.' }, { icon: '❄️', title: '쿨링 및 진정', description: '실내에서도 시원하게 유지하고, 피부 온도를 낮추는 데 신경 써야 합니다.' } ]}
};

// UV 지수에 따른 케어 레벨 결정 함수
const getCareLevelFromUVIndex = (uvIndex: number): string => {
  if (uvIndex <= 2) return '낮음';
  if (uvIndex <= 5) return '보통';
  if (uvIndex <= 7) return '높음';
  if (uvIndex <= 10) return '매우 높음';
  return '위험';
};

// 케어 레벨에 해당하는 대표 UV 지수 매핑
const getUVIndexFromCareLevel = (careLevel: string): number => {
  switch (careLevel) {
    case '낮음': return 1;
    case '보통': return 4;
    case '높음': return 7;
    case '매우 높음': return 9;
    case '위험': return 11;
    default: return 1;
  }
};

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

  const handleRealTimeClick = () => {
    if (uvData && uvData.now) {
      const uvIndex = parseInt(uvData.now, 10);
      const careLevel = getCareLevelFromUVIndex(uvIndex);
      setActiveTab(careLevel);
      setIsRealTimeData(true);
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
        <UvIndexSection
          uvData={uvData}
          isLoading={isLoading}
          error={error}
          isRealTimeData={isRealTimeData}
          currentCareData={currentCareData}
          displayUVIndex={displayUVIndex}
        />

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