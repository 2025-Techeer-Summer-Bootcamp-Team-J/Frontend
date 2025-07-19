import React from 'react';
import { StepContainer, StepItem, StepLine } from './SharedStyles';

const StepIndicator: React.FC = () => {
  return (
    <StepContainer>
      <StepItem $status="completed">1</StepItem>
      <StepLine />
      <StepItem $status="completed">2</StepItem>
      <StepLine />
      <StepItem $status="active">3</StepItem>
    </StepContainer>
  );
};

export default StepIndicator;
