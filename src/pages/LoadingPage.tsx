import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { PageWrapper } from '../components/LoadingPage/SharedStyles';
import LoadingAnimation from '../components/LoadingPage/LoadingAnimation';
import AnalysisStatusDisplay from '../components/LoadingPage/AnalysisStatusDisplay';
import InfoTipCard from '../components/LoadingPage/InfoTipCard';
import CompletionDisplay from '../components/LoadingPage/CompletionDisplay';
import { api } from '../services';

// --- 타입 정의 ---
interface SkinInfoItem {
  title: string;
  description: string;
}

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

interface LocationState {
  uploadedFiles: File[];
  analysisResults: AnalysisResult[];
  selectedResult: AnalysisResult;
  additionalInfo?: {
    symptoms: string[];
    itchLevel: number;
    duration: string;
    additionalInfo: string;
  };
}

// --- 데이터 상수 ---
const analysisStatuses: string[] = ["모공 패턴 분석 중...", "유분량 측정 중...", "수분 레벨 확인 중...", "피부톤 분석 중...", "트러블 요인 확인 중...", "결과를 종합하는 중..."];

const skinInfoTips: SkinInfoItem[] = [
    { title: "여드름(Acne)", description: "모공과 피지선에 발생하는 만성 염증성 질환입니다. 주로 사춘기에 시작되며, 올바른 압출과 관리가 중요합니다." },
    { title: "아토피 피부염(Atopic Dermatitis)", description: "심한 가려움증과 피부 건조증을 동반하는 만성 재발성 피부염입니다. 보습과 환경 관리가 매우 중요합니다." },
    { title: "주사(Rosacea)", description: "얼굴 중앙 부위가 붉어지고 혈관이 확장되는 만성 염증성 피부 질환입니다. 자극적인 음식과 자외선을 피하는 것이 좋습니다." },
    { title: "건선(Psoriasis)", description: "은백색의 각질로 덮인 붉은 반점이 특징인 만성 피부 질환입니다. 스트레스 관리가 증상 완화에 도움이 될 수 있습니다." },
    { title: "지루성 피부염(Seborrheic Dermatitis)", description: "피지 분비가 왕성한 부위에 발생하는 만성적인 습진입니다. 두피, 얼굴, 가슴 등에 주로 나타납니다." }
];

const LoadingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [statusIndex, setStatusIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [sseStarted, setSseStarted] = useState(false);

  // Step2에서 전달받은 데이터
  const locationState = location.state as LocationState | null;
  const { uploadedFiles, analysisResults, selectedResult, additionalInfo } = locationState || { 
    uploadedFiles: [], 
    analysisResults: [], 
    selectedResult: null, 
    additionalInfo: undefined 
  };

  // 유효하지 않은 상태일 때 Step1으로 리다이렉트
  useEffect(() => {
    if (!locationState || !selectedResult || !selectedResult.taskId) {
      console.log('❌ LoadingPage: 유효하지 않은 상태 - Step1으로 이동');
      console.log('locationState:', !!locationState);
      console.log('selectedResult:', selectedResult);
      console.log('taskId:', selectedResult?.taskId);
      navigate('/disease-analysis-step1', { replace: true });
      return;
    }
    
    console.log('✅ LoadingPage: 유효한 상태 - taskId:', selectedResult.taskId);
  }, [locationState, selectedResult, navigate]);

  useEffect(() => {
    if (isComplete) return;

    const analysisTimer = setInterval(() => {
      setStatusIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= analysisStatuses.length) {
          clearInterval(analysisTimer);
          setIsComplete(true);
          // 분석 완료 후 SSE 스트리밍 시작
          startSSEStreaming();
          return prev;
        }
        return nextIndex;
      });
    }, 2000);

    const initialTipTimeout = setTimeout(() => setIsInfoVisible(true), 1000);
    const tipTimer = setInterval(() => {
      setIsInfoVisible(false);
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % skinInfoTips.length);
        setIsInfoVisible(true);
      }, 500);
    }, 4000);

    return () => {
      clearInterval(analysisTimer);
      clearInterval(tipTimer);
      clearTimeout(initialTipTimeout);
    };
  }, [isComplete]);

  const startSSEStreaming = () => {
    if (sseStarted || !selectedResult || !selectedResult.taskId) return;
    
    setSseStarted(true);
    console.log('🚀 분석 완료 확인 시작 - taskId:', selectedResult.taskId);
    
    // 실제 task 상태를 폴링
    const pollTaskStatus = async () => {
      try {
        const taskStatus = await api.diagnoses.getTaskStatus(selectedResult.taskId!);
        console.log('📊 Task 상태:', taskStatus);
        
        // task가 완료되었고 결과가 있는 경우
        if (taskStatus.state === 'SUCCESS' && taskStatus.result) {
          console.log('✅ 분석 완료 - Step3로 이동');
          
          navigate('/disease-analysis-step3', {
            state: {
              uploadedFiles: uploadedFiles,
              analysisResults: analysisResults,
              selectedResult: {
                ...selectedResult,
                result: taskStatus.result
              },
              additionalInfo: additionalInfo
            }
          });
          return;
        }
        
        // task가 실패한 경우
        if (taskStatus.state === 'FAILURE') {
          console.error('❌ 분석 실패:', taskStatus.error);
          alert('이미지 분석에 실패했습니다.\n\n다시 시도해주세요.');
          navigate('/disease-analysis-step1');
          return;
        }
        
        // 아직 진행 중인 경우 2초 후 다시 확인
        if (taskStatus.state === 'PENDING' || taskStatus.state === 'PROGRESS') {
          console.log('⏳ 분석 진행 중..., 2초 후 재확인');
          setTimeout(pollTaskStatus, 2000);
        }
        
      } catch (error) {
        console.error('❌ Task 상태 확인 실패:', error);
        // 네트워크 오류 등의 경우 2초 후 재시도
        setTimeout(pollTaskStatus, 2000);
      }
    };
    
    // 폴링 시작
    pollTaskStatus();
  };

  const handleResultClick = () => {
    if (uploadedFiles.length > 0 && analysisResults.length > 0) {
      startSSEStreaming();
    } else {
      navigate('/disease-analysis-step1');
    }
  };

  const currentTip = skinInfoTips[tipIndex];
  const currentStatusText = isComplete ? "분석이 완료되었습니다!" : (analysisStatuses[statusIndex] || "초기화 중...");

  return (
    <PageWrapper>
      <LoadingAnimation />
      
      {!isComplete ? (
        <>
          <AnalysisStatusDisplay currentStatusText={currentStatusText} />
          <InfoTipCard
            title={currentTip.title}
            description={currentTip.description}
            isVisible={isInfoVisible}
          />
        </>
      ) : (
        <CompletionDisplay onResultClick={handleResultClick} />
      )}
    </PageWrapper>
  );
};

export default LoadingPage;
