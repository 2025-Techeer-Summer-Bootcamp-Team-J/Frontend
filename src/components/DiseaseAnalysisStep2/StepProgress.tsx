import React from 'react';
import { StepProgressContainer, StepIndicator, StepLine } from './SharedStyles';

interface StepProgressProps {
  currentStep: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep }) => {
  return (
    <StepProgressContainer>
      <StepIndicator $completed={currentStep > 1}>1</StepIndicator>
      <StepLine />
      <StepIndicator $active={currentStep === 2} $completed={currentStep > 2}>2</StepIndicator>
      <StepLine />
      <StepIndicator $active={currentStep === 3}>3</StepIndicator>
    </StepProgressContainer>
  );
};

export default StepProgress;
