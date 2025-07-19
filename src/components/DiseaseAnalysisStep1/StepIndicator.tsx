import React from 'react';
import { StepIndicatorContainer, StepCircle, StepLine } from './SharedStyles';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <StepIndicatorContainer>
      <StepCircle $active={currentStep === 1}>1</StepCircle>
      <StepLine />
      <StepCircle $active={currentStep === 2}>2</StepCircle>
      <StepLine />
      <StepCircle $active={currentStep === 3}>3</StepCircle>
    </StepIndicatorContainer>
  );
};

export default StepIndicator;
