import React from 'react';
import { MainHeading, StatusText } from './SharedStyles';

interface AnalysisStatusDisplayProps {
  currentStatusText: string;
}

const AnalysisStatusDisplay: React.FC<AnalysisStatusDisplayProps> = ({
  currentStatusText,
}) => {
  return (
    <>
      <MainHeading>AI가 피부를 분석하고 있습니다.</MainHeading>
      <StatusText $isComplete={false}>{currentStatusText}</StatusText>
    </>
  );
};

export default AnalysisStatusDisplay;
