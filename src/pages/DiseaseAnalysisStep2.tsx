import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate } from 'react-router-dom';

// --- Styled Components (스타일 정의) ---

const PageContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  padding: 3rem 4rem;
  width: 100%;
  flex-grow: 1;

  @media (max-width: 1024px) {
    padding: 2rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const StepProgressContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  margin: 0 auto 3rem; /* Tailwind: mb-12 */
`;

const StepIndicator = styled.div<{ $active?: boolean; $completed?: boolean }>`
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

const StepLine = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: #e2e8f0;
`;

const MainContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem; /* Tailwind: space-y-6 */
`;

const PageTitle = styled.h1`
  font-size: 1.5rem; /* Tailwind: text-2xl */
  font-weight: 700;
  color: #1e293b; /* Tailwind: text-slate-800 */
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionHeading = styled.h3`
  font-weight: 700;
  font-size: 1.125rem; /* Tailwind: text-lg */
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* Tailwind: gap-3 */
`;

const SymptomTag = styled.div<{ $selected?: boolean }>`
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

const SliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #64748b;
  font-size: 0.875rem;
`;

const ItchSlider = styled.input`
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

const InfoTextarea = styled.textarea`
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

const ButtonContainer = styled.div`
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 600px) {
    display: flex;
    flex-direction: column-reverse;
    gap: 1rem;
    width: 100%;
  }
`;

const BaseButton = styled.button`
  font-weight: 700;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
`;

const PreviousButton = styled(BaseButton)`
  background-color: #e2e8f0;
  color: #334155;
  &:hover {
    background-color: #cbd5e1;
  }
`;

const SkipButton = styled(BaseButton)`
  background-color: white;
  color: #2563eb;
  border: 2px solid #2563eb;
  &:hover {
    background-color: #eff6ff;
  }
`;

const NextButton = styled(BaseButton)`
  background-color: #2563eb;
  color: white;
  &:hover {
    background-color: #1d4ed8;
  }
`;

// --- 데이터 정의 ---
const SYMPTOMS = ['가려움', '따가움/통증', '붉은 반점', '각질/비늘', '진물/수포', '피부 건조', '뾰루지/여드름'];
const DURATIONS = ['오늘', '2-3일 전', '1주일 이상', '오래 전'];

// --- React 컴포넌트 본문 ---
const DiseaseAnalysisStep2Page: React.FC = () => {
    const navigate = useNavigate();
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [itchLevel, setItchLevel] = useState<number>(0);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');

    const handleSymptomToggle = (symptom: string) => {
        setSelectedSymptoms(prev => 
            prev.includes(symptom) 
                ? prev.filter(s => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleDurationSelect = (duration: string) => {
        setSelectedDuration(prev => (prev === duration ? null : duration));
    };

    const handleNextButtonClick = () => {
        navigate('/disease-analysis-step3');
    };

    return (
        <PageContainer>
            <Wrapper>
                <StepProgressContainer>
                    <StepIndicator $completed>1</StepIndicator>
                    <StepLine />
                    <StepIndicator $active>2</StepIndicator>
                    <StepLine />
                    <StepIndicator>3</StepIndicator>
                </StepProgressContainer>

                <MainContent>
                    <PageTitle>2단계: 증상 및 정보 입력</PageTitle>
                    
                    <InputSection>
                        <SectionHeading>주요 증상 (중복 선택 가능)</SectionHeading>
                        <TagContainer>
                            {SYMPTOMS.map(symptom => (
                                <SymptomTag
                                    key={symptom}
                                    $selected={selectedSymptoms.includes(symptom)}
                                    onClick={() => handleSymptomToggle(symptom)}
                                >
                                    {symptom}
                                </SymptomTag>
                            ))}
                        </TagContainer>
                    </InputSection>
                    
                    <InputSection>
                        <SectionHeading>가려움 정도 (해당 시)</SectionHeading>
                        <SliderContainer>
                            <span>없음</span>
                            <ItchSlider 
                                type="range" 
                                min="0" 
                                max="4" 
                                value={itchLevel}
                                onChange={(e) => setItchLevel(Number(e.target.value))}
                            />
                            <span>매우 심함</span>
                        </SliderContainer>
                    </InputSection>
                    
                    <InputSection>
                        <SectionHeading>언제부터 시작됐나요?</SectionHeading>
                        <TagContainer>
                            {DURATIONS.map(duration => (
                                <SymptomTag
                                    key={duration}
                                    $selected={selectedDuration === duration}
                                    onClick={() => handleDurationSelect(duration)}
                                >
                                    {duration}
                                </SymptomTag>
                            ))}
                        </TagContainer>
                    </InputSection>
                    
                    <InputSection>
                        <SectionHeading>보조 정보</SectionHeading>
                        <InfoTextarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            placeholder="예: 3일 전부터 갑자기 가렵기 시작했어요. 특정 음식을 먹은 후에 더 심해지는 것 같아요."
                        />
                    </InputSection>
                </MainContent>

                <ButtonContainer>
                    <PreviousButton>이전</PreviousButton>
                    <ButtonGroup>
                        <SkipButton onClick={handleNextButtonClick}>건너뛰기</SkipButton>
                        <NextButton onClick={handleNextButtonClick}>분석 결과 보기</NextButton>
                    </ButtonGroup>
                </ButtonContainer>
            </Wrapper>
        </PageContainer>
    );
};

export default DiseaseAnalysisStep2Page;