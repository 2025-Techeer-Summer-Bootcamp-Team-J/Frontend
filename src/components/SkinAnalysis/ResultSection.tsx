import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faHandHoldingHeart, faRedo } from '@fortawesome/free-solid-svg-icons';
import {
  PageSection,
  ResultHeader,
  MainTitle,
  MainSubtitle,
  ResultCard,
  ResultTitle,
  ResultSubtitle,
  ResultDescription,
  ResultGrid,
  ResultSectionTitle,
  ResultList,
  RestartButton,
} from './SharedStyles';

interface SkinResult {
  title: string;
  subtitle: string;
  description: string;
  features: string[];
  care: string[];
}

interface ResultSectionProps {
  resultData: SkinResult;
  handleRestart: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ResultSection: React.FC<ResultSectionProps> = ({
  resultData,
  handleRestart,
}) => {
  return (
    <PageSection $isFadedIn={true}>
      <ResultHeader>
        <MainTitle>AI 피부 진단 결과</MainTitle>
        <MainSubtitle>당신의 피부 타입과 맞춤 관리법을 확인해보세요.</MainSubtitle>
      </ResultHeader>

      <ResultCard>
        <ResultTitle>{resultData.title}</ResultTitle>
        <ResultSubtitle>{resultData.subtitle}</ResultSubtitle>
        <ResultDescription>{resultData.description}</ResultDescription>
      </ResultCard>

      <ResultGrid>
        <ResultCard>
          <ResultSectionTitle><FontAwesomeIcon icon={faListCheck} /> 주요 특징</ResultSectionTitle>
          <ResultList>
            {resultData.features.map((item, index) => <li key={index}>{item}</li>)}
          </ResultList>
        </ResultCard>
        <ResultCard>
          <ResultSectionTitle><FontAwesomeIcon icon={faHandHoldingHeart} /> 추천 관리법</ResultSectionTitle>
          <ResultList>
            {resultData.care.map((item, index) => <li key={index}>{item}</li>)}
          </ResultList>
        </ResultCard>
      </ResultGrid>

      <RestartButton href="#upload" onClick={handleRestart}>
        <FontAwesomeIcon icon={faRedo} /> 처음부터 다시 진단하기
      </RestartButton>
    </PageSection>
  );
};

export default ResultSection;
