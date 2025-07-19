import React, { useState, useEffect } from 'react';

import { PageWrapper } from '../components/LoadingPage/SharedStyles';
import LoadingAnimation from '../components/LoadingPage/LoadingAnimation';
import AnalysisStatusDisplay from '../components/LoadingPage/AnalysisStatusDisplay';
import InfoTipCard from '../components/LoadingPage/InfoTipCard';
import CompletionDisplay from '../components/LoadingPage/CompletionDisplay';

// --- 타입 정의 ---
interface SkinInfoItem {
  title: string;
  description: string;
}

// --- 데이터 상수 ---
const analysisStatuses: string[] = ["모공 패턴 분석 중...", "유분량 측정 중...", "수분 레벨 확인 중...", "피부톤 분석 중...", "트러블 요인 확인 중...", "결과를 종합하는 중..."];

const skinInfoTips: SkinInfoItem[] = [
    { title: "여드름(Acne)", description: "모낭과 피지선에 발생하는 만성 염증성 질환입니다. 주로 사춘기에 시작되며, 올바른 압출과 관리가 중요합니다." },
    { title: "아토피 피부염(Atopic Dermatitis)", description: "심한 가려움증과 피부 건조증을 동반하는 만성 재발성 피부염입니다. 보습과 환경 관리가 매우 중요합니다." },
    { title: "주사(Rosacea)", description: "얼굴 중앙 부위가 붉어지고 혈관이 확장되는 만성 염증성 피부 질환입니다. 자극적인 음식과 자외선을 피하는 것이 좋습니다." },
    { title: "건선(Psoriasis)", description: "은백색의 각질로 덮인 붉은 반점이 특징인 만성 피부 질환입니다. 스트레스 관리가 증상 완화에 도움이 될 수 있습니다." },
    { title: "지루성 피부염(Seborrheic Dermatitis)", description: "피지 분비가 왕성한 부위에 발생하는 만성적인 습진입니다. 두피, 얼굴, 가슴 등에 주로 나타납니다." }
];

const LoadingPage: React.FC = () => {
  const [statusIndex, setStatusIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);

  useEffect(() => {
    if (isComplete) return;

    const analysisTimer = setInterval(() => {
      setStatusIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= analysisStatuses.length) {
          clearInterval(analysisTimer);
          setIsComplete(true);
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

  const handleResultClick = () => {
    alert("결과 페이지로 이동합니다.");
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
