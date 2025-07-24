import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  UploaderPanel as StyledUploaderPanel,
  UploadWrapper,
  ImagePreview,
  UploadPrompt,
  PromptText,
  HiddenFileInput,
  NextButton,


  AddImageButton,
  RemoveImageButton,
} from './SharedStyles';

interface UploaderPanelProps {
  onNext: (files: File[]) => void;
  isAnalyzing?: boolean;
}

const UploaderPanel: React.FC<UploaderPanelProps> = ({ onNext, isAnalyzing = false }) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadWrapperClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 첫 번째 파일만 허용하여 선택된 파일을 교체합니다.
    const file = files[0];
    setSelectedFiles([file]);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviews([reader.result as string]);
    };
    reader.onerror = () => {
      console.error("Error reading file");
      alert("파일을 읽는 중 오류가 발생했습니다.");
    };
    reader.readAsDataURL(file);

    // 같은 파일을 다시 선택할 수 있도록 input을 초기화합니다.
    event.target.value = '';
  };

  const handleNextButtonClick = () => {
    onNext(selectedFiles);
  };

  

  const removeImage = (e: React.MouseEvent, indexToRemove: number) => {
    e.stopPropagation();

    const newImagePreviews = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );
    const newSelectedFiles = selectedFiles.filter(
      (_, index) => index !== indexToRemove
    );

    setImagePreviews(newImagePreviews);
    setSelectedFiles(newSelectedFiles);

    if (currentImageIndex >= newImagePreviews.length) {
      setCurrentImageIndex(Math.max(0, newImagePreviews.length - 1));
    }
  };

  return (
    <StyledUploaderPanel>
      <UploadWrapper onClick={handleUploadWrapperClick}>
        {imagePreviews.length > 0 ? (
          <>
            <ImagePreview
              src={imagePreviews[currentImageIndex]}
              alt={`Uploaded skin ${currentImageIndex + 1}`}
            />



            {/* 이미지가 1장뿐이므로 현재/총 이미지 표시는 생략 */}

            {imagePreviews.length === 0 && (
              <AddImageButton
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  handleUploadWrapperClick();
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </AddImageButton>
            )}

            <RemoveImageButton
              onClick={(e: React.MouseEvent) => removeImage(e, currentImageIndex)}
            >
              <FontAwesomeIcon icon={faTimes} />
            </RemoveImageButton>
          </>
        ) : (
          <UploadPrompt>
            <FontAwesomeIcon icon={faCamera} size="3x" />
            <PromptText>여기를 클릭하여 사진을 업로드하세요</PromptText>
          </UploadPrompt>
        )}
        <HiddenFileInput
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </UploadWrapper>
      <NextButton onClick={handleNextButtonClick} disabled={imagePreviews.length === 0 || isAnalyzing}>
        {isAnalyzing ? '분석 중...' : '다음 단계'}
      </NextButton>
    </StyledUploaderPanel>
  );
};

export default UploaderPanel;
