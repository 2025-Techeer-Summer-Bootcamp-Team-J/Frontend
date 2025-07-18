import styled, { css } from 'styled-components';

export const StepProgressContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  margin: 0 auto 3rem; /* Tailwind: mb-12 */
`;

export const StepIndicator = styled.div<{ $active?: boolean; $completed?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  color: #94a3b8;
  font-weight: 700;
  transition: all 0.3s ease;

  ${(props) =>
    (props.$active || props.$completed) &&
    css`
      border-color: #3b82f6;
      background-color: #3b82f6;
      color: white;
    `}
`;

export const StepLine = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: #e2e8f0;
`;

export const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem; /* Tailwind: space-y-6 */

  @media (max-width: 768px) {
    flex-grow: 1; /* 모바일에서 컨텐츠 영역이 최대한 확장되도록 */
    justify-content: flex-start;
  }
`;

export const PageTitle = styled.h1`
  font-size: 1.5rem; /* Tailwind: text-2xl */
  font-weight: 700;
  color: #1e293b; /* Tailwind: text-slate-800 */
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SectionHeading = styled.h3`
  font-weight: 700;
  font-size: 1.125rem; /* Tailwind: text-lg */
`;

export const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* Tailwind: gap-3 */
`;

export const SymptomTag = styled.div<{ $selected?: boolean }>`
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  border: 1px solid #cbd5e1;
  background-color: white;
  transition: all 0.2s ease;
  user-select: none; /* 텍스트 드래그 방지 */

  ${(props) =>
    props.$selected &&
    css`
      background-color: #dbeafe; /* Tailwind: bg-blue-100 */
      border-color: #3b82f6; /* Tailwind: border-blue-500 */
      color: #1e40af; /* Tailwind: text-blue-800 */
      font-weight: 600;
    `}
`;

export const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

export const ItchSlider = styled.input`
  width: 100%;
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 0.5rem;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #3b82f6;
    cursor: pointer;
    border-radius: 50%;
    margin-top: -7px;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #3b82f6;
    cursor: pointer;
    border-radius: 50%;
  }
`;

export const InfoTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.5rem;
  height: 7rem;
  resize: vertical;

  &:focus {
    outline: 2px solid #60a5fa;
    border-color: #3b82f6;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1.5rem;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 1rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
    width: 100%;
  }
`;

export const BaseButton = styled.button`
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const PreviousButton = styled(BaseButton)`
  background-color: #e2e8f0;
  color: #334155;
  &:hover {
    background-color: #cbd5e1;
  }
`;

export const SkipButton = styled(BaseButton)`
  background-color: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  &:hover {
    background-color: #eff6ff;
  }
`;

export const NextButton = styled(BaseButton)`
  background-color: #2563eb;
  color: white;
  &:hover {
    background-color: #1d4ed8;
  }
`;
