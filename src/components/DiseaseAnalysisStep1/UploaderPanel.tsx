import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faChevronLeft, faChevronRight, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  UploaderPanel as StyledUploaderPanel,
  UploadWrapper,
  ImagePreview,
  UploadPrompt,
  PromptText,
  HiddenFileInput,
  NextButton,
  PrevButton,
  NextImageButton,
  ImageCounter,
  AddImageButton,
  RemoveImageButton,
} from './SharedStyles';

interface UploaderPanelProps {
  onNext: (files: File[]) => void;
}

const UploaderPanel: React.FC<UploaderPanelProps> = ({ onNext }) => {
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

    const newFiles = Array.from(files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);

    const newPreviewsPromises = newFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newPreviewsPromises)
      .then((newPreviews) => {
        setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      })
      .catch((error) => {
        console.error("Error reading files:", error);
        alert("파일을 읽는 중 오류가 발생했습니다.");
      });

    event.target.value = '';
  };

  const handleNextButtonClick = () => {
    onNext(selectedFiles);
  };

  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      Math.min(imagePreviews.length - 1, prevIndex + 1)
    );
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

            <PrevButton onClick={goToPreviousImage} disabled={currentImageIndex === 0}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </PrevButton>
            <NextImageButton
              onClick={goToNextImage}
              disabled={currentImageIndex >= imagePreviews.length - 1}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </NextImageButton>

            <ImageCounter>
              {currentImageIndex + 1} / {imagePreviews.length}
            </ImageCounter>

            <AddImageButton
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                handleUploadWrapperClick();
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </AddImageButton>

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
          multiple
        />
      </UploadWrapper>
      <NextButton onClick={handleNextButtonClick} disabled={imagePreviews.length === 0}>
        다음 단계로
      </NextButton>
    </StyledUploaderPanel>
  );
};

export default UploaderPanel;
