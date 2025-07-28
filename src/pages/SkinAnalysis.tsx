import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/clerk-react'; // 🔑 Clerk 훅으로 유저 정보 가져오기
import { analyzeSkinType } from '../services/skintypeApi';
import { AxiosError } from 'axios';

import { PageWrapper, GlobalStyle, MainContainer } from '../components/SkinAnalysis/SharedStyles';
import UploadSection from '../components/SkinAnalysis/UploadSection';
import AnalyzingSection from '../components/SkinAnalysis/AnalyzingSection';
import ResultSection from '../components/SkinAnalysis/ResultSection';
import ErrorSection from '../components/SkinAnalysis/ErrorSection';
import { skinCareTips, convertApiResponseToSkinResult, type SkinResult } from '../utils/skinAnalysis';

// [추가] Chart.js, react-chartjs-2 Radar 차트 관련 import
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// [추가] 레이더 차트 컴포넌트 정의
const SkinRadarChart = ({ scoreInfo }: { scoreInfo: any }) => {
  if (!scoreInfo) return null;
  const labels = [
    '다크서클',
    '피부타입',
    '주름',
    '유분',
    '모공',
    '블랙헤드',
    '여드름',
    '민감도',
    '멜라닌',
    '수분',
    '거침',
    '종합점수',
  ];
  const data = {
    labels,
    datasets: [
      {
        label: '피부 점수',
        data: [
          scoreInfo.dark_circle_score,
          scoreInfo.skin_type_score,
          scoreInfo.wrinkle_score,
          scoreInfo.oily_intensity_score,
          scoreInfo.pores_score,
          scoreInfo.blackhead_score,
          scoreInfo.acne_score,
          scoreInfo.sensitivity_score,
          scoreInfo.melanin_score,
          scoreInfo.water_score,
          scoreInfo.rough_score,
          scoreInfo.total_score,
        ],
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 202, 236, 1)',
      },
    ],
  };
  const options = {
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { stepSize: 20 },
      },
    },
  };
  return (
    <div style={{ maxWidth: 500, margin: '2rem auto' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>피부 항목별 점수 레이더 차트</h3>
      <Radar data={data} options={options} />
    </div>
  );
};

const SkinAnalysis: React.FC = () => {
    // 🔑 현재 로그인한 유저 정보 가져오기
    const { user } = useUser();
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

        // Clerk에서 제공하는 유저 ID(문자열) — 로그인되지 않았으면 빈 문자열
    const userId = user?.id ?? '';

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
                    <>
                        <ResultSection
                            resultData={resultData}
                            handleRestart={handleRestart}
                        />
                    </>
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

// [참고] chart.js, react-chartjs-2가 설치되어 있지 않다면 아래 명령어로 설치하세요.
// npm install chart.js react-chartjs-2
