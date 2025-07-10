import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLightbulb, faTintSlash, faCamera } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';

// Styled-components 정의
// ---------------------------------

// --- Step Indicator ---
const StepIndicatorContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem; /* lg */
  margin: 0 auto 3rem; /* mb-12 */

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const StepCircle = styled.div<{ active?: boolean }>`
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
    props.active &&
    css`
      border-color: #3b82f6;
      background-color: #3b82f6;
      color: white;
    `}
`;

const StepLine = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: #e2e8f0;
`;

// --- Main Content ---
const MainContent = styled.div`
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
const GuidePanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 1.5rem; /* text-2xl */
  font-weight: 700;
  color: #1e293b; /* slate-800 */

  @media (max-width: 768px) {
    font-size: 1.25rem; /* text-xl */
  }
`;

const Subtitle = styled.p`
  margin-top: 0.5rem; /* mt-2 */
  color: #64748b; /* slate-500 */
`;

const GuideList = styled.div`
  margin-top: 2rem; /* mt-8 */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* space-y-4 */
`;

const GuideItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
`;

const GuideIcon = styled.div`
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
const UploaderPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UploadWrapper = styled.div`
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

const ImagePreview = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1rem; /* rounded-2xl */
`;

const UploadPrompt = styled.div`
  text-align: center;
  color: #64748b; /* slate-500 */
`;

const PromptText = styled.p`
  margin-top: 1rem; /* mt-4 */
  font-weight: 600; /* font-semibold */
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const NextButton = styled.button`
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

// React Component
// ---------------------------------

const SkinAnalysisStep1: React.FC = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadWrapperClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNextButtonClick = () => {
        navigate('/disease-analysis-step2');
    };

    return (
        <ContentWrapper style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {/* Step Indicator */}
            <StepIndicatorContainer>
                <StepCircle active>1</StepCircle>
                <StepLine />
                <StepCircle>2</StepCircle>
                <StepLine />
                <StepCircle>3</StepCircle>
            </StepIndicatorContainer>

            {/* Main Content */}
            <MainContent>
                {/* Left Panel */}
                <GuidePanel>
                    <div>
                        <Title>AI 피부 분석을 위해 사진을 업로드해주세요</Title>
                        <Subtitle>정확한 분석을 위해 가이드라인을 따라주세요.</Subtitle>
                    </div>
                    <GuideList>
                        <GuideItem>
                            <GuideIcon><FontAwesomeIcon icon={faEye} size="lg" /></GuideIcon>
                            <span>정면을 응시하고, 얼굴 전체가 잘 나오도록 촬영해주세요.</span>
                        </GuideItem>
                        <GuideItem>
                            <GuideIcon><FontAwesomeIcon icon={faLightbulb} size="lg" /></GuideIcon>
                            <span>밝고 균일한 조명 아래에서 촬영하면 분석 정확도가 올라갑니다.</span>
                        </GuideItem>
                        <GuideItem>
                            <GuideIcon><FontAwesomeIcon icon={faTintSlash} size="lg" /></GuideIcon>
                            <span>화장이나 액세서리는 모두 제거한 상태의 민낯 사진을 업로드해주세요.</span>
                        </GuideItem>
                    </GuideList>
                </GuidePanel>

                {/* Right Panel */}
                <UploaderPanel>
                    <UploadWrapper onClick={handleUploadWrapperClick}>
                        {imagePreview ? (
                            <ImagePreview src={imagePreview} alt="Uploaded skin" />
                        ) : (
                            <UploadPrompt>
                                <FontAwesomeIcon icon={faCamera} size="3x" />
                                <PromptText>여기를 클릭하여 사진을 업로드하세요</PromptText>
                            </UploadPrompt>
                        )}
                        <HiddenFileInput
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </UploadWrapper>
                    <NextButton onClick={handleNextButtonClick} disabled={!imagePreview}>
                        다음 단계로
                    </NextButton>
                </UploaderPanel>
            </MainContent>
        </ContentWrapper>
    );
};

export default SkinAnalysisStep1;