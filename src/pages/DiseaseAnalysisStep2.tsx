import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';


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
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [itchLevel, setItchLevel] = useState<number>(0);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');

    // Step1에서 전달받은 데이터
    const { uploadedFiles, analysisResults } = location.state || { uploadedFiles: [], analysisResults: [] };

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

    const handleSkipButtonClick = () => {
        // 추가 정보 없이 바로 로딩 페이지로 이동
        navigate('/loading', {
            state: {
                uploadedFiles: uploadedFiles,
                analysisResults: analysisResults,
                additionalInfo: {
                    symptoms: [],
                    itchLevel: 0,
                    duration: 'unknown',
                    additionalInfo: '건너뛰기 선택'
                }
            }
        });
    };

    const handleResultViewClick = () => {
        // 추가 정보와 함께 로딩 페이지로 이동
        navigate('/loading', {
            state: {
                uploadedFiles: uploadedFiles,
                analysisResults: analysisResults,
                additionalInfo: {
                    symptoms: selectedSymptoms,
                    itchLevel: itchLevel,
                    duration: selectedDuration || 'unknown',
                    additionalInfo: additionalInfo || `가려움 정도: ${itchLevel}/10`
                }
            }
        });
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
                    onNext={handleResultViewClick}
                    isSubmitting={false}
                />
            </MainContent>
        </ContentWrapper>
    );
};

export default DiseaseAnalysisStep2Page;
