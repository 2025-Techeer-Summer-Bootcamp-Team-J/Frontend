import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import { StatusText, ResultButton } from './SharedStyles';

interface CompletionDisplayProps {
  onResultClick: () => void;
}

const CompletionDisplay: React.FC<CompletionDisplayProps> = ({
  onResultClick,
}) => {
  return (
    <>
      <StatusText $isComplete={true}>분석이 완료되었습니다!</StatusText>
      <ResultButton onClick={onResultClick}>
        <FontAwesomeIcon icon={faPoll} />
        결과 확인하기
      </ResultButton>
    </>
  );
};

export default CompletionDisplay;
