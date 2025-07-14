import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';
import { api, type DiagnosisRequest } from '../services';


// --- Styled Components (스타일 정의) ---

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

  @media (max-width: 768px) {
    flex-grow: 1; /* 모바일에서 컨텐츠 영역이 최대한 확장되도록 */
    justify-content: flex-start;
  }
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
    const location = useLocation();
    const [userId] = useState<number>(1); // 예시 사용자 ID
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [itchLevel, setItchLevel] = useState<number>(0);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');

    // 전달받은 이미지 파일
    const uploadedImage = location.state?.uploadedImage as File | undefined;

    // Loading state for API calls
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleSkipButtonClick = async () => {
        // 이미지가 있다면 최소한의 데이터로 API 호출
        if (uploadedImage) {
            setIsSubmitting(true);
            try {
                const diagnosisData: DiagnosisRequest = {
                    user_id: userId,
                    symptoms: [], // 빈 배열
                    affected_areas: [],
                    duration: 'unknown',
                    severity: 0,
                    images: [uploadedImage],
                    additional_info: '건너뛰기 선택'
                };
                
                const response = await api.diagnoses.create(diagnosisData);
                console.log('진단 요청 성공 (건너뛰기):', response);
                navigate('/disease-analysis-step3', { 
                    state: { diagnosisResult: response } 
                });
            } catch (error) {
                console.error('진단 요청 실패 (건너뛰기):', error);
                // 에러가 발생해도 일단 다음 단계로 진행
                navigate('/disease-analysis-step3');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // 이미지가 없다면 바로 다음 단계로
            navigate('/disease-analysis-step3');
        }
    };

    const handleNextButtonClick = async () => {
        // API 진단 요청 전송
        if (selectedSymptoms.length > 0 || uploadedImage) {
            setIsSubmitting(true);
            try {
                const diagnosisData: DiagnosisRequest = {
                    user_id: userId,
                    symptoms: selectedSymptoms,
                    affected_areas: selectedSymptoms, // 증상을 영향 받은 부위로도 사용
                    duration: selectedDuration || 'unknown',
                    severity: itchLevel,
                    images: uploadedImage ? [uploadedImage] : undefined,
                    additional_info: additionalInfo || `가려움 정도: ${itchLevel}/10`
                };
                
                const response = await api.diagnoses.create(diagnosisData);
                console.log('진단 요청 성공:', response);
                navigate('/disease-analysis-step3', { 
                    state: { diagnosisResult: response } 
                });
            } catch (error) {
                console.error('진단 요청 실패:', error);
                // 에러가 발생해도 일단 다음 단계로 진행
                navigate('/disease-analysis-step3');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // 증상이나 이미지가 없는 경우에도 다음 단계로
            navigate('/disease-analysis-step3');
        }
    };

    return (
        <ContentWrapper style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            {/* --- 단계 진행 표시 --- */}
            <StepProgressContainer>
                <StepIndicator $completed>1</StepIndicator>
                <StepLine />
                <StepIndicator $active>2</StepIndicator>
                <StepLine />
                <StepIndicator>3</StepIndicator>
            </StepProgressContainer>

            {/* --- 메인 컨텐츠 --- */}
            <MainContent>
                <PageTitle>2단계: 증상에 대한 정보를 알려주세요</PageTitle>

                {/* --- 증상 선택 --- */}
                <InputSection>
                    <SectionHeading>어떤 증상이 있나요? (중복 선택 가능)</SectionHeading>
                    <TagContainer>
                        {SYMPTOMS.map((symptom) => (
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
                
                {/* --- 가려움 정도 --- */}
                <InputSection>
                    <SectionHeading>가려움의 정도는 어떤가요?</SectionHeading>
                    <SliderContainer>
                        <span>없음</span>
                        <ItchSlider
                            type="range"
                            min="0"
                            max="10"
                            value={itchLevel}
                            onChange={(e) => setItchLevel(Number(e.target.value))}
                        />
                        <span>매우 심함 ({itchLevel})</span>
                    </SliderContainer>
                </InputSection>
                
                {/* --- 증상 기간 --- */}
                <InputSection>
                    <SectionHeading>증상이 언제부터 시작됐나요?</SectionHeading>
                    <TagContainer>
                        {DURATIONS.map((duration) => (
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

                {/* 추가 정보 */}
                <InputSection>
                    <SectionHeading>그 외에 다른 정보가 있다면 알려주세요.</SectionHeading>
                    <InfoTextarea
                        placeholder="예) 특정 음식을 먹었을 때, 특정 화장품을 사용했을 때 등"
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                    />
                </InputSection>

                {/* 네비게이션 버튼 */}
                <ButtonContainer>
                    <PreviousButton onClick={() => navigate('/disease-analysis-step1')}>
                        이전 단계
                    </PreviousButton>
                    <ButtonGroup>
                        <SkipButton onClick={handleSkipButtonClick} disabled={isSubmitting}>
                            {isSubmitting ? '분석 중...' : '건너뛰기'}
                        </SkipButton>
                        <NextButton 
                            onClick={handleNextButtonClick}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '분석 중...' : '다음 단계'}
                        </NextButton>
                    </ButtonGroup>
                </ButtonContainer>
            </MainContent>
        </ContentWrapper>
    );
};

export default DiseaseAnalysisStep2Page;