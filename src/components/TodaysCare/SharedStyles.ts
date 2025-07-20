import styled from 'styled-components';
//import { ContentWrapper } from '../../components/Layout';

// ✨ [추가] 전체 페이지를 감싸는 컨테이너
// =================================================================
export const CareContainer = styled.div`
  max-width: 1200px;
  margin: 2rem auto; /* 위아래 여백과 좌우 자동 정렬(가운데 배치) */
  padding: 2.5rem; /* 카드 내부의 여백 */
  background-color: #f8f9fa; /* 두 번째 이미지의 연한 회색 배경 */
  border-radius: 1.5rem; /* 24px, 둥근 모서리 */
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06); /* 부드러운 그림자 효과 */

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

export const LocationStatus = styled.p<{ $isRealTime: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-weight: ${props => props.$isRealTime ? '600' : '400'};
  color: ${props => props.$isRealTime ? '#1E293B' : '#64748B'};
  font-size: ${props => props.$isRealTime ? '1.125rem' : '1rem'};

  &::before {
    content: '●';
    color: ${props => props.$isRealTime ? '#22c55e' : '#94a3b8'};
    font-size: 0.875rem;
    margin-right: 0.25rem;
  }
`;

export const Header = styled.header`
  text-align: center;
  padding: 3rem 0;

  h1 {
    font-size: clamp(2rem, 5vw, 2.5rem); 
    font-weight: 700;
    color: #1E293B;
    margin: 0;
  }
  p {
    font-size: clamp(1rem, 2vw, 1.25rem); 
    color: #64748B;
    margin-top: 0.5rem;
  }
`;

export const UvInfoBox = styled.div` // 핵심: styled(ContentWrapper) -> styled.div
  background-color: #F0F9FF;
  padding: 2.5rem; 
  border-radius: 3.2rem;
  box-shadow:  0.3rem 0.25rem 0.8rem rgba(71, 69, 179, 0.2);

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const UvInfoInnerWrapper = styled.div` // 변경: styled(ContentWrapper) -> styled.div
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
    text-align: center;
  }
`;

export const UvIndexDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const UvIndexVisual = styled.div<{ $bgColor: string }>`
  width: 8rem; 
  height: 8rem; 
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  box-shadow: 0 0.625rem 0.9375rem -0.1875rem rgba(0, 0, 0, 0.1), 0 0.25rem 0.375rem -0.125rem rgba(0, 0, 0, 0.05);
  background-color: ${props => props.$bgColor};
  transition: background-color 0.3s ease;

  span:first-child {
    font-size: 1rem; 
    font-weight: 500;
  }
  span:last-child {
    font-size: clamp(2.5rem, 6vw, 3rem); 
    font-weight: 700;
  }
`;

export const UvIndexText = styled.div`
  p {
    color: #64748B;
    margin: 0;
    font-size: 1rem;
  }
  h2 {
    font-size: clamp(1.8rem, 4vw, 2.25rem); 
    font-weight: 700;
    color: #1E293B;
    margin: 0.25rem 0 0 0;
  }
`;

export const UvSummary = styled.div`
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

export const CareTipsContainer = styled.div`
  width: 100%;
  padding: 2.5rem 0 4rem 0;
`;

export const TabsContainer = styled.div`
  display: flex;
  border-bottom: 0.0625rem solid #E2E8F0;
  overflow-x: auto;
  &::-webkit-scrollbar { height: 0.25rem; }
  &::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 0.625rem; }
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.25rem;
  border: none;
  background-color: transparent;
  color: ${props => props.$active ? '#0891B2' : '#64748B'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  border-bottom: 0.1875rem solid ${props => props.$active ? '#0891B2' : 'transparent'};
  flex-shrink: 0;
  white-space: nowrap;
  font-size: clamp(0.9rem, 1.8vw, 1.2rem); 
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

export const TabRange = styled.span`
  font-size: 0.8rem;
  color: #94A3B8;
  font-weight: 400;
`;

export const TipsContent = styled.div`
  padding-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(17.5rem, 1fr));
  gap: 1.5rem;
`;

export const TipCard = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  background-color: white;
  border: 0rem solid #E2E8F0;
  border-radius: 1.5rem;
  box-shadow:  0.3rem 0.25rem 0.8rem rgba(71, 69, 179, 0.2);
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
