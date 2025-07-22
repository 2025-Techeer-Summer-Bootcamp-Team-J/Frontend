import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ContentWrapper } from '../components/Layout';
import { api } from '../services';

import StepProgress from '../components/DiseaseAnalysisStep2/StepProgress';
import SymptomInput from '../components/DiseaseAnalysisStep2/SymptomInput';
import ItchLevelSlider from '../components/DiseaseAnalysisStep2/ItchLevelSlider';
import DurationInput from '../components/DiseaseAnalysisStep2/DurationInput';
import AdditionalInfoInput from '../components/DiseaseAnalysisStep2/AdditionalInfoInput';
import NavigationButtons from '../components/DiseaseAnalysisStep2/NavigationButtons';
import { MainContent, PageTitle } from '../components/DiseaseAnalysisStep2/SharedStyles';
import { SYMPTOMS, DURATIONS } from '../constants/diseaseAnalysis';

// 타입 정의
interface AnalysisResult {

  fileName?: string;
  fileSize?: number;
  fileType?: string;
  success?: boolean;
  taskId?: string;
  status?: string;
  message?: string;
  errorMessage?: string;
  file?: File;
  result?: unknown;

  error?: unknown;
}

const DiseaseAnalysisStep2Page: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
    const [itchLevel, setItchLevel] = useState<number>(0);
    const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
    const [additionalInfo, setAdditionalInfo] = useState<string>('');
    const [hasValidResults, setHasValidResults] = useState<boolean>(false);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);
    // 분석 완료 후 전체 결과를 저장
    const [completedResult, setCompletedResult] = useState<AnalysisResult | null>(null);

    // Step1에서 전달받은 데이터
    const { uploadedFiles = [], analysisResults = [] } = location.state || {};


    useEffect(() => {
        // 페이지 로드 시 분석 결과 유효성 검사
        const checkResults = () => {
            if (!analysisResults || analysisResults.length === 0) {
                return false;
            }
            
            // 성공한 분석 결과가 있는지 확인
            const successfulResults = analysisResults.filter((result: AnalysisResult) => 
                result.success === true && result.taskId
            );
            
            return successfulResults.length > 0;
        };
        
        const isValid = checkResults();
        setHasValidResults(isValid);
        
        if (!isValid) {
            console.warn('유효한 분석 결과가 없습니다:', analysisResults);
        }
    }, [analysisResults]);

    // 분석 Task 상태를 주기적으로 확인하여 완료되면 버튼을 활성화한다
    useEffect(() => {
        if (!hasValidResults) return;

        // 첫 번째 성공한 task 선택
        const target = (analysisResults as AnalysisResult[]).find(r => r.success === true && r.taskId);
        if (!target?.taskId) return;

        let isCancelled = false;

        const pollTaskStatus = async () => {
            try {
                const status = await api.diagnoses.getTaskStatus(target.taskId!);
                if (isCancelled) return;

                if (status.state === 'SUCCESS') {
                    setIsAnalyzing(false);
                    setCompletedResult({ ...target, result: status.result || target.result });
                    return; // stop polling
                }
                if (status.state === 'FAILURE') {
                    setIsAnalyzing(false);
                    alert('이미지 분석에 실패했습니다. 다시 시도해주세요.');
                    return;
                }
                // 여전히 진행 중인 경우 1초 후 재시도
                setTimeout(pollTaskStatus, 1000);
            } catch (error) {
                if (isCancelled) return;
                console.error('❌ Task 상태 확인 실패:', error);
                setTimeout(pollTaskStatus, 1000);
            }
        };

        // 초기 폴링 시작
        pollTaskStatus();

        return () => {
            isCancelled = true;
        };
    }, [hasValidResults, analysisResults]);


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

        if (!hasValidResults) {
            alert('분석이 아직 진행 중이거나 실패했습니다.\n\n잠시 후 다시 시도하거나 새로운 이미지로 분석을 시작해주세요.');
            navigate('/disease-analysis-step1');
            return;
        }

        // 성공한 분석 결과 찾기
        const successfulResult = completedResult ?? analysisResults.find((result: AnalysisResult) => 
            result.success === true && result.taskId
        );
        
        if (successfulResult) {
            // LoadingPage로 이동 (추가 정보 없이)
            navigate('/disease-analysis-step3', {

                state: {
                    uploadedFiles: uploadedFiles,
                    analysisResults: analysisResults,
                    selectedResult: successfulResult,
                    additionalInfo: {
                        symptoms: [],
                        itchLevel: 0,
                        duration: 'unknown',
                        additionalInfo: '건너뛰기 선택'
                    }
                }
            });
        } else {

            alert('분석 결과를 사용할 수 없습니다.\n\n다시 분석을 진행해주세요.');

            navigate('/disease-analysis-step1');
        }
    };

    const handleResultViewClick = () => {

        if (!hasValidResults) {
            alert('분석이 아직 진행 중이거나 실패했습니다.\n\n잠시 후 다시 시도하거나 새로운 이미지로 분석을 시작해주세요.');
            navigate('/disease-analysis-step1');
            return;
        }

        // 성공한 분석 결과 찾기
        const successfulResult = completedResult ?? analysisResults.find((result: AnalysisResult) => 
            result.success === true && result.taskId
        );
        
        if (successfulResult) {
            // LoadingPage로 이동 (추가 정보와 함께)
            navigate('/disease-analysis-step3', {

                state: {
                    uploadedFiles: uploadedFiles,
                    analysisResults: analysisResults,
                    selectedResult: successfulResult,
                    additionalInfo: {
                        symptoms: selectedSymptoms,
                        itchLevel: itchLevel,
                        duration: selectedDuration || 'unknown',
                        additionalInfo: additionalInfo || `가려움 정도: ${itchLevel}/10`
                    }
                }
            });
        } else {

            alert('분석 결과를 사용할 수 없습니다.\n\n다시 분석을 진행해주세요.');

            navigate('/disease-analysis-step1');
        }
    };

    // 분석 결과가 없거나 모두 실패한 경우 경고 메시지 표시
    const getStatusMessage = () => {
        if (!analysisResults || analysisResults.length === 0) {
            return '분석 결과가 없습니다. 이전 단계로 돌아가서 다시 시도해주세요.';
        }
        
        const failedResults = analysisResults.filter((result: AnalysisResult) => result.success === false);
        const successResults = analysisResults.filter((result: AnalysisResult) => result.success === true);
        
        if (failedResults.length > 0 && successResults.length === 0) {
            return '이미지 분석에 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.';
        }
        
        return null;
    };

    const statusMessage = getStatusMessage();

    return (
        <ContentWrapper style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <StepProgress currentStep={2} />
            <MainContent>
                <PageTitle>2단계: 증상에 대한 정보를 알려주세요</PageTitle>
                
                {statusMessage && (
                    <div style={{ 
                        padding: '1rem', 
                        margin: '1rem 0', 
                        backgroundColor: '#fff3cd', 
                        border: '1px solid #ffeaa7', 
                        borderRadius: '0.5rem',
                        color: '#856404'
                    }}>
                        ⚠️ {statusMessage}
                    </div>
                )}
                
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
                    isSubmitting={isAnalyzing}
                />
            </MainContent>
        </ContentWrapper>
    );
};

export default DiseaseAnalysisStep2Page;
