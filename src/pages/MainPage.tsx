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

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler
);

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Main = styled.main`
  flex-grow: 1;
`;

const CustomContainer = styled.div`
  padding-left: 3rem;
  padding-right: 3rem;
  width: 100%;
  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

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
  @media (min-width: 768px) { font-size: 2.75rem; text-align: left; }
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

const GlassmorphismDarkCard = styled(GlassmorphismCard)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
  padding: 1.5rem;

  &:hover {
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.3);
  }
`;

const ScrollToTopButton = styled.button`
  position: fixed; bottom: 2rem; right: 2rem; background-color: #2563eb; color: white;
  border: none; border-radius: 50%; width: 3rem; height: 3rem; font-size: 1.5rem;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s ease;
  &:hover { background-color: #1d4ed8; transform: translateY(-3px); }
`;

const Footer = styled.footer`
  padding-top: 5rem; /* 80px */
  padding-bottom: 5rem; /* 80px */
  background-color: white;
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

        setMagnifierState(prev => ({
            ...prev,
            visible: true,
            x,
            y,
            bgSize: `${img.width * zoom}px ${img.height * zoom}px`,
            bgPos: `-${(x * zoom) - 75}px -${(y * zoom) - 75}px`
        }));
    };

    const handleMagnifierLeave = () => {
        setMagnifierState(prev => ({ ...prev, visible: false }));
    };

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScrollTop && window.pageYOffset > 400) setShowScrollTop(true);
            else if (showScrollTop && window.pageYOffset <= 400) setShowScrollTop(false);
        };
        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScrollTop]);

    return (
        <PageWrapper>
            <Main>
                <Section bg="#eff6ff">
                    <CustomContainer>
                        <Grid lg_cols="2" gap="4rem" align="center">
                            <div>
                                <HeroHeading>
                                    <GradientText>AI 피부 분석</GradientText>으로<br />
                                    <NotoSansBlack>가장 정확한 솔루션</NotoSansBlack>을<br />
                                    경험해보세요
                                </HeroHeading>
                                <HeroSubheading>
                                    이미지 위에 마우스를 올려 AI가 분석하는 것처럼 피부를 확대하여 확인해보세요.
                                </HeroSubheading>
                                <NeumorphicButton onClick={() => navigate('/disease-analysis-step1')}>
                                    <FaCamera style={{ marginRight: '1rem' }} />
                                    AI 정밀 분석 시작하기
                                </NeumorphicButton>
                            </div>
                            <MagnifyContainer 
                                ref={magnifyContainerRef} 
                                onMouseMove={handleMagnifierMove}
                                onMouseLeave={handleMagnifierLeave}
                            >
                                <MagnifierImage 
                                    ref={magnifyImageRef}
                                    src={main_image}
                                    alt="피부 분석이 필요한 얼굴 이미지" 
                                />
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
                    </CustomContainer>
                </Section>
                
                {/* Diagnosis Section */}
                {/* ❗ FIX: Added full content for this section, now using FaCommentMedical */}
                <Section id="diagnosis">
                  <CustomContainer>
                    <div className="text-center mb-12 md:mb-16">
                      <SectionHeading><NotoSansBlack>AI 피부 질환 진단</NotoSansBlack></SectionHeading>
                      <SectionSubheading>사진을 올리면 AI가 분석하고, 상세한 리포트를 제공합니다.</SectionSubheading>
                    </div>
                    <div className="max-w-5xl mx-auto bg-gray-50 p-4 sm:p-8 rounded-2xl shadow-xl border border-gray-200">
                        <Grid lg_cols="2" gap="2rem" align="start">
                            {/* 왼쪽: 이미지 및 예측 */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-3">치료 전/후 예측</h3>
                                <Grid cols="2" gap="1rem">
                                    <div className="bg-white p-4 rounded-xl border">
                                        <p className="font-semibold mb-2 text-gray-600">현재 상태</p>
                                        <img src="https://images.unsplash.com/photo-1580619586944-9937b3834791?q=80&w=800&auto=format&fit=crop" alt="치료 전 피부" className="rounded-lg w-full aspect-square object-cover" />
                                        <div className="mt-3 text-sm font-semibold text-blue-600">이미지 품질: 92점</div>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl border">
                                        <p className="font-semibold mb-2 text-gray-600">치료 후 예상</p>
                                        <img src="https://images.unsplash.com/photo-1596305589444-a81870a1202c?q=80&w=800&auto=format&fit=crop" alt="치료 후 예측 이미지" className="rounded-lg w-full aspect-square object-cover" />
                                        <div className="mt-3 text-sm font-semibold text-gray-500">3주 후 예상 모습</div>
                                    </div>
                                </Grid>
                            </div>
                            {/* 오른쪽: 분석 리포트 */}
                            <div className="bg-white p-6 rounded-lg shadow-inner space-y-4 border">
                                <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">AI 진단 리포트</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center"><span className="font-semibold text-gray-600">의심 질환</span><span className="font-bold text-blue-600 text-lg">아토피 피부염</span></div>
                                    <div className="flex justify-between items-center"><span className="font-semibold text-gray-600">확률</span><span className="font-semibold">87%</span></div>
                                    <div className="flex justify-between items-center"><span className="font-semibold text-gray-600">심각도</span><div className="w-full bg-gray-200 rounded-full h-2.5 ml-4"><div className="bg-orange-400 h-2.5 rounded-full" style={{width: '65%'}}></div></div></div>
                                    <div className="flex justify-between items-center"><span className="font-semibold text-gray-600">예상 치료 기간</span><span className="font-semibold">3-4주</span></div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                    <h4 className="font-bold text-blue-800 flex items-center"><FaCommentMedical className="mr-2" />AI 소견 및 주의사항</h4>
                                    <p className="text-sm text-blue-700 mt-2">건조함과 가려움을 동반하는 피부염으로 보입니다. 보습제를 충분히 사용하고, 전문의와 상담하여 정확한 진단 및 치료를 받는 것을 권장합니다.</p>
                                </div>
                                <button className="w-full bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition">상세 리포트 보기</button>
                            </div>
                        </Grid>
                    </div>
                  </CustomContainer>
                </Section>
                
                {/* Analysis Section */}
                <Section id="analysis" bg="#eff6ff">
                    <CustomContainer>
                        <div className="text-center mb-12 md:mb-16">
                           <SectionHeading><NotoSansBlack>나의 피부 유형 바로 알기</NotoSansBlack></SectionHeading>
                           <SectionSubheading>AI가 당신의 피부 타입을 분석하고, 유형별 특징과 통계를 제공합니다.</SectionSubheading>
                        </div>
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
                    </CustomContainer>
                </Section>

                {/* Dashboard Section */}
                <Section id="dashboard">
                    <CustomContainer>
                        <div className="text-center mb-12 md:mb-16">
                           <SectionHeading><NotoSansBlack>개인 맞춤형 대시보드</NotoSansBlack></SectionHeading>
                           <SectionSubheading>나의 피부 변화를 기록하고, 한눈에 추적하세요.</SectionSubheading>
                        </div>
                        <div className="max-w-1xl mx-auto bg-gray-800 text-white p-4 sm:p-8 rounded-2xl shadow-2xl">
                            <Grid lg_cols="2" gap="2rem">
                                <GlassmorphismDarkCard>
                                    <h4 className="font-bold mb-4 text-gray-300">피부 상태 점수 변화 (최근 4주)</h4>
                                    <Line data={skinScoreChartData} options={skinScoreChartOptions} />
                                </GlassmorphismDarkCard>
                                <GlassmorphismDarkCard>
                                    <h4 className="font-bold mb-4 text-gray-300">최근 진단 기록</h4>
                                    <ul className="space-y-3">
                                        <li className="flex justify-between items-center bg-white/5 p-3 rounded-md"><span><FaCalendarAlt className="inline mr-2" />7월 4일</span><span className="font-semibold">아토피</span><span className="text-green-400 font-bold">개선</span></li>
                                        <li className="flex justify-between items-center bg-white/5 p-3 rounded-md"><span><FaCalendarAlt className="inline mr-2" />6월 28일</span><span className="font-semibold">아토피</span><span className="text-yellow-400 font-bold">유지</span></li>
                                        <li className="flex justify-between items-center bg-white/5 p-3 rounded-md"><span><FaCalendarAlt className="inline mr-2" />6월 21일</span><span className="font-semibold">접촉성 피부염</span><span className="text-red-400 font-bold">악화</span></li>
                                    </ul>
                                </GlassmorphismDarkCard>
                            </Grid>
                        </div>
                    </CustomContainer>
                </Section>
               
                {/* Care Section */}
                <Section id="care" bg="#eff6ff">
                     <CustomContainer>
                        <div className="text-center mb-12 md:mb-16">
                           <SectionHeading><NotoSansBlack>오늘의 맞춤 케어</NotoSansBlack></SectionHeading>
                           <SectionSubheading>자외선 지수와 전문가 팁으로 매일 피부를 보호하세요.</SectionSubheading>
                        </div>
                        <Grid md_cols="2" gap="2rem">
                            <GlassmorphismCard>
                                <h3 className="text-2xl font-bold mb-4 flex items-center"><FaSun className="text-orange-400 mr-3" />오늘의 자외선 지수</h3>
                                <div className="text-center my-6">
                                    <p className="text-7xl font-bold text-orange-500 my-2">7</p>
                                    <p className="text-xl font-semibold text-orange-600">높음 (부천시)</p>
                                </div>
                                <div className="bg-orange-50/50 border-l-4 border-orange-400 p-4 text-orange-800 rounded-md">
                                    <p className="font-bold">외출 시 주의!</p>
                                    <p>햇볕이 강한 시간대에는 외출을 자제하고, 긴 소매 옷과 자외선 차단제를 꼭 사용하세요.</p>
                                </div>
                            </GlassmorphismCard>
                            <GlassmorphismCard>
                                <h3 className="text-2xl font-bold mb-4 flex items-center"><FaLightbulb className="text-green-500 mr-3" />이주의 관리 팁</h3>
                                <div className="space-y-4">
                                    <div className="bg-white/30 p-4 rounded-lg border border-white/20">
                                        <h4 className="font-semibold text-lg">수분 부족형 지성, 클렌징이 중요!</h4>
                                        <p className="text-gray-600 text-sm mt-1">약산성 클렌저를 사용하여 유분은 제거하되 수분은 남기는 것이 핵심입니다.</p>
                                    </div>
                                    <div className="bg-white/30 p-4 rounded-lg border border-white/20">
                                        <h4 className="font-semibold text-lg">보습, 가볍지만 확실하게</h4>
                                        <p className="text-gray-600 text-sm mt-1">오일프리 타입의 수분 크림이나 젤 타입의 제품을 사용하여 속건조를 해결해주세요.</p>
                                    </div>
                                </div>
                            </GlassmorphismCard>
                        </Grid>
                    </CustomContainer>
                </Section>
            </Main>
            
            {/* Footer */}
            <Footer>
                <CustomContainer className="text-center">
                   <p className="text-2xl font-bold md:text-3xl"><NotoSansBlack>지금 바로 BlueScope과 함께<br/>건강한 피부 변화를 시작하세요.</NotoSansBlack></p>
                   <div className="mt-8 flex justify-center">
                    <NeumorphicButton onClick={() => navigate('/disease-analysis-step1')}>
                          AI 진단 시작하기
                    </NeumorphicButton>
                   </div>
                    <div className="mt-16 pt-8 border-t border-gray-200 text-gray-500 text-sm">
                        <p>© 2024 BlueScope. All Rights Reserved.</p>
                    </div>
                </CustomContainer>
            </Footer>

            {showScrollTop && (
                <ScrollToTopButton onClick={scrollToTop}>
                    <FaArrowUp />
                </ScrollToTopButton>
            )}
        </PageWrapper>
    );
};

export default MainPage;