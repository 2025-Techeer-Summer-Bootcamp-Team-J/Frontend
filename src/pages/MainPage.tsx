// src/pages/MainPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import main_image from '../assets/mainpage_image.jpeg';
import after_treatment_image from '../assets/after_treatment.png';
import before_treatment_image from '../assets/before_treatment.png';
import {
  FaCamera, FaCommentMedical, FaExclamationTriangle, FaCalendarAlt,
  FaSun, FaLightbulb, FaArrowUp, FaArrowLeft, FaRedo, FaDownload
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

const DiagnosisSectionWrapper = styled.div`
  background-color: #ffffff;
  padding: 4rem 0;
  @media (min-width: 768px) { padding: 6rem 0; }
`;
const DiagnosisGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 6rem;
    align-items: start;
  }
`;
const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .section-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 2rem; }
`;
const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;
const NewChartWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  height: 20rem;
  border: none;
  background-color: transparent;
`;
const NewLegendContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-top: 2.5rem;

  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const NewLegendItem = styled.div`

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #f1f5f9; }
`;

const NewLegendColorBox = styled.span<{ color: string }>`
  width: 1rem;
  height: 1rem;

  border-radius: 9999px;
  background-color: ${props => props.color};
  margin-right: 0.75rem;
`;

const FullReportCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const FullTabNav = styled.nav`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1rem;
  overflow-x: auto;
`;
const FullTabButton = styled.button<{ $isActive: boolean }>`
  /* 기본 스타일 */
  background-color: transparent; /* 배경색을 투명하게 만듭니다. */
  border: none;                /* 모든 테두리를 제거합니다. */
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;


  /* 활성/비활성 상태에 따른 동적 스타일 */
  color: ${props => (props.$isActive ? '#2563eb' : '#64748b')};
  
  /* 활성 탭에만 파란색 밑줄을 표시하고, 나머지는 투명하게 처리합니다. */
  border-bottom: 3px solid ${props => (props.$isActive ? '#2563eb' : 'transparent')};


  /* 마우스 오버 효과 */
  &:hover {
    color: #2563eb;
  }
`;

const FullTabContentContainer = styled.div`
  padding: 1.5rem 2rem;
  min-height: 300px;
  overflow-y: auto;
`;
const FullActionsContainer = styled.div`
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  width: 100%;
`;
const ActionButton = styled.button<{ primary?: boolean; fullWidth?: boolean }>`
  background-color: ${props => props.primary ? '#2563eb' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#334155'};
  font-weight: 700;
  padding: 0.625rem 0;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  &:hover { background-color: ${props => props.primary ? '#1d4ed8' : '#cbd5e1'}; }
`;
const FullContentBlock = styled.div`
  h3 { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem; }
  ul { list-style-position: inside; list-style-type: disc; display: flex; flex-direction: column; gap: 0.75rem; color: #334155; line-height: 1.7; }
`;

const ReportContainer = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 1.5rem; /* 24px, 부드러운 모서리 */
  box-shadow: 0 10px 25px 10px rgba(0, 0, 0, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.07);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
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

const SectionDivider = styled.div`
  /* 구분선의 높이와 위아래 여백 설정 */
  height: 2px;
  margin: 4rem auto; /* 위아래로 4rem(64px)의 여백을 줌 */
  
  /* 구분선 최대 너비 설정 */
  width: 100%;
  max-width: 60rem; /* 768px */

  /* 그라데이션 효과 */
  background: linear-gradient(to right, transparent, #9fc8fdff, transparent);
  
  @media (min-width: 768px) {
    margin: 6rem auto; /* PC에서는 여백을 더 넓게 */
  }
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

    const diagnosisChartData = {
    labels: ['아토피 피부염', '접촉성 피부염', '지루성 피부염', '기타'],
    datasets: [{
        data: [87, 8, 3, 2],
        backgroundColor: ['#2563eb', '#60a5fa', '#93c5fd', '#dbeafe'],
        borderColor: 'white',
        borderWidth: 0,
    }]
};
const diagnosisChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // 👈 이 옵션을 false로 설정하는 것이 핵심입니다.
    devicePixelRatio: window.devicePixelRatio > 1 ? window.devicePixelRatio : 2,
    cutout: '60%',
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context: any) => `${context.label}: ${context.parsed}%`
            }
        }
    }
};
type TabType = 'summary' | 'description' | 'precautions' | 'management';
const [activeTab, setActiveTab] = useState<TabType>('summary');
const handleDownloadReport = () => { /* 다운로드 로직 */ };
const tabContent: Record<TabType, React.ReactNode> = {
    summary: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                 <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>의심 질환</span>
                    <span style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.125rem', textAlign: 'right' }}>아토피 피부염</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>확률</span>
                    <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '1.125rem', textAlign: 'right' }}>87%</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
                     <span style={{ fontWeight: 600, color: '#475569' }}>심각도</span>
                     <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '9999px', height: '0.625rem' }}>
                        <div style={{ backgroundColor: '#f97316', height: '100%', borderRadius: '9999px', width: '75%' }} />
                     </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '1rem', alignItems: 'center' }}>
                     <span style={{ fontWeight: 600, color: '#475569' }}>예상 치료 기간</span>
                     <span style={{ fontWeight: 700, color: '#1e293b', textAlign: 'right' }}>3-4주</span>
                </div>
            </div>
            <div style={{ backgroundColor: '#eff6ff', borderLeft: '4px solid #3b82f6', color: '#1e3a8a', padding: '1rem', borderRadius: '0.5rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCommentMedical /> AI 소견 및 주의사항</p>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6 }}>건조함과 가려움을 동반하는 피부염으로 보입니다. 보습제를 충분히 사용하고, 전문의와 상담하여 정확한 진단 및 치료를 받는 것을 권장합니다.</p>
            </div>
        </div>
    ),
    description: ( <FullContentBlock><h3>상세 설명 내용...</h3></FullContentBlock> ),
    precautions: ( <FullContentBlock><h3>주의사항 내용...</h3></FullContentBlock> ),
    management: ( <FullContentBlock><h3>관리법 내용...</h3></FullContentBlock> )
};

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

        <SectionDivider />

        <DiagnosisSectionWrapper id="diagnosis-result">
    <ContentWrapper>
        <SectionHeading>
            <NotoSansBlack>AI 피부 질환 진단</NotoSansBlack>
        </SectionHeading>
        <SectionSubheading>
             사진 한 장으로 AI가 질환을 예측하고, 상세한 리포트를 제공합니다.
        </SectionSubheading>
        <ReportContainer>
        <DiagnosisGrid>
            {/* 왼쪽 패널 */}
            <LeftPanel>
                <h2 className="section-title">예상 질환 통계</h2>
                <NewChartWrapper>
                    <Doughnut data={diagnosisChartData} options={diagnosisChartOptions} />
                </NewChartWrapper>
                <NewLegendContainer>
                    {diagnosisChartData.labels.map((label, index) => (
                        <NewLegendItem key={label}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <NewLegendColorBox color={diagnosisChartData.datasets[0].backgroundColor[index]} />
                                <span style={{ color: '#334155' }}>{label}</span>
                            </div>
                            <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{diagnosisChartData.datasets[0].data[index]}%</span>
                        </NewLegendItem>
                    ))}
                </NewLegendContainer>
            </LeftPanel>

            {/* 오른쪽 패널 */}
            <RightPanel>
                <FullReportCard>
                    <FullTabNav>
                        <FullTabButton onClick={() => setActiveTab('summary')} $isActive={activeTab === 'summary'}>요약</FullTabButton>
                        <FullTabButton onClick={() => setActiveTab('description')} $isActive={activeTab === 'description'}>상세 설명</FullTabButton>
                        <FullTabButton onClick={() => setActiveTab('precautions')} $isActive={activeTab === 'precautions'}>주의사항</FullTabButton>
                        <FullTabButton onClick={() => setActiveTab('management')} $isActive={activeTab === 'management'}>관리법</FullTabButton>
                    </FullTabNav>
                    <FullTabContentContainer>
                        {tabContent[activeTab]}
                    </FullTabContentContainer>
                </FullReportCard>
                <FullActionsContainer>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <ActionButton><FaArrowLeft /><span>이전</span></ActionButton>
                        <ActionButton><FaRedo /><span>다시 분석</span></ActionButton>
                    </div>
                    <ActionButton primary fullWidth onClick={handleDownloadReport}>
                        <FaDownload /><span>리포트 내려받기</span>
                    </ActionButton>
                </FullActionsContainer>
            </RightPanel>
        </DiagnosisGrid>
      </ReportContainer> 
    </ContentWrapper>
</DiagnosisSectionWrapper>
        
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