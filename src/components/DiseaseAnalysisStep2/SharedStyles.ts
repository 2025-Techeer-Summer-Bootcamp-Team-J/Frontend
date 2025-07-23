import styled, { css } from 'styled-components';

// New !!
export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fbfdffff;
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


// --- Step Indicator ---
export const StepIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  margin: 0 auto 2rem; 

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

export const StepCircle = styled.div<{ $active?: boolean; $completed?: boolean }>`
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


// --- Main Content ---
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

export const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem; 
  width: 100%;
  padding: 0 2rem;

  @media (max-width: 768px) {
    flex-grow: 1; 
    justify-content: flex-start;
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
      background-color: #F0F9FF; /* Tailwind: bg-blue-100 */
      border-color: #157FF1; /* Tailwind: border-blue-500 */
      color: #157FF1; /* Tailwind: text-blue-800 */
      font-weight: 600;
    `}
`;

export const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 100%;
  flex-wrap: nowrap;
`;

export const ItchSlider = styled.input`
  flex-grow: 1;
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
    background: #157FF1;
    cursor: pointer;
    border-radius: 50%;
    margin-top: -7px;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: #157FF1;
    cursor: pointer;
    border-radius: 50%;
  }
`;

export const ItchSliderLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  white-space: nowrap;
  `;

export const ItchSliderLabelRight = styled(ItchSliderLabel)`
  color: #2B57E5;
`;

export const InfoTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
  height: 6rem;
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
  padding-top: 0.5rem;

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
  padding: 0.8rem 1.8rem;
  border-radius: 1rem;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

export const PreviousButton = styled(BaseButton)`
  background-color: #F2F5FA;
  color: #334155;
  &:hover {
    background-color: #e2e8f0;
  }
`;

export const SkipButton = styled(BaseButton)`
  background-color: white;
  color: #157FF1;
  border: 2px solid #157FF1;
  &:hover {
    background-color: #eff6ff;
  }
`;

export const NextButton = styled(BaseButton)`
  background-color: #157FF1;
  color: white;
  &:hover {
    background-color: #225FEA;
  }
`;
