import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLightbulb, faPoll } from '@fortawesome/free-solid-svg-icons';

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

// --- 애니메이션 Keyframes ---
const pulseAnimation = keyframes`
    0% { transform: scale(0.8); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
`;
const scanAnimation = keyframes`
    0% { top: -50%; }
    100% { top: 100%; }
`;
const buttonAppearAnimation = keyframes`
    to { opacity: 1; transform: translateY(0); }
`;

// --- 스타일드 컴포넌트 ---
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.25rem;
  text-align: center;
`;

const ScannerContainer = styled.div`
  position: relative;
  width: 11.25rem; /* 180px */
  height: 11.25rem; /* 180px */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ScannerPulse = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 0.125rem solid rgba(0, 82, 255, 0.3);
  border-radius: 50%;
  animation: ${pulseAnimation} 2s ease-out infinite;
  opacity: 0;
  &:nth-child(2) { animation-delay: 1s; }
`;

const ScannerAnimation = styled.div`
  width: 9.375rem; /* 150px */
  height: 9.375rem; /* 150px */
  position: relative;
  border-radius: 50%;
  border: 0.1875rem solid var(--card-bg-color);
  background-color: var(--light-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0.3125rem 1.5625rem rgba(0, 82, 255, 0.15);

  .scanner-icon {
    font-size: 5rem; /* 80px */
    color: var(--primary-color);
    opacity: 0.6;
  }
`;

const ScannerLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(0, 82, 255, 0.4), transparent);
  animation: ${scanAnimation} 3s ease-in-out infinite;
`;

const MainHeading = styled.h2`
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 700;
  color: #1a1a1a;
  margin: 3.75rem 0 0 0; /* 60px */
`;

const StatusText = styled.p<{ $isComplete: boolean }>`
  font-size: ${({ $isComplete }) => $isComplete ? 'clamp(1.2rem, 4vw, 1.5rem)' : 'clamp(0.9rem, 2.5vw, 1rem)'};
  font-weight: ${({ $isComplete }) => ($isComplete ? '700' : '400')};
  color: ${({ $isComplete }) => ($isComplete ? '#1a1a1a' : 'var(--light-text-color)')};
  margin: ${({ $isComplete }) => ($isComplete ? '3rem 0 1.875rem 0' : '0.625rem 0 0 0')};
  min-height: 1.5rem; /* 24px */
  transition: all 0.3s ease-in-out;
`;

const InfoCard = styled.div<{ $isVisible: boolean }>`
  margin-top: 1.875rem; /* 30px */
  padding: 1.25rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(0.3125rem);
  border-radius: 0.9375rem; /* 15px */
  width: 100%;
  max-width: 25rem; /* 400px */
  box-shadow: 0 0.25rem 0.9375rem rgba(0, 82, 255, 0.05);
  text-align: left;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) => ($isVisible ? 'translateY(0)' : 'translateY(0.625rem)')};
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
`;

const InfoTitle = styled.h4`
  margin: 0 0 0.625rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  svg { margin-right: 0.5rem; }
`;

const InfoDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--light-text-color);
`;

const ResultButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.875rem; /* 12px 30px */
  font-size: 1rem;
  font-weight: 700;
  color:rgb(0, 110, 255);
  background-color: var(--primary-color);
  border: none;
  border-radius: 0.5rem; /* 8px */
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 70;
  transform: translateY(0.625rem);
  animation: ${buttonAppearAnimation} 0.5s forwards;

  &:hover {
    background-color: var(--dark-primary-color);
    transform: translateY(-0.125rem);
    box-shadow: 0 0.375rem 1.25rem rgba(0, 82, 255, 0.25);
  }
`;

// --- React 컴포넌트 ---
const LoadingPage: React.FC = () => { // 컴포넌트 이름 변경: AnalysisPage -> LoadingPage
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
      <ScannerContainer>
        <ScannerPulse />
        <ScannerPulse />
        <ScannerAnimation>
          <FontAwesomeIcon icon={faUser} className="scanner-icon" />
          <ScannerLine />
        </ScannerAnimation>
      </ScannerContainer>
      
      {!isComplete ? (
        <>
          <MainHeading>AI가 피부를 분석하고 있습니다.</MainHeading>
          <StatusText $isComplete={false}>{currentStatusText}</StatusText>
          <InfoCard $isVisible={isInfoVisible}>
            <InfoTitle>
              <FontAwesomeIcon icon={faLightbulb} />
              {currentTip.title}
            </InfoTitle>
            <InfoDescription>{currentTip.description}</InfoDescription>
          </InfoCard>
        </>
      ) : (
        <>
          <StatusText $isComplete={true}>{currentStatusText}</StatusText>
          <ResultButton onClick={handleResultClick}>
            <FontAwesomeIcon icon={faPoll} />
            결과 확인하기
          </ResultButton>
        </>
      )}
    </PageWrapper>
  );
};

export default LoadingPage; // export 이름 변경