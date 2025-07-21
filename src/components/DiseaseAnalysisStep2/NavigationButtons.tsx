import React from 'react';
import { ButtonContainer, ButtonGroup, PreviousButton, SkipButton, NextButton } from './SharedStyles';

interface NavigationButtonsProps {
  onPrevious: () => void;
  onSkip: () => void;
  onNext: () => void;
  isSubmitting: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onSkip,
  onNext,
  isSubmitting,
}) => {
  return (
    <ButtonContainer>
      <PreviousButton onClick={onPrevious}>이전 단계</PreviousButton>
      <ButtonGroup>
        <SkipButton onClick={onSkip} disabled={isSubmitting}>
          {isSubmitting ? '분석 중...' : '건너뛰기'}
        </SkipButton>
        <NextButton onClick={onNext} disabled={isSubmitting}>
          {isSubmitting ? '분석 중...' : '결과보기'}
        </NextButton>
      </ButtonGroup>
    </ButtonContainer>
  );
};

export default NavigationButtons;
