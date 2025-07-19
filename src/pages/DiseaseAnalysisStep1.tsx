import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';
import StepIndicator from '../components/DiseaseAnalysisStep1/StepIndicator';
import GuidePanel from '../components/DiseaseAnalysisStep1/GuidePanel';
import UploaderPanel from '../components/DiseaseAnalysisStep1/UploaderPanel';
import { MainContent } from '../components/DiseaseAnalysisStep1/SharedStyles';

const DiseaseAnalysisStep1: React.FC = () => {
    const navigate = useNavigate();

    const handleNext = (uploadedFiles: File[]) => {
        navigate('/disease-analysis-step2', {
            state: { uploadedImages: uploadedFiles }
        });
    };

    return (
        <ContentWrapper style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <StepIndicator currentStep={1} />
            <MainContent>
                <GuidePanel />
                <UploaderPanel onNext={handleNext} />
            </MainContent>
        </ContentWrapper>
    );
};

export default DiseaseAnalysisStep1;
