import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCameraRetro, faUser, faLightbulb, faTintSlash, faCloudUploadAlt, faBrain } from '@fortawesome/free-solid-svg-icons';
import {
  PageSection,
  MainTitle,
  MainSubtitle,
  ContentBox,
  Guidelines,
  GuidelineItem,
  UploadArea,
  UploadAreaContent,
  PreviewImage,
  AnalysisStartButton,
} from './SharedStyles';

interface UploadSectionProps {
  uploadedImageUrl: string | null;
  handleUploadAreaClick: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleStartAnalysis: () => void;
  isImageUploaded: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

const UploadSection: React.FC<UploadSectionProps> = ({
  uploadedImageUrl,
  handleUploadAreaClick,
  handleFileUpload,
  handleStartAnalysis,
  isImageUploaded,
  fileInputRef,
}) => {
  return (
    <PageSection $isFadedIn={true}>
      <MainTitle>나의 피부 유형 바로 알기</MainTitle>
      <MainSubtitle>AI가 당신의 피부 타입을 분석하고, 유형별 특징과 통계를 제공합니다.</MainSubtitle>
      <ContentBox>
        <Guidelines>
          <h3><FontAwesomeIcon icon={faCameraRetro} /> 촬영 가이드</h3>
          <GuidelineItem><FontAwesomeIcon icon={faUser} /> 정면을 응시하고, 머리카락이 얼굴을 가리지 않게 하세요.</GuidelineItem>
          <GuidelineItem><FontAwesomeIcon icon={faLightbulb} /> 그림자 없는 밝은 조명 아래에서 선명하게 촬영하세요.</GuidelineItem>
          <GuidelineItem><FontAwesomeIcon icon={faTintSlash} /> 화장기 없는 맨 얼굴에서 가장 정확한 분석이 가능합니다.</GuidelineItem>
        </Guidelines>
        <UploadArea onClick={handleUploadAreaClick}>
          {!uploadedImageUrl && (
            <UploadAreaContent>
              <FontAwesomeIcon icon={faCloudUploadAlt} />
              <p>클릭하여 사진 업로드</p>
            </UploadAreaContent>
          )}
          {uploadedImageUrl && <PreviewImage src={uploadedImageUrl} alt="업로드 이미지 미리보기" />}
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" />
        </UploadArea>
      </ContentBox>

      {isImageUploaded && (
        <AnalysisStartButton onClick={handleStartAnalysis}>
          <FontAwesomeIcon icon={faBrain} />
          AI 피부 분석 시작하기
        </AnalysisStartButton>
      )}
    </PageSection>
  );
};

export default UploadSection;
