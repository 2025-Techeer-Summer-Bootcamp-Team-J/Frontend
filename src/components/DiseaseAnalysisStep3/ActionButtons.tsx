import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faDownload, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
`;

const StyledButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
  position: relative;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background-color: #2563eb;
          color: white;
          &:hover:not(:disabled) { background-color: #1d4ed8; }
        `;
      case 'secondary':
        return `
          background-color: #6b7280;
          color: white;
          &:hover:not(:disabled) { background-color: #4b5563; }
        `;
      case 'success':
        return `
          background-color: #10b981;
          color: white;
          &:hover:not(:disabled) { background-color: #059669; }
        `;
      case 'warning':
        return `
          background-color: #f59e0b;
          color: white;
          &:hover:not(:disabled) { background-color: #d97706; }
        `;
      default:
        return `
          background-color: #f3f4f6;
          color: #374151;
          &:hover:not(:disabled) { background-color: #e5e7eb; }
        `;
    }
  }}
`;

const LoadingSpinner = styled(FontAwesomeIcon)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

interface ActionButtonsProps {
  isComplete: boolean;
  isSaved: boolean;
  isSaving: boolean;
  isDownloading: boolean;
  onSaveResult: () => void;
  onDownloadReport: () => void;
  onRestartAnalysis: () => void;
  showSaveButton?: boolean;
  saveButtonText?: string;
  downloadButtonText?: string;
  restartButtonText?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isComplete,
  isSaved,
  isSaving,
  isDownloading,
  onSaveResult,
  onDownloadReport,
  onRestartAnalysis,
  showSaveButton = true,
  saveButtonText = "진단 결과 저장",
  downloadButtonText = "결과 리포트 다운로드",
  restartButtonText = "다시 분석하기",
}) => {
  return (
    <ButtonGroup>
      {/* 저장 버튼 - 분석 완료되고 아직 저장하지 않은 경우에만 표시 */}
      {isComplete && !isSaved && showSaveButton && (
        <StyledButton 
          $variant="success" 
          onClick={onSaveResult}
          disabled={isSaving}
        >
          {isSaving ? (
            <LoadingSpinner icon={faSpinner} />
          ) : (
            <FontAwesomeIcon icon={faSave} />
          )}
          {isSaving ? '저장 중...' : saveButtonText}
        </StyledButton>
      )}

      {/* 다운로드 버튼 - 저장이 완료된 경우에만 표시 */}
      {isSaved && (
        <StyledButton 
          $variant="secondary" 
          onClick={onDownloadReport}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <LoadingSpinner icon={faSpinner} />
          ) : (
            <FontAwesomeIcon icon={faDownload} />
          )}
          {isDownloading ? '다운로드 중...' : downloadButtonText}
        </StyledButton>
      )}

      {/* 다시 분석하기 버튼 - 항상 표시 */}
      <StyledButton onClick={onRestartAnalysis}>
        <FontAwesomeIcon icon={faRedo} />
        {restartButtonText}
      </StyledButton>

      {/* 완료되지 않은 경우 메시지 */}
      {!isComplete && (
        <StyledButton $variant="warning" disabled>
          <LoadingSpinner icon={faSpinner} />
          분석 진행 중...
        </StyledButton>
      )}
    </ButtonGroup>
  );
};

export default ActionButtons; 