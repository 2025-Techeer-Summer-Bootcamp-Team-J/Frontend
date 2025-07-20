import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';
import { api, type DiagnosisRequest } from '../services';

import StepProgress from '../components/DiseaseAnalysisStep2/StepProgress';
import SymptomInput from '../components/DiseaseAnalysisStep2/SymptomInput';
import ItchLevelSlider from '../components/DiseaseAnalysisStep2/ItchLevelSlider';
import DurationInput from '../components/DiseaseAnalysisStep2/DurationInput';
import AdditionalInfoInput from '../components/DiseaseAnalysisStep2/AdditionalInfoInput';
import NavigationButtons from '../components/DiseaseAnalysisStep2/NavigationButtons';
import { MainContent, PageTitle } from '../components/DiseaseAnalysisStep2/SharedStyles';

const SYMPTOMS = ['가려움', '따가움/통증', '붉은 반점', '각질/비늘', '진물/수포', '피부 건조', '뾰루지/여드름'];
const DURATIONS = ['오늘', '2-3일 전', '1주일 이상', '오래 전'];

const DiseaseAnalysisStep2Page: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userId] = useState<number>(1); // 예시 사용자 ID
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [itchLevel, setItchLevel] = useState<number>(0);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');

    const uploadedImage = location.state?.uploadedImage as File | undefined;
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
        if (uploadedImage) {
            setIsSubmitting(true);
            try {
                const diagnosisData: DiagnosisRequest = {
                    user_id: userId,
                    symptoms: [],
                    affected_areas: [],
                    duration: 'unknown',
                    severity: 0,
                    file: uploadedImage,
                    additional_info: '건너뛰기 선택'
                };
                
                const response = await api.diagnoses.create(diagnosisData);
                console.log('진단 요청 성공 (건너뛰기):', response);
                navigate('/disease-analysis-step3', { 
                    state: { diagnosisResult: response } 
                });
            } catch (error) {
                console.error('진단 요청 실패 (건너뛰기):', error);
                navigate('/disease-analysis-step3');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            navigate('/disease-analysis-step3');
        }
    };

    const handleNextButtonClick = async () => {
        if (selectedSymptoms.length > 0 || uploadedImage) {
            setIsSubmitting(true);
            try {
                const diagnosisData: DiagnosisRequest = {
                    user_id: userId,
                    symptoms: selectedSymptoms,
                    affected_areas: selectedSymptoms,
                    duration: selectedDuration || 'unknown',
                    severity: itchLevel,
                    file: uploadedImage,
                    additional_info: additionalInfo || `가려움 정도: ${itchLevel}/10`
                };
                
                const response = await api.diagnoses.create(diagnosisData);
                console.log('진단 요청 성공:', response);
                navigate('/disease-analysis-step3', { 
                    state: { diagnosisResult: response } 
                });
            } catch (error) {
                console.error('진단 요청 실패:', error);
                navigate('/disease-analysis-step3');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            navigate('/disease-analysis-step3');
        }
    };

    return (
        <ContentWrapper style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <StepProgress currentStep={2} />
            <MainContent>
                <PageTitle>2단계: 증상에 대한 정보를 알려주세요</PageTitle>
                <SymptomInput
                    symptoms={SYMPTOMS}
                    selectedSymptoms={selectedSymptoms}
                    onToggle={handleSymptomToggle}
                />
                <ItchLevelSlider
                    itchLevel={itchLevel}
                    onChange={setItchLevel}
                />
                <DurationInput
                    durations={DURATIONS}
                    selectedDuration={selectedDuration}
                    onSelect={handleDurationSelect}
                />
                <AdditionalInfoInput
                    value={additionalInfo}
                    onChange={setAdditionalInfo}
                />
                <NavigationButtons
                    onPrevious={() => navigate('/disease-analysis-step1')}
                    onSkip={handleSkipButtonClick}
                    onNext={handleNextButtonClick}
                    isSubmitting={isSubmitting}
                />
            </MainContent>
        </ContentWrapper>
    );
};

export default DiseaseAnalysisStep2Page;
