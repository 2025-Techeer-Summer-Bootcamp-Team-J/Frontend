import React from 'react';
import { ContentWrapper } from '../components/Layout';
import StepIndicator from '../components/DiseaseAnalysisStep3/StepIndicator';
import ChartPanel from '../components/DiseaseAnalysisStep3/ChartPanel';
import DetailsPanel from '../components/DiseaseAnalysisStep3/DetailsPanel';
import { MainContent } from '../components/DiseaseAnalysisStep3/SharedStyles';
import { useNavigate } from 'react-router-dom';

const DiseaseAnalysisStep3: React.FC = () => {
  const navigate = useNavigate();

  const handleRestartAnalysis = () => {
    navigate('/disease-analysis-step1');
  };

  return (
    <ContentWrapper style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      <StepIndicator />
      <MainContent>
        <ChartPanel />
        <DetailsPanel onRestartAnalysis={handleRestartAnalysis} />
      </MainContent>
    </ContentWrapper>
  );
};

export default DiseaseAnalysisStep3;
