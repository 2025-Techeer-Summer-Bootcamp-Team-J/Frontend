// src/pages/MainPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import main_image from '../assets/mainpage_image.jpeg';
import {
  FaCamera, FaCommentMedical, FaExclamationTriangle, FaCalendarAlt,
  FaSun, FaLightbulb, FaArrowUp
} from 'react-icons/fa';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { ContentWrapper } from '../components/Layout';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

// Styled Components
const Section = styled.section<{ bg?: string }>`
  padding: 4rem 0;
  background-color: ${props => props.bg || '#ffffff'};
  ${props => props.bg === '#eff6ff' && `
    background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dbeafe' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M5 0h1L0 6V5zm1 5v1H5zM0 0L6 6V5.923L.077 0z'/%3E%3C/g%3E%3C/svg%3E");
  `}
  @media (min-width: 768px) {
    padding: 6rem 0;
  }
`;

const Grid = styled.div<{
  cols?: string; sm_cols?: string; md_cols?: string; lg_cols?: string; gap?: string; align?: string;
}>`
  display: grid;
  gap: ${(props) => props.gap || '1rem'};
  grid-template-columns: repeat(${(props) => props.cols || 1}, 1fr);
  align-items: ${(props) => props.align || 'start'};
  @media (min-width: 640px) { grid-template-columns: repeat(${(props) => props.sm_cols || props.cols || 1}, 1fr); }
  @media (min-width: 768px) { grid-template-columns: repeat(${(props) => props.md_cols || props.sm_cols || props.cols || 1}, 1fr); }
  @media (min-width: 1024px) { grid-template-columns: repeat(${(props) => props.lg_cols || props.md_cols || props.sm_cols || props.cols || 1}, 1fr); }
`;

const NotoSansBlack = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 900;
`;

const GradientText = styled.span`
  background: linear-gradient(to right, #1e40af, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroHeading = styled.h1`
  font-size: 2.25rem; font-weight: 900; line-height: 1.2; margin-bottom: 1rem; text-align: center;
  @media (min-width: 768px) { font-size: 2.75rem; text-align: center; }
  @media (min-width: 1024px) { font-size: 3.25rem; }
`;

const HeroSubheading = styled.p`
  font-size: 1.125rem; color: #4b5563; max-width: 42rem; margin: 0 auto 2rem; text-align: center;
  @media (min-width: 768px) { font-size: 1.25rem; margin: 0 0 2rem; text-align: left; }
`;

const MagnifyContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 55rem;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

const MagnifierImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const MagnifierLens = styled.div.attrs<{ x: number; y: number; bgImage: string; bgSize: string; bgPos: string }>(props => ({
  style: {
    left: `${props.x}px`,
    top: `${props.y}px`,
    backgroundImage: `url(${props.bgImage})`,
    backgroundSize: props.bgSize,
    backgroundPosition: props.bgPos,
  }
}))<{ visible: boolean; x: number; y: number; bgImage: string; bgSize: string; bgPos: string }>`
  position: absolute;
  border: 4px solid #2563eb;
  border-radius: 50%;
  cursor: none;
  width: 150px;
  height: 150px;
  pointer-events: none;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  background-repeat: no-repeat;
  transform: translate(-50%, -50%);
  display: ${props => (props.visible ? 'block' : 'none')};
`;

const SectionHeading = styled.h2`
  font-size: 1.875rem; font-weight: 900; margin-bottom: 1rem; text-align: center;
  margin-left: auto;
  margin-right: auto;
  @media (min-width: 768px) { font-size: 2.25rem; }
`;

const SectionSubheading = styled.p`
  font-size: 1rem; color: #6b7280; text-align: center; margin-bottom: 3rem;
  @media (min-width: 768px) { font-size: 1.125rem; margin-bottom: 4rem; }
`;

const NeumorphicButton = styled.button`
  background-color: #ffffff; color: #2563eb; padding: 1rem 2rem; border-radius: 16px;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
  transition: all 0.3s ease-in-out; font-weight: bold; font-size: 1.125rem;
  display: inline-flex; align-items: center; justify-content: center;
  &:hover { box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff; transform: translateY(-2px) scale(1.02); }
  &:active { box-shadow: inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff; transform: translateY(0) scale(0.98); }
`;

const GlassmorphismCard = styled.div`
  background: rgba(255, 255, 255, 0.4); border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem; transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  @media (max-width: 768px) { padding: 1.5rem; }
  &:hover { transform: translateY(-5px); box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15); }
`;

const ScrollToTopButton = styled.button`
  position: fixed; bottom: 2rem; right: 2rem; background-color: #2563eb; color: white;
  border: none; border-radius: 50%; width: 3rem; height: 3rem; font-size: 1.5rem;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s ease;
  &:hover { background-color: #1d4ed8; transform: translateY(-3px); }
`;

const DashboardWrapper = styled.div`
  background-color: #1f2937;
  border-radius: 1.5rem;
  padding: 2.5rem;
  color: #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

const HistoryContainer = styled.div`
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  
  .info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const StatusBadge = styled.span<{ status: '개선' | '유지' | '악화' }>`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.75rem;
  color: #1f2937;
  background-color: ${({ status }) => {
    if (status === '개선') return '#4ade80'; // green-400
    if (status === '유지') return '#facc15'; // yellow-400
    if (status === '악화') return '#f87171'; // red-400
    return '#9ca3af'; // gray-400
  }};
`;


// Chart configurations =======================================================
const skinTypeChartData = {
  labels: ['여드름', '과다 피지', '블랙헤드', '속건조'],
  datasets: [{
    data: [45, 25, 20, 10],
    backgroundColor: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'],
    borderColor: 'rgba(255,255,255,0)',
    borderWidth: 5
  }]
};

const skinTypeChartOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' as const, labels: { color: '#374151' } } }
};

const skinScoreChartData = {
  labels: ['4주 전', '3주 전', '2주 전', '1주 전'],
  datasets: [{
    label: '피부 점수',
    data: [65, 70, 68, 82],
    fill: true,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderColor: '#3b82f6',
    tension: 0.3,
    pointBackgroundColor: '#3b82f6',
    pointRadius: 5,
    pointHoverRadius: 7,
  }]
};

const skinScoreChartOptions = {
  responsive: true,
  scales: {
    y: { beginAtZero: true, max: 100, ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.2)' } },
    x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.2)' } }
  },
  plugins: { legend: { display: false } }
};


// MainPage 컴포넌트 =======================================================

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    const [magnifierState, setMagnifierState] = useState({
        visible: false,
        x: 0,
        y: 0,
        bgSize: '',
        bgPos: ''
    });

    const magnifyContainerRef = useRef<HTMLDivElement>(null);
    const magnifyImageRef = useRef<HTMLImageElement>(null);
    const zoom = 2.5;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleMagnifierMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!magnifyContainerRef.current || !magnifyImageRef.current) return;
        
        const container = magnifyContainerRef.current;
        const img = magnifyImageRef.current;
        const rect = container.getBoundingClientRect();
        
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
            handleMagnifierLeave();
            return;
        }

        const imgWidth = img.width;
        const imgHeight = img.height;
        const bgSize = `${imgWidth * zoom}px ${imgHeight * zoom}px`;
        const bgPosX = `-${x * zoom - 150 / 2}px`;
        const bgPosY = `-${y * zoom - 150 / 2}px`;

        setMagnifierState({
            visible: true,
            x,
            y,
            bgSize: bgSize,
            bgPos: `${bgPosX} ${bgPosY}`
        });
    };

    const handleMagnifierLeave = () => {
        setMagnifierState(prevState => ({ ...prevState, visible: false }));
    };

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScrollTop && window.pageYOffset > 400) {
                setShowScrollTop(true);
            } else if (showScrollTop && window.pageYOffset <= 400) {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScrollTop]);

    return (
      <>
        <Section bg="#eff6ff">
            <ContentWrapper>
                <Grid lg_cols="2" gap="4rem" align="center">
                    <div>
                        <HeroHeading>
                            <NotoSansBlack>AI 피부 전문가,</NotoSansBlack>
                            <br />
                            <NotoSansBlack><GradientText>BlueScope</GradientText></NotoSansBlack> <br />
                            <NotoSansBlack>당신의 피부 건강을 책임집니다</NotoSansBlack>
                        </HeroHeading>
                        <HeroSubheading>
                            BlueScope의 AI 진단으로 피부 고민의 원인을 정확히 파악하고, 가장 효과적인 관리법을 찾아보세요. 이제 집에서 간편하게 전문적인 피부 분석을 경험할 수 있습니다.
                        </HeroSubheading>
                        <NeumorphicButton onClick={() => navigate('/disease-analysis-step1')}>
                            <FaCamera style={{ marginRight: '0.75rem' }} />
                            AI 피부 진단 시작하기
                        </NeumorphicButton>
                    </div>
                    <MagnifyContainer 
                        ref={magnifyContainerRef}
                        onMouseMove={handleMagnifierMove}
                        onMouseLeave={handleMagnifierLeave}
                    >
                        <MagnifierImage ref={magnifyImageRef} src={main_image} alt="피부 상태" />
                        <MagnifierLens 
                            visible={magnifierState.visible}
                            x={magnifierState.x}
                            y={magnifierState.y}
                            bgImage={main_image}
                            bgSize={magnifierState.bgSize}
                            bgPos={magnifierState.bgPos}
                        />
                    </MagnifyContainer>
                </Grid>
            </ContentWrapper>
        </Section>
        
        <Section id="care">
            <ContentWrapper>
                <SectionHeading>
                    <NotoSansBlack>BlueScope AI</NotoSansBlack>가 제공하는
                    <br />
                    <GradientText>핵심 기능 3가지</GradientText>
                </SectionHeading>
                <SectionSubheading>
                    피부 분석부터 맞춤형 솔루션, 그리고 지속적인 관리까지. BlueScope AI는 당신의 피부 건강을 위한 모든 것을 제공합니다.
                </SectionSubheading>
                <Grid md_cols="3" gap="2rem">
                    <GlassmorphismCard>
                        <FaCamera size={36} className="text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">AI 피부 분석</h3>
                        <p className="text-gray-600">
                            사진 한 장으로 피부 나이, 주요 고민(여드름, 모공, 주름 등)을 정밀하게 분석합니다. 시간과 장소에 구애받지 않고 전문가 수준의 진단을 받아보세요.
                        </p>
                    </GlassmorphismCard>
                    <GlassmorphismCard>
                        <FaCommentMedical size={36} className="text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">맞춤형 솔루션 제안</h3>
                        <p className="text-gray-600">
                            분석 결과를 바탕으로 당신의 피부 타입과 고민에 가장 적합한 성분, 제품, 생활 습관을 추천해 드립니다. 더 이상 추측에 의존하지 마세요.
                        </p>
                    </GlassmorphismCard>
                    <GlassmorphismCard>
                        <FaCalendarAlt size={36} className="text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">피부 상태 트래킹</h3>
                        <p className="text-gray-600">
                            일일, 주간, 월간 단위로 피부 변화를 기록하고 시각적인 리포트를 통해 개선 과정을 한눈에 확인하세요. 꾸준한 관리가 아름다운 피부의 비결입니다.
                        </p>
                    </GlassmorphismCard>
                </Grid>
            </ContentWrapper>
        </Section>
        
        <Section id="analysis" bg="#eff6ff">
            <ContentWrapper>
                <SectionHeading><NotoSansBlack>나의 피부 유형 바로 알기</NotoSansBlack></SectionHeading>
                <SectionSubheading>AI가 당신의 피부 타입을 분석하고, 유형별 특징과 통계를 제공합니다.</SectionSubheading>
                <Grid lg_cols="3" gap="2rem" align="stretch">
                    <GlassmorphismCard className="text-center">
                        <h3 className="text-2xl font-bold mb-4">피부 유형 진단 결과</h3>
                        <div className="my-4">
                            <div className="inline-block bg-blue-100/50 border border-blue-200/50 text-blue-800 text-2xl font-bold px-6 py-4 rounded-xl">수분 부족형 지성</div>
                        </div>
                        <p className="text-gray-600 max-w-md mx-auto">
                            겉은 번들거리지만 속은 건조한 타입입니다. 유수분 밸런스를 맞추는 것이 중요합니다.
                        </p>
                    </GlassmorphismCard>
                    <GlassmorphismCard>
                        <h3 className="text-2xl font-bold mb-4">주의가 필요한 피부 질환</h3>
                        <ul className="space-y-3 mt-6">
                            <li className="flex items-center bg-white/30 border border-white/20 p-3 rounded-lg"><FaExclamationTriangle className="text-red-500 mr-3" /><span className="font-semibold">여드름 및 뾰루지</span></li>
                            <li className="flex items-center bg-white/30 border border-white/20 p-3 rounded-lg"><FaExclamationTriangle className="text-orange-500 mr-3" /><span className="font-semibold">지루성 피부염</span></li>
                            <li className="flex items-center bg-white/30 border border-white/20 p-3 rounded-lg"><FaExclamationTriangle className="text-yellow-500 mr-3" /><span className="font-semibold">모낭염</span></li>
                        </ul>
                    </GlassmorphismCard>
                    <GlassmorphismCard>
                        <h3 className="text-2xl font-bold mb-4">20대 여성 통계</h3>
                        <p className="text-sm text-gray-500 mb-4">나와 같은 그룹의 피부 고민</p>
                        <Doughnut data={skinTypeChartData} options={skinTypeChartOptions} />
                    </GlassmorphismCard>
                </Grid>
            </ContentWrapper>
        </Section>
        
        <Section id="dashboard">
            <ContentWrapper>
                <SectionHeading>
                    <NotoSansBlack>개인 맞춤형 대시보드</NotoSansBlack>
                </SectionHeading>
                <SectionSubheading>
                    나의 피부 상태 변화를 기록하고, 한눈에 추적하세요.
                </SectionSubheading>
                <DashboardWrapper>
                    <DashboardGrid>
                        <ChartContainer>
                            <h3>피부 상태 점수 변화 (최근 4주)</h3>
                            <Line data={skinScoreChartData} options={skinScoreChartOptions} />
                        </ChartContainer>
                        <HistoryContainer>
                            <h3>최근 진단 기록</h3>
                            <HistoryList>
                                <HistoryItem>
                                    <div className="info">
                                        <FaCalendarAlt />
                                        <span>7월 4일</span>
                                        <span>아토피</span>
                                    </div>
                                    <StatusBadge status="개선">개선</StatusBadge>
                                </HistoryItem>
                                <HistoryItem>
                                    <div className="info">
                                        <FaCalendarAlt />
                                        <span>6월 28일</span>
                                        <span>아토피</span>
                                    </div>
                                    <StatusBadge status="유지">유지</StatusBadge>
                                </HistoryItem>
                                <HistoryItem>
                                    <div className="info">
                                        <FaCalendarAlt />
                                        <span>6월 21일</span>
                                        <span>접촉성 피부염</span>
                                    </div>
                                    <StatusBadge status="악화">악화</StatusBadge>
                                </HistoryItem>
                            </HistoryList>
                        </HistoryContainer>
                    </DashboardGrid>
                </DashboardWrapper>
            </ContentWrapper>
        </Section>
        
        <Section bg="#eff6ff">
            <ContentWrapper>
                <SectionHeading>
                    오늘의 <GradientText>맞춤 케어 솔루션</GradientText>
                </SectionHeading>
                <SectionSubheading>
                    현재 날씨와 내 피부 상태를 종합하여 AI가 제안하는 최적의 케어 방법을 확인해보세요.
                </SectionSubheading>
                <Grid md_cols="3" gap="2rem">
                    <GlassmorphismCard>
                        <div className="flex items-center mb-3">
                            <FaSun size={24} className="text-yellow-500 mr-3" />
                            <h3 className="text-xl font-bold">자외선 차단</h3>
                        </div>
                        <p className="text-gray-600">
                            오늘은 자외선 지수가 <strong className="text-red-500">높음</strong> 단계입니다. 외출 30분 전 SPF 50+, PA+++ 이상의 자외선 차단제를 꼼꼼히 발라주세요.
                        </p>
                    </GlassmorphismCard>
                    <GlassmorphismCard>
                        <div className="flex items-center mb-3">
                            <FaLightbulb size={24} className="text-blue-500 mr-3" />
                            <h3 className="text-xl font-bold">추천 성분</h3>
                        </div>
                        <p className="text-gray-600">
                            최근 분석 결과 <strong className="text-blue-600">과다 피지</strong>가 우려됩니다. 살리실산(BHA) 또는 나이아신아마이드가 함유된 제품으로 피지를 조절해주세요.
                        </p>
                    </GlassmorphismCard>
                    <GlassmorphismCard>
                        <div className="flex items-center mb-3">
                            <FaExclamationTriangle size={24} className="text-gray-700 mr-3" />
                            <h3 className="text-xl font-bold">주의사항</h3>
                        </div>
                        <p className="text-gray-600">
                            피부 장벽이 약해져 있으니, 오늘은 스크럽이나 필링 제품 사용은 피하고 충분한 보습에 집중하는 것이 좋습니다.
                        </p>
                    </GlassmorphismCard>
                </Grid>
            </ContentWrapper>
        </Section>
        {showScrollTop && (
            <ScrollToTopButton onClick={scrollToTop}>
                <FaArrowUp />
            </ScrollToTopButton>
        )}
      </>
    );
};

export default MainPage;