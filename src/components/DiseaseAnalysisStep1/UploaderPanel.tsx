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
    // 미리보기가 존재하면 클릭 시 다음 이미지로 순환, 없으면 파일 선택창 열기
    if (imagePreviews.length > 0) {
      setCurrentImageIndex(prev => (prev + 1) % imagePreviews.length);
    } else {
      fileInputRef.current?.click();
    }
  };

  const MAX_IMAGES = 5;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || fileList.length === 0) return;

    // FileList → Array 변환 후 중복 제거 (파일 이름 기준)
    const newFiles = Array.from(fileList).filter(
      f => !selectedFiles.some(prev => prev.name === f.name)
    );

    // 업로드 제한 수 초과 시 경고
    if (selectedFiles.length + newFiles.length > MAX_IMAGES) {
      alert(`최대 ${MAX_IMAGES}장까지 업로드할 수 있습니다.`);
      event.target.value = '';
      return;
    }

    const updatedFiles = [...selectedFiles, ...newFiles];
    setSelectedFiles(updatedFiles);

    // 미리보기 생성
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.onerror = () => {
        console.error('파일을 읽는 중 오류 발생');
      };
      reader.readAsDataURL(file);
    });

    // 같은 파일을 다시 선택할 수 있도록 input 초기화
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



            {/* 현재 이미지 인덱스 / 총 이미지 수 표시 */}
            <span style={{position:'absolute',bottom:'8px',right:'8px',color:'#fff',fontSize:'0.9rem'}}>
              {currentImageIndex + 1} / {imagePreviews.length}
            </span>

            {(imagePreviews.length === 0 || imagePreviews.length < MAX_IMAGES) && (
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
          multiple
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
