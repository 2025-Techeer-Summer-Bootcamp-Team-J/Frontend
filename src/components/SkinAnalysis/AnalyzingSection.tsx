import React from 'react';
import {
  PageSection,
  ScannerAnimation,
  ScannerLine,
  AnalyzingText,
  AnalyzingStatus,
  TipBox,
} from './SharedStyles';

interface AnalyzingSectionProps {
  uploadedImageUrl: string | null;
  analysisStatus: string;
  currentTip: string;
}

const AnalyzingSection: React.FC<AnalyzingSectionProps> = ({
  uploadedImageUrl,
  analysisStatus,
  currentTip,
}) => {
  return (
    <PageSection $isFadedIn={true}>
      <ScannerAnimation $imageUrl={uploadedImageUrl || undefined}>
        <ScannerLine />
      </ScannerAnimation>
      <AnalyzingText>AI가 피부를 분석하고 있습니다.</AnalyzingText>
      <AnalyzingStatus>{analysisStatus}</AnalyzingStatus>
      {currentTip && (
        <TipBox key={currentTip}>
          <p><strong>알고 계셨나요?</strong> {currentTip}</p>
        </TipBox>
      )}
    </PageSection>
  );
};

export default AnalyzingSection;
