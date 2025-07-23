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

// --- Left Panel: Guide ---
export const GuidePanel = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 1.5rem; 
  font-weight: 700;
  color: #1e293b;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem; /* text-xl */
  }
`;

export const Subtitle = styled.p`
  margin: 0.3rem 0.5rem; 
  color: #64748b;
  text-align: center;
  padding-bottom: 1rem;
`;

export const GuideList = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 1.3rem; 
`;

export const GuideItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.4rem;
  background-color: #F0F9FF;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(71, 69, 179, 0.15);
`;

export const GuideIcon = styled.div`
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  color: #1e293b;
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
  justify-content: space-between;
`;

export const UploadWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 28rem;
  height: 24rem;
  background-color: #F2F5FA; 
  border-radius: 1.5rem; 
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25'
  xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24'
  stroke='%23D0D8E8' stroke-width='2.5' stroke-dasharray='4, 6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.2s;
  &:hover {
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='24' ry='24' stroke='%233b82f6' stroke-width='2.5' stroke-dasharray='4, 6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  }
  
  @media (min-width: 1024px) {
    max-width: 36rem;
    height: 23rem;
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
  margin-top: 1rem;
  width: 100%;
  max-width: 28rem;
  font-weight: 700;
  padding: 1rem 0;
  border-radius: 1.2rem; 
  font-size: 1.125rem; 
  transition: background-color 0.2s;
  border: 1.5px solid #bbc1cdff;
  
  &:disabled {
    background-color: #cbd5e1; /* bg-slate-300 */
    color: white;
    cursor: not-allowed;
  }
  
  &:not(:disabled) {
    background-color: #157FF1; /* bg-blue-600 */
    color: white;
    cursor: pointer;
    &:hover {
      background-color: #225FEA; /* hover:bg-blue-700 */
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
