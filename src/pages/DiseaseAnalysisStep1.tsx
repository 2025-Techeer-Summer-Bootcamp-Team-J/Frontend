import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';
import StepIndicator from '../components/DiseaseAnalysisStep1/StepIndicator';
import GuidePanel from '../components/DiseaseAnalysisStep1/GuidePanel';
import UploaderPanel from '../components/DiseaseAnalysisStep1/UploaderPanel';
import { MainContent } from '../components/DiseaseAnalysisStep1/SharedStyles';
import { api } from '../services';

const DiseaseAnalysisStep1: React.FC = () => {
    const navigate = useNavigate();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleNext = async (uploadedFiles: File[]) => {
        if (uploadedFiles.length === 0) return;

        setIsAnalyzing(true);
        try {
            const userId = 1; // TODO: 실제 사용자 ID로 교체 필요
            const analysisResults = [];

            // 각 이미지에 대해 개별적으로 분석 API 호출
            for (const file of uploadedFiles) {
                try {
                    const diagnosisData = {
                        user_id: userId,
                        file: file,
                        symptoms: [],
                        affected_areas: [],
                        duration: 'unknown',
                        severity: 0,
                        additional_info: 'Step1에서 업로드된 이미지'
                    };
                    
                    const response = await api.diagnoses.create(diagnosisData);
                    analysisResults.push({
                        file: file,
                        result: response
                    });
                } catch (error) {
                    console.error('이미지 분석 실패:', file.name, error);
                    // 실패한 경우에도 파일 정보는 유지
                    analysisResults.push({
                        file: file,
                        result: null,
                        error: error
                    });
                }
            }

            // 분석 완료 후 Step2로 이동
            navigate('/disease-analysis-step2', {
                state: { 
                    uploadedFiles: uploadedFiles,
                    analysisResults: analysisResults
                }
            });
        } catch (error) {
            console.error('분석 처리 중 오류:', error);
            alert('분석 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <ContentWrapper style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <StepIndicator currentStep={1} />
            <MainContent>
                <GuidePanel />
                <UploaderPanel onNext={handleNext} isAnalyzing={isAnalyzing} />
            </MainContent>
        </ContentWrapper>
    );
};

export default DiseaseAnalysisStep1;
