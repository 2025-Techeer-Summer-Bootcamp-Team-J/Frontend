import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ContentWrapper } from '../components/Layout';
import { getUVIndex } from '../services/uv_indexApi';
import type { UVIndexResponse } from '../services/types';

// --- 타입 정의 (기존과 동일) --- //
interface Tip {
  icon: string;
  title: string;
  description: string;
}

interface CareLevelData {
  index: number;
  color: string;
  summary: {
    title: string;
    description: string;
  };
  tips: Tip[];
}

interface CareData {
  [key: string]: CareLevelData;
}

// --- 스타일 컴포넌트 정의 (rem 및 clamp() 적용하여 수정) --- //
const Header = styled.header`
  text-align: center;
  padding: 3rem 0;

  h1 {
    font-size: clamp(2rem, 5vw, 2.5rem); /* clamp 적용 */
    font-weight: 700;
    color: #1E293B;
    margin: 0;
  }
  p {
    font-size: clamp(1rem, 2vw, 1.25rem); /* clamp 적용 */
    color: #64748B;
    margin-top: 0.5rem;
  }
`;

const UvInfoBox = styled.div`
  width: 100%;
  background-color: #F0F9FF;
  padding: 2.5rem 0;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 2rem 0;
  }
`;

const UvInfoInnerWrapper = styled(ContentWrapper)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

const UvIndexDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const UvIndexVisual = styled.div<{ bgColor: string }>`
  width: 8rem; /* rem으로 통일 */
  height: 8rem; /* rem으로 통일 */
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.1), 0 0.25rem 0.375rem -0.125rem rgba(0, 0, 0, 0.05);
  background-color: ${props => props.bgColor};
  transition: background-color 0.3s ease;

  span:first-child {
    font-size: 1rem; /* rem으로 통일 */
    font-weight: 500;
  }
  span:last-child {
    font-size: clamp(2.5rem, 6vw, 3rem); /* clamp 적용 */
    font-weight: 700;
  }
`;

const UvIndexText = styled.div`
  p {
    color: #64748B;
    margin: 0;
    font-size: 1rem;
  }
  h2 {
    font-size: clamp(1.8rem, 4vw, 2.25rem); /* clamp 적용 */
    font-weight: 700;
    color: #1E293B;
    margin: 0.25rem 0 0 0;
  }
`;

const UvSummary = styled.div`
  text-align: right;
  flex-basis: 50%;

  p {
    font-size: clamp(0.9rem, 1.5vw, 1.3rem);
    word-break: keep-all;
  }
  p:first-child {
    font-weight: 600;
    color: #334155;
    font-size: clamp(1rem, 2vw, 1.5rem);
  }
  p:last-child {
    color: #64748B;
    margin-top: 0.5rem;
    line-height: 1.6;
  }

  @media (max-width: 768px) {
    text-align: center;
    flex-basis: 100%;
  }
`;

const CareTipsContainer = styled.div`
  width: 100%;
  padding: 2.5rem 0 4rem 0;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 0.0625rem solid #E2E8F0;
  overflow-x: auto;
  &::-webkit-scrollbar { height: 0.25rem; }
  &::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 0.625rem; }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: transparent;
  color: ${props => props.$active ? '#0891B2' : '#64748B'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  border-bottom: 0.1875rem solid ${props => props.$active ? '#0891B2' : 'transparent'};
  flex-shrink: 0;
  white-space: nowrap;
  font-size: clamp(0.9rem, 1.8vw, 1.3rem); /* 폰트 크기 명시 */
`;

const TipsContent = styled.div`
  padding-top: 2rem;
  display: grid;
  /* ❗❗❗ 핵심 수정: 280px -> 17.5rem 으로 변경 */
  grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
  gap: 1.5rem;
`;

const TipCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background-color: white;
  border: 0.0625rem solid #E2E8F0;
  border-radius: 0.75rem;
  box-shadow: 0 0.0625rem 0.125rem 0 rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: #A5F3FC;
    box-shadow: 0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06);
  }

  .icon {
    font-size: 1.875rem;
    margin-right: 1rem;
  }
  h4 {
    font-weight: 700;
    color: #334155;
    margin: 0;
    font-size: clamp(1rem, 2vw, 1.3rem);
  }
  p {
    color: #64748B;
    margin-top: 0.25rem;
    text-align: left;
    font-size: clamp(0.85rem, 1.5vw, 1.05rem);
  }
`;

// --- 데이터 (기존과 동일) --- //
const careData: CareData = {
    '낮음': { index: 1, color: '#22C55E', summary: { title: '오늘은 날씨가 좋아요!', description: '대부분 안전하지만, 민감성 피부는 가벼운 자외선 차단제를 사용하는 것이 좋습니다.'}, tips: [ { icon: '☀️', title: '자외선 차단제', description: '흐린 날에도 자외선은 존재해요. SPF 15 이상의 자외선 차단제를 사용하세요.' }, { icon: '😎', title: '보호 장비', description: '특별한 보호는 필요 없지만, 민감성 피부는 선글라스를 착용하는 것이 좋습니다.' } ]},
    '보통': { index: 4, color: '#F59E0B', summary: { title: '오늘의 외출, 준비가 필요해요', description: '외출 30분 전 자외선 차단제를 바르고, 햇볕이 강한 시간대에는 그늘을 활용하세요.'}, tips: [ { icon: '🧴', title: '자외선 차단제 필수', description: 'SPF 30, PA++ 이상의 자외선 차단제를 외출 30분 전에 바르세요.' }, { icon: '👒', title: '모자 및 의류', description: '햇볕이 강한 시간대(오전 10시~오후 3시)에는 그늘을 찾고, 넓은 챙의 모자를 쓰세요.' }, { icon: '🕶️', title: '선글라스 착용', description: '눈 건강을 위해 자외선 차단 기능이 있는 선글라스를 착용하세요.' } ]},
    '높음': { index: 7, color: '#F97316', summary: { title: '오늘은 외출 시 주의가 필요해요', description: '자외선 차단제를 꼼꼼히 바르고, 2시간마다 덧발라주세요. 가능한 한 긴 소매 옷을 착용하는 것이 좋습니다.'}, tips: [ { icon: '🧴', title: '차단 지수 높은 제품 사용', description: 'SPF 50, PA+++ 이상의 강력한 자외선 차단제를 사용하고, 2시간마다 덧발라주세요.' }, { icon: '👕', title: '긴 소매 옷 착용', description: '피부 보호를 위해 긴 소매 옷, 긴 바지를 입어 노출을 최소화하세요.' }, { icon: '🏠', title: '실내 활동 권장', description: '햇볕이 가장 강한 시간에는 가급적 실내에 머무르는 것이 안전합니다.' } ]},
    '매우 높음': { index: 9, color: '#EF4444', summary: { title: '강한 자외선, 외출을 자제하세요', description: '피부가 쉽게 손상될 수 있습니다. 오전 10시부터 오후 3시까지는 실내에 머무르는 것을 강력히 권장합니다.'}, tips: [ { icon: '🚫', title: '외출 자제', description: '오전 10시부터 오후 3시까지는 외출을 삼가는 것이 가장 좋습니다.' }, { icon: '💧', title: '수분 보충', description: '피부가 쉽게 건조해지고 열을 받을 수 있으니, 물을 충분히 마셔주세요.' }, { icon: '🌿', title: '진정 케어', description: '외출 후에는 알로에 젤 등으로 피부를 진정시켜주는 것이 중요합니다.' } ]},
    '위험': { index: 11, color: '#8B5CF6', summary: { title: '위험 수준! 외출은 절대 금물입니다', description: '짧은 시간의 노출에도 피부가 심각한 화상을 입을 수 있습니다. 반드시 실내에 머무르세요.'}, tips: [ { icon: '🚨', title: '외출 금지 수준', description: '햇볕에 몇 분만 노출되어도 화상을 입을 수 있습니다. 외출을 절대적으로 피하세요.' }, { icon: '🛡️', title: '완벽한 차단', description: '부득이하게 외출 시, 자외선 차단 의류, 모자, 선글라스 등 모든 수단을 동원하세요.' }, { icon: '❄️', title: '쿨링 및 진정', description: '실내에서도 시원하게 유지하고, 피부 온도를 낮추는 데 신경 써야 합니다.' } ]}
};

// UV 지수에 따른 케어 레벨 결정 함수
const getCareLevelFromUVIndex = (uvIndex: number): string => {
  if (uvIndex <= 2) return '낮음';
  if (uvIndex <= 5) return '보통';
  if (uvIndex <= 7) return '높음';
  if (uvIndex <= 10) return '매우 높음';
  return '위험';
};

// --- 컴포넌트 --- //
function TodaysCare() {
  const [activeTab, setActiveTab] = useState<string>('보통');
  const [uvData, setUvData] = useState<UVIndexResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 페이지 로드 시 UV 지수 API 호출
  useEffect(() => {
    const fetchUVIndex = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getUVIndex();
        setUvData(data);
        
        // UV 지수에 따라 적절한 탭 설정
        const uvIndex = parseInt(data.today);
        const careLevel = getCareLevelFromUVIndex(uvIndex);
        setActiveTab(careLevel);
      } catch (err) {
        console.error('UV 지수를 불러오는데 실패했습니다:', err);
        setError('UV 지수를 불러오는데 실패했습니다.');
        // 에러 발생 시 기본값 유지
      } finally {
        setIsLoading(false);
      }
    };

    fetchUVIndex();
  }, []);

  const currentUvData = careData[activeTab];
  const currentUVIndex = uvData ? parseInt(uvData.today) : currentUvData.index;
  // 로딩 중일 때
  if (isLoading) {
    return (
      <>
        <ContentWrapper>
          <Header>
            <h1>오늘의 맞춤 케어</h1>
            <p>현재 자외선 지수를 확인하고, 내 피부를 위한 팁을 알아보세요.</p>
          </Header>
        </ContentWrapper>
        <UvInfoBox>
          <UvInfoInnerWrapper>
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>자외선 지수를 불러오는 중...</p>
            </div>
          </UvInfoInnerWrapper>
        </UvInfoBox>
      </>
    );
  }

  return (
    <>
      <ContentWrapper>
        <Header>
          <h1>오늘의 맞춤 케어</h1>
          <p>현재 자외선 지수를 확인하고, 내 피부를 위한 팁을 알아보세요.</p>
        </Header>
      </ContentWrapper>
      
      <main>
        <UvInfoBox>
          <UvInfoInnerWrapper>
            <UvIndexDisplay>
              <UvIndexVisual bgColor={currentUvData.color}>
                <span>UV 지수</span>
                <span>{currentUVIndex}</span>
              </UvIndexVisual>
              <UvIndexText>
                <p>{uvData?.location || '현재 위치'}</p>
                <h2>{activeTab}</h2>
                {error && <p style={{ color: '#EF4444', fontSize: '0.875rem' }}>{error}</p>}
              </UvIndexText>
            </UvIndexDisplay>
            <UvSummary>
              <p><strong>{currentUvData.summary.title}</strong></p>
              <p>{currentUvData.summary.description}</p>
            </UvSummary>
          </UvInfoInnerWrapper>
        </UvInfoBox>

        <ContentWrapper>
          <CareTipsContainer>
            <TabsContainer>
              {Object.keys(careData).map(level => (
                <TabButton
                  key={level}
                  $active={activeTab === level}
                  onClick={() => setActiveTab(level)}
                >
                  {level}
                </TabButton>
              ))}
            </TabsContainer>
            <TipsContent>
              {currentUvData.tips.map((tip, index) => (
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
      </main>
    </>
  );
}

export default TodaysCare;