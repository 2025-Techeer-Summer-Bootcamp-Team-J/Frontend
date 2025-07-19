import styled from 'styled-components';

export const CustomContainer = styled.div`
  padding-left: 5rem;
  padding-right: 5rem;
  width: 100%;
  max-width: 1280px; /* 콘텐츠 최대 너비 설정 */
  margin-left: auto;   /* 수평 중앙 정렬 */
  margin-right: auto;  /* 수평 중앙 정렬 */
  
  @media (max-width: 768px) {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

export const Section = styled.section<{ bg?: string }>`
  padding: 4rem 0;
  background-color: ${props => props.bg || '#ffffff'};
  
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
  justify-content: center;

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

export const NotoSansBlack = styled.span`
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 600;
`;

export const GradientText = styled.span`
  background: linear-gradient(to right, #1e40af, #2563eb);
  font-weight: 800;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const MainHeading = styled.h1`
  font-size: 2.25rem; font-weight: 900; line-height: 1.2; margin-bottom: 1rem; text-align: center;
  @media (min-width: 768px) { font-size: 2.75rem; text-align: left; }
  @media (min-width: 1024px) { font-size: 3.25rem; }
`;

export const SubHeading = styled.p`
  font-size: 1.125rem; color: #4b5563; max-width: 42rem; margin: 0 auto 2rem; text-align: center;
  @media (min-width: 768px)
  { font-size: 1.25rem; margin: 0 0 2rem; text-align: left; }
`;

export const SectionHeading = styled.h2`
  font-size: 1.875rem; font-weight: 900; margin-bottom: 1rem; text-align: center;
  margin-left: auto;
  margin-right: auto;
  @media (min-width: 768px) { font-size: 2.25rem; }
`;

export const SectionSubheading = styled.p`
  font-size: 1rem; color: #6b7280; text-align: center; margin-bottom: 1.5rem;
  @media (min-width: 768px) { font-size: 1.125rem; margin-bottom: 2rem; }
`;

export const NeumorphicButton = styled.button`
  background-color: #ffffff; color: #2563eb; padding: 1rem 2rem; border-radius: 16px;
  border: none;
  outline: none;
  box-shadow: 8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff;
  transition: all 0.3s ease-in-out; font-weight: bold; font-size: 1.125rem;
  display: inline-flex; align-items: center; justify-content: center;
  &:hover { box-shadow: 5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff; transform: translateY(-2px) scale(1.02); }
  &:active { box-shadow: inset 8px 8px 16px #d1d9e6, inset -8px -8px 16px #ffffff; transform: translateY(0) scale(0.98); }
`;

export const GlassmorphismCard = styled.div`
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

export const ScrollToTopButton = styled.button`
  position: fixed; bottom: 2rem; right: 2rem; background-color: #2563eb; color: white;
  border: none; border-radius: 50%; width: 3rem; height: 3rem; font-size: 1.5rem;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); transition: all 0.3s ease;
  &:hover { background-color: #1d4ed8; transform: translateY(-3px); }
`;

export const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

export const ReportItem = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  .label {
    font-weight: 600;
    color: #475569;
  }
  
  .value {
    font-weight: 700;
    color: #1e293b;
    text-align: right;
  }
  
  .value-disease {
    font-weight: 700;
    color: #2563eb;
    font-size: 1.125rem;
    text-align: right;
  }
`;

export const AIOpinionBox = styled.div`
  background-color: #eff6ff;
  border-left: 4px solid #3b82f6;
  color: #1e3a8a;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
  
  h4 {
    font-weight: 700;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }
  
  p {
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0;
  }
`;

export const DetailButton = styled.button`
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;

export const SeverityBar = styled.div`
  width: 100%;
  background-color: #e2e8f0;
  border-radius: 9999px;
  height: 0.625rem;
  overflow: hidden;
`;

export const SeverityBarInner = styled.div`
  background-color: #f97316;
  height: 100%;
  border-radius: 9999px;
  transition: width 0.3s ease;

`;

export const DiseaseListItem = styled.li`
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

export const IconWrapper = styled.i<{ color: string }>`
  margin-right: 0.75rem;
  color: ${({ color }) => color};
`;

export const Footer = styled.footer`
  padding-top: 5rem;
  padding-bottom: 5rem;
  text-align: center;
`;

export const MagnifyContainer = styled.div`
  position: relative;
  width: 90%;
  max-width: 55rem;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
`;

export const MagnifierImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

export const MagnifierLens = styled.div.attrs<{ x: number; y: number; bgImage: string; bgSize: string; bgPos: string }>(props => ({
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

export const VideoSectionWrapper = styled.section`
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;

export const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

export const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
`;

export const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
`;

export const VideoNavigation = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
  background: transparent;
  padding: 1rem 2rem;
  border-radius: 3rem;
`;

export const VideoIndicators = styled.div`
  display: flex;
  gap: 1rem;
`;

export const VideoIndicator = styled.button<{ $isActive: boolean }>`
  width: 60px;
  height: 2px;
  border-radius: 1px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isActive ? '#000000' : 'rgba(255, 255, 255, 0.4)'};
  
  &:hover {
    background: white;
    transform: scaleY(2);
  }
`;

export const PlayControlButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }
`;

export const VideoTitle = styled.div`
  position: absolute;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  
  @media (max-width: 768px) {
    bottom: 6rem;
    left: 1rem;
    right: 1rem;
    transform: none;
  }
  
  h2 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0 0 1rem 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    margin: 0;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

export const DashboardWrapper = styled.div`
  background-color: #1f2937;
  border-radius: 1.5rem;
  padding: 4rem;
  color: #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartContainer = styled.div`
  min-width: 0;
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

export const HistoryContainer = styled.div`
  min-width: 0;
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

export const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const HistoryItem = styled.li`
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

export const StatusBadge = styled.span<{ status: '개선' | '유지' | '악화' }>`
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

export const UvIndexCard = styled.div`
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

export const UvIndexDisplay = styled.div`
  text-align: center;
  margin: 1.5rem 0;
`;

export const UvIndexNumber = styled.p`
  font-size: 4.5rem;
  font-weight: 700;
  color: #f97316;
  margin: 0.5rem 0;
`;

export const UvIndexText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ea580c;
`;

export const UvInfoBox = styled.div`
  background-color: rgba(254, 249, 231, 0.5);
  border-left: 4px solid #f97316;
  padding: 1rem;
  color: #9a3412;
  border-radius: 0.375rem;
  p:first-child {
    font-weight: 700;
  }
`;

export const TipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 두 팁 카드 사이의 간격만 정의 */
`;

export const TipCard = styled.div`
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

export const DiagnosisGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 6rem;
    align-items: start;
  }
`;
export const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 28rem; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  .section-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 2rem; }
`;
export const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
export const NewChartWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  height: clamp(10rem, 20vw, 25rem); /* 반응형 높이 (최소 10rem, 뷰포트 너비의 20%, 최대 25rem) */
  border: none;
  background-color: transparent;
`;
export const NewLegendContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const NewLegendItem = styled.div`

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #f1f5f9; }
`;

export const NewLegendColorBox = styled.span<{ color: string }>`
  width: 1rem;
  height: 1rem;

  border-radius: 9999px;
  background-color: ${props => props.color};
  margin-right: 0.75rem;
`;

export const FullReportCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1; /* 남은 세로 공간을 채우도록 */
`;

export const FullTabNav = styled.nav`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1rem;
  overflow-x: auto;
`;
export const FullTabButton = styled.button<{ $isActive: boolean }>`
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

export const FullTabContentContainer = styled.div`
  padding: 1.5rem 2rem;
  /* min-height: 240px; */ /* 최소 높이 제거 */
  overflow-y: auto;
  flex-grow: 1; /* 남은 세로 공간을 채우도록 */
`;
export const FullActionsContainer = styled.div`
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  width: 100%;
`;
export const ActionButton = styled.button<{ primary?: boolean; fullWidth?: boolean }>`
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
export const FullContentBlock = styled.div`
  h3 { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem; }
  ul { list-style-position: inside; list-style-type: disc; display: flex; flex-direction: column; gap: 0.75rem; color: #334155; line-height: 1.7; }
`;

export const ReportContainer = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 1.5rem; /* 24px, 부드러운 모서리 */
  box-shadow: 0 10px 25px 10px rgba(0, 0, 0, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.07);
  max-width: 80rem; /* 최대 너비 제한 */
  margin: 0 auto; /* 중앙 정렬 */
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;
