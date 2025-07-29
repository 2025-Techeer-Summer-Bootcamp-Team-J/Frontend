import styled, { css } from 'styled-components';

export const ResultPageFrame = styled.div`
  /* 1. ContentWrapper의 핵심 스타일을 여기에 직접 추가합니다 */
  width: 100%;
  max-width: 80rem; /* Layout 파일에 있던 값 */
  margin-left: auto;  /* margin: 0 auto 와 동일한 역할 */
  margin-right: auto; /* margin: 0 auto 와 동일한 역할 */

  /* 2. 우리가 원했던 '전용 월페이퍼' 디자인 */
  background: #FBFDFF;
  border-radius: .5rem;
  padding: 2.3rem 2.3rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(92, 90, 231, 0.2);

  /* 3. 위아래 여백 */
  margin-top: 4rem;
  margin-bottom: 2.5rem;

  /* 4. 모바일 화면 대응 */
  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem;
    margin-top: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 2rem;
  }
`;


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
  gap: 2rem; 
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
    color: #17171B;
    margin: 0 0 1rem 0;
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
  border-radius: 1.2rem; /* 16px, 둥근 모서리 */
  padding: 2.5rem; /* 24px, 카드 내부 여백 */
  box-shadow: 0.15rem 0.15rem 0.4rem rgba(131, 129, 235, 0.2);
  /* border: 1px solid #f1f5f9; */ /* 아주 옅은 테두리 */
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const CardTitle = styled.h2`
  font-size: 1.3rem; /* 18px */
  font-weight: 700;
  border-bottom: 3px solid #f0f9ff;
  color: #05A6FD;
  margin: 0 0 1.5rem 0; /* 제목과 내용 사이의 하단 여백 */
  display: flex;
  align-items: center;
  gap: 0.6rem; /* 아이콘과 텍스트 사이 간격 */
  padding-bottom: 0.5rem; /* 8px 정도의 여백 추가 */
`;

export const AIOpinionBox = styled.div`
  background: #f0f9ff;
  border-left: 4px solid #05A6FD;
  padding: 1rem 1rem 0.3rem 1rem;
  margin: 1rem 0 0rem 0;
  border-radius: 0 1rem 1rem 0;

  h3 {
    color: #05A6FD;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: 1.1rem; /* AI 소견 제목 폰트 크기 조정 */
  }

  p { margin: 0 0 0.75rem 0; }
`;

export const FullWidthInfoCard = styled(InfoCard)`
  /* 이 카드가 그리드의 1번 줄에서부터 끝(-1) 줄까지 모두 차지하도록 설정합니다. */
  grid-column: 1 / -1;
`;