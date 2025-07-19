import styled, { css } from 'styled-components';

// --- Step Indicator ---
export const StepIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem; /* lg */
  margin: 0 auto 3rem; /* mb-12 */

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

export const StepCircle = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  color: #94a3b8;
  font-weight: 700;
  
  ${(props) =>
    props.$active &&
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

// --- Main Content ---
export const MainContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem; /* gap-16 */
  flex-grow: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// --- Left Panel: Guide ---
export const GuidePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: #1e293b; /* slate-800 */

  @media (max-width: 768px) {
    font-size: 1.25rem; /* text-xl */
  }
`;

export const Subtitle = styled.p`
  margin-top: 0.5rem; /* mt-2 */
  color: #64748b; /* slate-500 */
`;

export const GuideList = styled.div`
  margin-top: 2rem; /* mt-8 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
`;

export const GuideItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
`;

export const GuideIcon = styled.div`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  color: #475569;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
`;

// --- Right Panel: Uploader ---
export const UploaderPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const UploadWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem; /* max-w-md */
  height: 24rem; /* h-96 */
  background-color: #f1f5f9; /* slate-100 */
  border-radius: 1rem; /* rounded-2xl */
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px dashed #cbd5e1; /* border-slate-300 */
  transition: border-color 0.2s;

  &:hover {
    border-color: #3b82f6; /* hover:border-blue-500 */
  }
  
  @media (min-width: 1024px) {
    max-width: 36rem;
    height: 28rem;
  }
`;

export const ImagePreview = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem; /* rounded-2xl */
`;

export const UploadPrompt = styled.div`
  text-align: center;
  color: #64748b; /* slate-500 */
  pointer-events: none;
`;

export const PromptText = styled.p`
  margin-top: 1rem; /* mt-4 */
  font-weight: 600; /* font-semibold */
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const NextButton = styled.button`
  margin-top: 2rem; /* mt-8 */
  width: 100%;
  max-width: 28rem; /* max-w-md */
  font-weight: 700;
  padding: 1rem 0; /* py-4 */
  border-radius: 0.5rem; /* rounded-lg */
  font-size: 1.125rem; /* text-lg */
  transition: background-color 0.2s;
  
  &:disabled {
    background-color: #cbd5e1; /* bg-slate-300 */
    color: white;
    cursor: not-allowed;
  }
  
  &:not(:disabled) {
    background-color: #2563eb; /* bg-blue-600 */
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #1d4ed8; /* hover:bg-blue-700 */
    }
  }

  @media (min-width: 1024px) {
    max-width: 36rem;
  }
`;

// --- 캐러셀 UI를 위한 Styled-components 추가 ---
const CarouselButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: background-color 0.2s;

    &:hover {
        background-color: rgba(0, 0, 0, 0.7);
    }
    
    &:disabled {
        background-color: rgba(0, 0, 0, 0.2);
        cursor: not-allowed;
        opacity: 0.5;
    }
`;

export const PrevButton = styled(CarouselButton)`
    left: 1rem;
`;

export const NextImageButton = styled(CarouselButton)`
    right: 1rem;
`;

export const ImageCounter = styled.div`
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 1rem;
    font-size: 0.875rem;
    z-index: 10;
    pointer-events: none;
`;

const ActionButton = styled(CarouselButton)`
    top: 2rem;
    width: 2.25rem;
    height: 2.25rem;
`;

export const RemoveImageButton = styled(ActionButton)`
    right: 1rem;
    &:hover {
      background-color: #ef4444; // red-500
    }
`;

export const AddImageButton = styled(ActionButton)`
    right: 4.25rem;
    &:hover {
      background-color: #3b82f6; // blue-500
    }
`;
