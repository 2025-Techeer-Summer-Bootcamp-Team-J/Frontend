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
import { MainContent, Frame, PageWrapper, MainTitlePanel, MainTitle } from '../components/DiseaseAnalysisStep2/SharedStyles';
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
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(true);

    const { uploadedFiles = [] } = location.state || {};
    const [analysisResults, setAnalysisResults] = useState<
        AnalysisResult[]
    >(
        location.state?.analysisResults || []
    );

    const successfulTasks = analysisResults.filter(r => r.success && r.taskId);

    useEffect(() => {
        if (successfulTasks.length === 0) {
            setIsAnalyzing(false);
            return;
        }

        let isCancelled = false;
        let pollingCount = 0;

        const pollTaskStatus = async (taskId: string) => {
            try {
                const status = await api.diagnoses.getTaskStatus(taskId);
                if (isCancelled) return;

                if (status.state === 'SUCCESS') {
                    setAnalysisResults(prev =>
                        prev.map(r => (r.taskId === taskId ? { ...r, result: status.result } : r))
                    );
                } else if (status.state === 'FAILURE') {
                    console.error(`Task ${taskId} failed.`);
                } else {
                    // Continue polling
                    setTimeout(() => pollTaskStatus(taskId), 1000);
                }
            } catch (error) {
                if (isCancelled) return;
                console.error('❌ Task 상태 확인 실패:', error);
                setTimeout(() => pollTaskStatus(taskId), 1000);
            }
        };

        successfulTasks.forEach(task => pollTaskStatus(task.taskId!));

        // Check if all tasks are complete
        const interval = setInterval(() => {
            pollingCount++;
            const completedCount = analysisResults.filter(r => r.result || r.errorMessage).length;
            if (completedCount === successfulTasks.length || pollingCount > 30) { // 30초 타임아웃
                setIsAnalyzing(false);
                clearInterval(interval);
            }
        }, 1000);

        return () => {
            isCancelled = true;
            clearInterval(interval);
        };
    }, []); // Run only once on mount


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
        const successfulResult = analysisResults.find(r => r.result);
        if (successfulResult) {
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
        const successfulResult = analysisResults.find(r => r.result);
        if (successfulResult) {
            interface BasicResult { data?: Array<{ disease_name: string; confidence: number }>; }
            const aggregateConfidence = (results: AnalysisResult[]) => {
                const map = new Map<string, number>();
                let total = 0;
                results.forEach((r) => {
                    if (!r.result) return;
                    const arr = (r.result as BasicResult).data ?? [];
                    arr.forEach(({ disease_name, confidence }) => {
                        const numericConfidence = Number(confidence) || 0;
                        const prev = map.get(disease_name) || 0;
                        map.set(disease_name, prev + numericConfidence);
                        total += numericConfidence;
                    });
                });

                if (total === 0) return [];

                const stats = Array.from(map.entries()).map(([name, sum]) => ({
                    name,
                    percent: parseFloat(((sum / total) * 100).toFixed(1))
                }));
                stats.sort((a,b)=>b.percent-a.percent);
                return stats;
            };

            const diseaseStats = aggregateConfidence(analysisResults as AnalysisResult[]);
            navigate('/disease-analysis-step3', {
                state: {
                    uploadedFiles: uploadedFiles,
                    analysisResults: analysisResults,
                    selectedResult: successfulResult,
                    diseaseStats: diseaseStats,
                    topDiseaseName: diseaseStats[0]?.name,
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
        <PageWrapper>
            <ContentWrapper style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <MainTitlePanel>
                    <MainTitle>증상에 대한 정보를 알려주세요</MainTitle>
                </MainTitlePanel>

                <Frame>
                    <StepProgress currentStep={2} />
                    <MainContent>
                        {statusMessage && (
                            <div style={{ 
                                padding: '0.8rem',
                                marginBottom: '0.4rem', 
                                backgroundColor: '#FFFAE6', 
                                border: '1px solid #ffeaa7', 
                                borderRadius: '1.3rem',
                                color: '#856404',
                                textAlign: 'center',
                                fontSize: '18px'
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
                </Frame>
            </ContentWrapper>
        </PageWrapper>
    );
};

export default DiseaseAnalysisStep2Page;

