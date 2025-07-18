import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import {
  PageSection,
  ResultHeader,
  MainTitle,
  MainSubtitle,
  ResultCard,
  ResultDescription,
  RestartButton,
} from './SharedStyles';

interface ErrorSectionProps {
  analysisError: string | null;
  handleRestart: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ErrorSection: React.FC<ErrorSectionProps> = ({
  analysisError,
  handleRestart,
}) => {
  return (
    <PageSection $isFadedIn={true}>
      <ResultHeader>
        <MainTitle style={{ color: '#ff4757' }}>분석 중 오류가 발생했습니다</MainTitle>
        <MainSubtitle> 조건에 맞는 사진을 확인하고 다시 시도해주세요.</MainSubtitle>
      </ResultHeader>

      <ResultCard>
        <ResultDescription style={{ color: '#ff4757', textAlign: 'center' }}>
          <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }} />
          {analysisError || '분석 중 알 수 없는 오류가 발생했습니다.'}
        </ResultDescription>
      </ResultCard>

      <RestartButton href="#upload" onClick={handleRestart}>
        <i className="fas fa-redo" /> 처음부터 다시 진단하기
      </RestartButton>
    </PageSection>
  );
};

export default ErrorSection;
