// src/pages/MainPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import main_image from '../assets/mainpage_image.jpeg';
import after_treatment_image from '../assets/after_treatment.png';
import before_treatment_image from '../assets/before_treatment.png';
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

const GlobalStyle = createGlobalStyle`
  html {
    font-size: 75%;
  }
`;


const CustomContainer = styled.div`
  padding-left: 3rem;
  padding-right: 3rem;
  width: 100%;
  max-width: 1280px; /* 콘텐츠 최대 너비 설정 */
  margin-left: auto;   /* 수평 중앙 정렬 */
  margin-right: auto;  /* 수평 중앙 정렬 */
  
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

export const Grid = styled.div<{
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
  border: none;
  outline: none;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
  transition: all 0.3s ease-in-out; font-weight: bold; font-size: 1.125rem;
  display: inline-flex; align-items: center; justify-content: center;
  &:hover { box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff; transform: translateY(-2px) scale(1.02); }
  &:active { box-shadow: inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff; transform: translateY(0) scale(0.98); }
`;

const GlassmorphismCard = styled.div`
  min-width: 0;
  background: rgba(255, 255, 255, 0.4); border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1); backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem; transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
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
  min-width: 0;
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

const HistoryContainer = styled.div`
  min-width: 0;
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
  }}
`;

const Footer = styled.footer`
  padding-top: 5rem; /* 80px */
  padding-bottom: 5rem; /* 80px */
  background-color: white;
  text-align: center;
`;

const UvIndexCard = styled.div`
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem;
  transition: all 0.3s ease-in-out;

  /* --- [추가] Flexbox 속성 --- */
  display: flex;
  flex-direction: column; 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.4);
  }
justify-content: space-between;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const UvIndexDisplay = styled.div`
  text-align: center;
  margin: 1.5rem 0;
`;

const UvIndexNumber = styled.p`
  font-size: 4.5rem;
  font-weight: 700;
  color: #f97316;
  margin: 0.5rem 0;
`;

const UvIndexText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ea580c;
`;

const UvInfoBox = styled.div`
  background-color: rgba(254, 249, 231, 0.5);
  border-left: 4px solid #f97316;
  padding: 1rem;
  color: #9a3412;
  border-radius: 0.375rem;
  p:first-child {
    font-weight: 700;
  }
`;

const TipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 두 팁 카드 사이의 간격만 정의 */
`;

const TipCard = styled.div`
  background: rgba(255, 255, 255, 0.3);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  h4 {
    font-weight: 600;
    font-size: 1.125rem;
  }
  p {
    color: #4b5563;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

const PredictionWrapper = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e7eb;

  @media (min-width: 1024px) {
    padding: 2.5rem;
  }
`;

const ImageCard = styled.div`
  background-color: #f9fafb;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: center;
  height: 100%; /* 부모 그리드 셀의 높이를 100% 채움 */
  display: flex; /* 내부 콘텐츠 정렬을 위해 Flexbox 사용 */
  flex-direction: column; /* 아이템을 위에서 아래로 정렬 */
  justify-content: space-evenly;


  img {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 0.5rem;
    margin-top: 0;
    margin-bottom: 0;
  }

  p {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #4b5563;
  }

  .image-quality {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #2563eb;
  }
  .prediction-text {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
  }
`;

export const ReportCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ReportItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .label {
    font-weight: 600;
    color: #4b5563;
  }
  .value {
    font-weight: 600;
  }
  .value-disease {
    font-weight: 700;
    color: #2563eb;
    font-size: 1.125rem;
  }
`;

export const SeverityBar = styled.div`
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 0.625rem;
  margin-left: 1rem;
`;

export const SeverityBarInner = styled.div`
  background-color: #f97316;
  height: 100%;
  border-radius: 9999px;
`;

export const AIOpinionBox = styled.div`
  background-color: #eff6ff;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid #bfdbfe;
  margin-top: 1rem;

  h4 {
    font-weight: 700;
    color: #1e40af;
    display: flex;
    align-items: center;
  }

  p {
    font-size: 0.875rem;
    color: #1d4ed8;
    margin-top: 0.5rem;
  }
`;

export const DetailButton = styled.button`
  width: 100%;
  background-color: #1f2937;
  color: white;
  font-weight: 700;
  padding: 0.75rem 0;
  margin-top: auto;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #111827;
  }
`;

const DiseaseListItem = styled.li`
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.3); /* bg-white/30 */
  border: 1px solid rgba(255, 255, 255, 0.2); /* border-white/20 */
  padding: 0.75rem; /* p-3 */
  border-radius: 0.5rem; /* rounded-lg */

  .fa-icon { /* 아이콘 스타일링을 위한 클래스 */
    margin-right: 0.75rem; /* mr-3 */
  }

  span {
    font-weight: 600; /* font-semibold */
  }
`;

const IconWrapper = styled.i<{ color: string }>`
  margin-right: 0.75rem;
  color: ${({ color }) => color};
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
        <GlobalStyle />

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

        <Section id="prediction">
            <ContentWrapper>
                <SectionHeading>
                    <NotoSansBlack>AI 피부 질환 진단</NotoSansBlack>
                </SectionHeading>
                <SectionSubheading>
                    사진을 올리면 AI가 분석하고, 상세한 리포트를 제공합니다.
                </SectionSubheading>
                <PredictionWrapper>
                    <Grid lg_cols="2" gap="2rem" align="stretch">
                        {/* 왼쪽: 이미지 및 예측 */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <h3 className="text-xl font-bold text-gray-800">치료 전/후 예측</h3>
                            <Grid cols="2" gap="1rem" style={{ flexGrow: 1 }}>
                                <ImageCard>
                                    <p>현재 상태</p>
                                    <img src={before_treatment_image} alt="치료 전 피부" />
                                    <div>
                                        <div className="image-quality">이미지 품질: 92점</div>
                                    </div>

                                </ImageCard>
                                <ImageCard>
                                    <p>치료 후 예상</p>
                                     <img src={after_treatment_image} alt="치료 후 예측" />
                                     <div>
                                       <div className="prediction-text">3주 후 예상 모습</div>
                                    </div>
                                </ImageCard>
                            </Grid>
                        </div>

                        {/* 오른쪽: 분석 리포트 */}
                        <ReportCard>
                            <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">AI 진단 리포트</h3>
                            <ReportItem>
                                <span className="label">의심 질환</span>
                                <span className="value-disease">아토피 피부염</span>
                            </ReportItem>
                            <ReportItem>
                                <span className="label">확률</span>
                                <span className="value">87%</span>
                            </ReportItem>
                            <ReportItem>
                                <span className="label">심각도</span>
                                <SeverityBar>
                                    <SeverityBarInner style={{ width: '65%' }} />
                                </SeverityBar>
                            </ReportItem>
                            <ReportItem>
                                <span className="label">예상 치료 기간</span>
                                <span className="value">3-4주</span>
                            </ReportItem>
                            <AIOpinionBox>
                                <h4><FaCommentMedical style={{ marginRight: '0.5rem' }} />AI 소견 및 주의사항</h4>
                                <p>건조함과 가려움을 동반하는 피부염으로 보입니다. 보습제를 충분히 사용하고, 전문의와 상담하여 정확한 진단 및 치료를 받는 것을 권장합니다.</p>
                            </AIOpinionBox>
                            <DetailButton>상세 리포트 보기</DetailButton>
                        </ReportCard>
                    </Grid>
                </PredictionWrapper>
            </ContentWrapper>
        </Section>
        
        <Section id="analysis" bg="#eff6ff">
    <ContentWrapper>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <SectionHeading>
                <NotoSansBlack>나의 피부 유형 바로 알기</NotoSansBlack>
            </SectionHeading>
            <SectionSubheading>
                AI가 당신의 피부 타입을 분석하고, 유형별 특징과 통계를 제공합니다.
            </SectionSubheading>
        </div>

        {/* 기존 Grid 컴포넌트를 그대로 사용하되, align="stretch"를 추가합니다. */}
        <Grid lg_cols="3" gap="2rem" align="stretch">
            {/* 1. 피부 유형 진단 결과 카드 */}
            <GlassmorphismCard style={{ textAlign: 'center', padding: '2rem', justifyContent: 'space-between' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                    피부 유형 진단 결과
                </h3>
                <div style={{ margin: '1rem 0' }}>
                    <div style={{ 
                        display: 'inline-block',
                        background: 'rgba(219, 234, 254, 0.5)', /* bg-blue-100/50 */
                        border: '1px solid rgba(191, 219, 254, 0.5)', /* border-blue-200/50 */
                        color: '#1e40af', /* text-blue-800 */
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        padding: '1rem 1.5rem',
                        borderRadius: '0.75rem'
                    }}>
                        수분 부족형 지성
                    </div>
                </div>
                <p style={{ color: '#4b5563', maxWidth: '28rem', margin: '0 auto' }}>
                    겉은 번들거리지만 속은 건조한 타입입니다. 유수분 밸런스를 맞추는 것이 중요합니다.
                </p>
            </GlassmorphismCard>

            {/* 2. 주의가 필요한 피부 질환 카드 */}
            <GlassmorphismCard style={{ padding: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                    주의가 필요한 피부 질환
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <DiseaseListItem>
                        {/* 1-3 선택사항을 적용 안 한 경우 */}
                        <FaExclamationTriangle className="fa-icon" style={{ color: '#ef4444' }}/>
                        <span>여드름 및 뾰루지</span>
                    </DiseaseListItem>
                    <DiseaseListItem>
                        {/* 1-3 선택사항을 적용한 경우 */}
                        <IconWrapper as={FaExclamationTriangle} color="#f97316" /> 
                        <span>지루성 피부염</span>
                    </DiseaseListItem>
                    <DiseaseListItem>
                        <IconWrapper as={FaExclamationTriangle} color="#eab308" />
                        <span>모낭염</span>
                    </DiseaseListItem>
                </ul>
            </GlassmorphismCard>

            {/* 3. 20대 여성 통계 카드 */}
            <GlassmorphismCard style={{ padding: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                    20대 여성 통계
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                    나와 같은 그룹의 피부 고민
                </p>
              </div>
              <div style={{ flexGrow: 1, position: 'relative' }}>
                {/* 기존 Doughnut 차트 코드를 그대로 사용합니다. */}
                <Doughnut data={skinTypeChartData} options={skinTypeChartOptions} />
              </div>
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
        
        <Section id="care" bg="#eff6ff">
    <ContentWrapper>
        <SectionHeading>
            <NotoSansBlack>오늘의 맞춤 케어</NotoSansBlack>
        </SectionHeading>
        <SectionSubheading>
            자외선 지수와 전문가 팁으로 매일 피부를 보호하세요.
        </SectionSubheading>
        <Grid md_cols="2" gap="2rem" align="stretch">
            {/* 자외선 지수 카드와 관리 팁 카드 */}
            <UvIndexCard>
                <CardTitle>
                    <FaSun style={{ color: '#fb923c', marginRight: '0.75rem' }} />
                    오늘의 자외선 지수
                </CardTitle>
                <UvIndexDisplay>
                    <UvIndexNumber>7</UvIndexNumber>
                    <UvIndexText>높음 (부천시)</UvIndexText>
                </UvIndexDisplay>
                <UvInfoBox>
                    <p>외출 시 주의!</p>
                    <p>햇볕이 강한 시간대에는 외출을 자제하고, 긴 소매 옷과 자외선 차단제를 꼭 사용하세요.</p>
                </UvInfoBox>
            </UvIndexCard>

            {/* 관리 팁 카드 */}
            <UvIndexCard>
                <CardTitle>
                    <FaLightbulb style={{ color: '#22c55e', marginRight: '0.75rem' }} />
                    이주의 관리 팁
                </CardTitle>
                <TipsContainer>
                    <TipCard>
                        <h4>수분 부족형 지성, 클렌징이 중요!</h4>
                        <p>약산성 클렌저를 사용하여 유분은 제거하되 수분은 남기는 것이 핵심입니다. 과도한 세안은 오히려 피부를 더 건조하게 만들 수 있습니다.</p>
                    </TipCard>
                    <TipCard>
                        <h4>보습, 가볍지만 확실하게</h4>
                        <p>오일프리 타입의 수분 크림이나 젤 타입의 제품을 사용하여 속건조를 해결해주세요.</p>
                    </TipCard>
                </TipsContainer>
            </UvIndexCard>
        </Grid>
    </ContentWrapper>
</Section>
            
        {/* Footer */}
        <Footer>
            <CustomContainer className="text-center">
                <p className="text-2xl font-bold md:text-3xl"><NotoSansBlack>지금 바로 BlueScope과 함께 건강한 피부 변화를 시작하세요.</NotoSansBlack></p>
                <div style={{ marginTop: '2rem' }}>
                <NeumorphicButton onClick={() => navigate('/disease-analysis-step1')}>
                        AI 진단 시작하기
                </NeumorphicButton>
                </div>
                </CustomContainer>
        </Footer>

        {showScrollTop && (
            <ScrollToTopButton onClick={scrollToTop}>
                <FaArrowUp />
            </ScrollToTopButton>
        )}
    </>
    );
};

export default MainPage;
//