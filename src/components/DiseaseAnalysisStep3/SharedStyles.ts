import styled, { css } from 'styled-components';

export const Frame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border-radius: 3.2rem;
  padding: 1.5rem 3rem 2.5rem 3rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(71, 69, 179, 0.2);
`;

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  margin: 0 auto 2rem; 

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

export const StepItem = styled.div<{ $status: 'completed' | 'active' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  color: #94a3b8;
  font-weight: 700;
  ${({ $status }) =>
    ($status === 'completed' || $status === 'active') &&
    css`
      border-color: #00A6FD;
      background-color: #00A6FD;
      color: white;
    `}
`;

export const StepLine = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: #e2e8f0;
`;

export const MainContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem; 
  flex-grow: 1;
  align-items: stretch;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const MainTitlePanel = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 0 1rem 0;
`;

export const MainTitle = styled.h1`
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    font-weight: 700;
    color: #1E293B;
    margin-bottom: 0.625rem;
`;

export const ChartPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ChartWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  height: 18rem;

  @media (max-width: 768px) {
    height: 16rem;
    max-width: 100%;
  }
`;

export const LegendContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #f8fafc; }
`;

export const LegendLabel = styled.div` display: flex; align-items: center; `;
export const LegendColorBox = styled.span<{ color: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  background-color: ${(props) => props.color};
`;
export const LegendText = styled.span` color: #334155; `;
export const LegendValue = styled.span` font-weight: 700; color: #1e293b; `;
export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
`;

export const DetailsPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const DetailsBox = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 2rem;
  background-color: #f8fafc;
`;

export const TabNav = styled.nav`
  display: flex;
  width: 100%;
  padding: 0 1rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: white;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;
  overflow: hidden;
`;

export const TabButton = styled.button<{ $isActive: boolean }>`
  flex: 1;
  text-align: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #64748b;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  ${({ $isActive }) => $isActive && css` color: #157FF1; border-bottom-color: #157FF1; `}
`;

export const TabContentContainer = styled.div`
  padding: 1rem 2rem;
  flex-grow: 1;
  min-height: 28rem; /* 요약 탭 기준으로 일정 높이 유지 */
`;
export const TabContent = styled.div`
  h3 { font-weight: 700; font-size: 1.125rem; color: #1e293b; margin: 0 0 0.75rem; }
  ul { list-style: disc; list-style-position: inside; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; color: #475569; line-height: 1.6; }
  strong { font-weight: 700; }
`;

export const ButtonGroup = styled.div` padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; `;
export const TwoButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
export const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; font-weight: 700; padding: 0.625rem 0; border-radius: 1rem;
  font-size: 1rem; border: none; cursor: pointer; transition: background-color 0.2s ease;
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary': return css` background-color: #157FF1; color: white; &:hover { background-color: #2563eb; }`;
      case 'secondary': return css` background-color: #475569; color: white; &:hover { background-color: #334155; }`;
      default: return css` background-color: #e2e8f0; color: #334155; &:hover { background-color: #cbd5e1; }`;
    }
  }}
`;

export const ReportCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: white;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

export const InfoCard = styled.div`
  background-color: #ffffff;
  border-radius: 1rem; /* 16px, 둥근 모서리 */
  padding: 1.5rem; /* 24px, 카드 내부 여백 */
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9; /* 아주 옅은 테두리 */
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CardTitle = styled.h2`
  font-size: 1.125rem; /* 18px */
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.5rem 0; /* 제목과 내용 사이의 하단 여백 */
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 아이콘과 텍스트 사이 간격 */
`;
