import React, { useState, useRef, useEffect, useCallback } from 'react';
import { analyzeSkinType } from '../services/skintypeApi';
import { AxiosError } from 'axios';

import { PageWrapper, GlobalStyle, MainContainer } from '../components/SkinAnalysis/SharedStyles';
import UploadSection from '../components/SkinAnalysis/UploadSection';
import AnalyzingSection from '../components/SkinAnalysis/AnalyzingSection';
import ResultSection from '../components/SkinAnalysis/ResultSection';
import ErrorSection from '../components/SkinAnalysis/ErrorSection';
import { skinCareTips, convertApiResponseToSkinResult, type SkinResult } from '../utils/skinAnalysis';

const SkinAnalysis: React.FC = () => {
    type Section = 'upload' | 'analyzing' | 'result' | 'error';
    const [currentSection, setCurrentSection] = useState<Section>('upload');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState<string>('초기화 중...');
    const [resultData, setResultData] = useState<SkinResult | null>(null);
    const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
    const [currentTip, setCurrentTip] = useState<string>(''); 
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);

    const uploadSectionRef = useRef<HTMLElement>(null);
    const analyzingSectionRef = useRef<HTMLElement>(null);
    const resultSectionRef = useRef<HTMLElement>(null);
    const errorSectionRef = useRef<HTMLElement>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const userId = 1;

    const performSkinAnalysis = useCallback(async (imageFile: File) => {
        try {
            setAnalysisError(null);
            console.log('피부 분석 시작:', { userId, imageFile: imageFile.name, size: imageFile.size });

            const analysisResponse = await analyzeSkinType(userId, { image: imageFile });
            console.log('분석 응답:', analysisResponse);

            const skinResult = convertApiResponseToSkinResult(analysisResponse);
            console.log('최종 결과 데이터:', skinResult);
            
            setResultData(skinResult);
            setHasAnalyzed(true);
            setCurrentSection('result');
        } catch (error) {
            console.error('피부 분석 실패:', error);
            let errorMessage = '분석 중 오류가 발생했습니다.';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as AxiosError<{ error?: string }>;
                if (axiosError.response?.data?.error) {
                    errorMessage = axiosError.response.data.error;
                } else if (axiosError.response?.status === 404) {
                    errorMessage = 'API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
                } else if (axiosError.response?.status && axiosError.response.status >= 500) {
                    errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                } else if (axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ECONNREFUSED') {
                    errorMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
                }
            }
            
            setAnalysisError(errorMessage);
            setCurrentSection('error');
        }
    }, [userId]);

    const handleUploadAreaClick = useCallback(() => {
        if (currentSection !== 'upload' || hasAnalyzed) return;
        fileInputRef.current?.click();
    }, [currentSection, hasAnalyzed]);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && !hasAnalyzed) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setUploadedImageUrl(imageUrl);
                setUploadedFile(file);
                setIsImageUploaded(true);
            };
            reader.readAsDataURL(file);
        }
    }, [hasAnalyzed]);

    const handleStartAnalysis = useCallback(() => {
        if (uploadedFile && !hasAnalyzed) {
            setCurrentSection('analyzing');
        }
    }, [uploadedFile, hasAnalyzed]);
    
    const handleRestart = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setUploadedImageUrl(null);
        setUploadedFile(null);
        setResultData(null);
        setHasAnalyzed(false);
        setAnalysisError(null);
        setIsImageUploaded(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setCurrentSection('upload');
    }, []);

    useEffect(() => {
        let analysisTimer: ReturnType<typeof setTimeout>;
        let statusInterval: ReturnType<typeof setInterval>;
        let tipInterval: ReturnType<typeof setInterval>;

        if (currentSection === 'upload') {
            uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (currentSection === 'analyzing') {
            analyzingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const statuses = ["모공 패턴 분석 중...", "유분량 측정 중...", "수분 레벨 확인 중...", "피부톤 분석 중...", "트러블 요인 확인 중...", "결과를 종합하는 중..."];
            let statusIndex = 0;
            setAnalysisStatus(statuses[statusIndex]);

            statusInterval = setInterval(() => {
                statusIndex++;
                if (statusIndex < statuses.length) {
                    setAnalysisStatus(statuses[statusIndex]);
                }
            }, 1000);
             const showRandomTip = () => {
                const randomIndex = Math.floor(Math.random() * skinCareTips.length);
                setCurrentTip(skinCareTips[randomIndex]);
            };
             showRandomTip();
             tipInterval = setInterval(showRandomTip, 2500);

             analysisTimer = setTimeout(() => {
                if (uploadedFile && !hasAnalyzed) {
                    performSkinAnalysis(uploadedFile);
                }
            }, statuses.length * 1000);

            analysisTimer = setTimeout(() => {
                if (uploadedFile && !hasAnalyzed) {
                    performSkinAnalysis(uploadedFile);
                }
            }, statuses.length * 1000);

        } else if (currentSection === 'result') {
            resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (currentSection === 'error') {
            errorSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return () => {
            clearTimeout(analysisTimer);
            clearInterval(statusInterval);
            clearInterval(tipInterval);
        };
    }, [currentSection, uploadedFile, hasAnalyzed, performSkinAnalysis]);
    
    return (
        <PageWrapper>
            <GlobalStyle />
            <MainContainer>
                {currentSection === 'upload' && (
                    <UploadSection
                        uploadedImageUrl={uploadedImageUrl}
                        handleUploadAreaClick={handleUploadAreaClick}
                        handleFileUpload={handleFileUpload}
                        handleStartAnalysis={handleStartAnalysis}
                        isImageUploaded={isImageUploaded}
                        fileInputRef={fileInputRef}
                    />
                )}

                {currentSection === 'analyzing' && (
                    <AnalyzingSection
                        uploadedImageUrl={uploadedImageUrl}
                        analysisStatus={analysisStatus}
                        currentTip={currentTip}
                    />
                )}

                {currentSection === 'result' && resultData && (
                    <ResultSection
                        resultData={resultData}
                        handleRestart={handleRestart}
                    />
                )}

                {currentSection === 'error' && (
                    <ErrorSection
                        analysisError={analysisError}
                        handleRestart={handleRestart}
                    />
                )}
            </MainContainer>
        </PageWrapper>
    );
};

export default SkinAnalysis;
