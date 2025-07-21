import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ContentWrapper } from '../components/Layout';
import StepIndicator from '../components/DiseaseAnalysisStep1/StepIndicator';
import GuidePanel from '../components/DiseaseAnalysisStep1/GuidePanel';
import UploaderPanel from '../components/DiseaseAnalysisStep1/UploaderPanel';
import { MainContent } from '../components/DiseaseAnalysisStep1/SharedStyles';
import { api } from '../services';

const DiseaseAnalysisStep1: React.FC = () => {
    const navigate = useNavigate();
    const { user, isLoaded } = useUser();
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleNext = async (uploadedFiles: File[]) => {
        if (uploadedFiles.length === 0) return;

        if (!isLoaded || !user) {
            alert('사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
            return;
        }

        setIsAnalyzing(true);
        try {
            const userId = user.id;
            const analysisResults = [];

            // 각 이미지에 대해 개별적으로 분석 API 호출
            for (const file of uploadedFiles) {
                try {
                    const diagnosisData = {
                        user_id: userId,
                        file: file
                    };
                    
                    const response = await api.diagnoses.create(diagnosisData);
                    analysisResults.push({
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        success: true,
                        taskId: response.task_id,
                        status: response.status,
                        message: response.message
                    });
                } catch (error) {
                    console.error('이미지 분석 실패:', file.name, error);
                    // 실패한 경우에도 파일 정보는 유지
                    analysisResults.push({
                        fileName: file.name,
                        fileSize: file.size,
                        fileType: file.type,
                        success: false,
                        errorMessage: error instanceof Error ? error.message : '알 수 없는 오류'
                    });
                }
            }

            // 분석 완료 후 Step2로 이동 (직렬화 가능한 데이터만 전달)
            navigate('/disease-analysis-step2', {
                state: { 
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
