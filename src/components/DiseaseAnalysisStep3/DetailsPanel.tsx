import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faDownload, faSave } from '@fortawesome/free-solid-svg-icons';
import { FaCommentMedical } from 'react-icons/fa';
import styled from 'styled-components';
import {
  DetailsPanelContainer,
  DetailsBox,
  TabNav,
  TabButton,
  TabContentContainer,
  TabContent,
  ButtonGroup,
  StyledButton,
  SectionTitle,
} from './SharedStyles';

// 새로운 스타일 컴포넌트들
const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: #374151;
  }

  .value {
    color: #1f2937;
    font-weight: 500;
  }

  .disease-name {
    color: #2563eb;
    font-weight: 700;
  }
`;

const SeverityBar = styled.div`
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  width: 200px;
`;

const SeverityBarInner = styled.div<{ $severity: number }>`
  height: 100%;
  background: ${props => 
    props.$severity >= 70 ? '#ef4444' : 
    props.$severity >= 40 ? '#f97316' : '#10b981'
  };
  width: ${props => props.$severity}%;
  transition: width 0.3s ease;
`;

const AIOpinionBox = styled.div`
  background: #f0f9ff;
  border-left: 4px solid #2563eb;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0 0.5rem 0.5rem 0;

  h4 {
    color: #1e40af;
    font-weight: 600;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
  }

  p {
    color: #1e40af;
    margin: 0;
  }
`;

const StreamingTabContent = styled(TabContent)`
  .cursor {
    animation: blink 1s infinite;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #1f2937;
  }

  ul {
    margin: 1rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }
`;

interface DiseaseInfo {
  disease_name: string;
  confidence: number;
}

interface StreamingContent {
  summary: string;
  description: string;
  precautions: string;
  management: string;
}

interface AdditionalInfo {
  symptoms: string[];
  itchLevel: number;
  duration: string;
  additionalInfo: string;
}

interface DetailsPanelProps {
  diseaseInfo: DiseaseInfo;
  streamingContent: StreamingContent;
  additionalInfo?: AdditionalInfo;
  activeTab: string;
  isStreaming: boolean;
  isComplete: boolean;
  isSaved: boolean;
  onTabChange: (tab: string) => void;
  onSaveResult: () => void;
  onDownloadReport: () => void;
  onRestartAnalysis: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({
  diseaseInfo,
  streamingContent,
  additionalInfo,
  activeTab,
  isStreaming,
  isComplete,
  isSaved,
  onTabChange,
  onSaveResult,
  onDownloadReport,
  onRestartAnalysis,
}) => {
  return (
    <DetailsPanelContainer>
      <SectionTitle>AI 진단 결과</SectionTitle>
      
      <DetailsBox>
        <TabNav>
          <TabButton $isActive={activeTab === 'summary'} onClick={() => onTabChange('summary')}>
            요약
          </TabButton>
          <TabButton $isActive={activeTab === 'description'} onClick={() => onTabChange('description')}>
            상세 설명
          </TabButton>
          <TabButton $isActive={activeTab === 'precautions'} onClick={() => onTabChange('precautions')}>
            주의사항
          </TabButton>
          <TabButton $isActive={activeTab === 'management'} onClick={() => onTabChange('management')}>
            관리법
          </TabButton>
        </TabNav>

        <TabContentContainer>
          {activeTab === 'summary' && (
            <StreamingTabContent>
              <SummaryItem>
                <span className="label">의심 질환</span>
                <span className="value disease-name">{diseaseInfo.disease_name}</span>
              </SummaryItem>
              <SummaryItem>
                <span className="label">확률</span>
                <span className="value">{diseaseInfo.confidence}%</span>
              </SummaryItem>
              <SummaryItem>
                <span className="label">심각도</span>
                <SeverityBar>
                  <SeverityBarInner $severity={diseaseInfo.confidence} />
                </SeverityBar>
              </SummaryItem>
              <SummaryItem>
                <span className="label">예상 치료 기간</span>
                <span className="value">
                  {diseaseInfo.confidence >= 70 ? '2-3주' : diseaseInfo.confidence >= 40 ? '3-4주' : '4-6주'}
                </span>
              </SummaryItem>
              
              <AIOpinionBox>
                <h4><FaCommentMedical style={{ marginRight: '0.5rem' }} />AI 소견 및 주의사항</h4>
                {streamingContent.summary ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {streamingContent.summary}
                    {isStreaming && activeTab === 'summary' && <span className="cursor">|</span>}
                  </div>
                ) : (
                  <p>
                    {diseaseInfo.confidence >= 70 
                      ? `${diseaseInfo.disease_name}의 가능성이 매우 높습니다. 전문의 상담을 통해 정확한 진단과 치료를 받으시기 바랍니다.`
                      : diseaseInfo.confidence >= 40 
                      ? `${diseaseInfo.disease_name}의 가능성이 있습니다. 추가적인 검사와 전문의 상담을 권장드립니다.`
                      : '여러 가능성이 있어 정확한 진단이 필요합니다. 피부과 전문의의 직접적인 진료를 받으시기 바랍니다.'
                    }
                    {isStreaming && activeTab === 'summary' && <span className="cursor">|</span>}
                  </p>
                )}
              </AIOpinionBox>
            </StreamingTabContent>
          )}

          {activeTab === 'description' && (
            <StreamingTabContent>
              <h3>{diseaseInfo.disease_name}이란?</h3>
              <div style={{ marginBottom: '1rem' }}>
                {streamingContent.description ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {streamingContent.description}
                    {isStreaming && activeTab === 'description' && <span className="cursor">|</span>}
                  </div>
                ) : (
                  <div>
                    <p><strong>정의:</strong> '{diseaseInfo.disease_name}'는 피부에 발생하는 염증성 질환으로, 다양한 원인에 의해 발생할 수 있습니다.</p>
                    <p><strong>특징:</strong> 발진, 가려움증, 홍반, 피부 건조 등의 증상이 나타날 수 있으며, 적절한 치료와 관리가 필요합니다.</p>
                    <p><strong>원인:</strong> 유전적 요인, 환경적 요인, 면역학적 이상 등이 복합적으로 작용하여 발생합니다. 연령에 따라 발생하는 부위가 다를 수 있습니다.</p>
                    {isStreaming && activeTab === 'description' && <span className="cursor">|</span>}
                  </div>
                )}
              </div>
            </StreamingTabContent>
          )}

          {activeTab === 'precautions' && (
            <StreamingTabContent>
              <h3>{diseaseInfo.disease_name} 주의사항</h3>
              {streamingContent.precautions ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {streamingContent.precautions}
                  {isStreaming && activeTab === 'precautions' && <span className="cursor">|</span>}
                </div>
              ) : (
                <div>
                  <ul>
                    <li>피부를 긁거나 문지르는 등 물리적 자극을 최소화하세요.</li>
                    <li>뜨거운 물 목욕, 찜질 사우나는 피부를 더 건조하게 만들 수 있으니 피하세요.</li>
                    <li>스트레스는 증상을 악화시킬 수 있으니 충분한 휴식과 수면이 중요합니다.</li>
                    <li>세정력이 너무 강한 비누나 세제 사용을 피하고 순한 제품을 사용하세요.</li>
                    {additionalInfo && additionalInfo.symptoms.length > 0 && (
                      <li><strong>입력하신 증상 ({additionalInfo.symptoms.join(', ')})에 대해 특히 주의하세요.</strong></li>
                    )}
                    {additionalInfo && additionalInfo.itchLevel > 7 && (
                      <li><strong>가려움 정도가 높으니 절대 긁지 마시고 냉찜질로 진정시키세요.</strong></li>
                    )}
                  </ul>
                  {isStreaming && activeTab === 'precautions' && <span className="cursor">|</span>}
                </div>
              )}
            </StreamingTabContent>
          )}

          {activeTab === 'management' && (
            <StreamingTabContent>
              <h3>{diseaseInfo.disease_name} 관리법</h3>
              {streamingContent.management ? (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  {streamingContent.management}
                  {isStreaming && activeTab === 'management' && <span className="cursor">|</span>}
                </div>
              ) : (
                <div>
                  <ul>
                    <li><strong>보습:</strong> 하루 2회 이상, 목욕 후 3분 이내에 전신에 보습제를 충분히 발라주세요.</li>
                    <li><strong>청정:</strong> 미지근한 물로 10분 이내에 짧게 샤워하고, 약산성 클렌저를 사용하세요.</li>
                    <li><strong>환경:</strong> 실내 온도 18-21°C, 습도 40-50%를 유지하여 쾌적한 환경을 만드세요.</li>
                    <li><strong>의복:</strong> 부드러운 면 소재의 옷을 입고, 꽉 끼는 옷은 피해주세요.</li>
                    {additionalInfo && additionalInfo.duration !== 'unknown' && (
                      <li><strong>지속 기간 고려:</strong> {additionalInfo.duration} 지속되고 있으니 꾸준한 관리가 필요합니다.</li>
                    )}
                  </ul>
                  {isStreaming && activeTab === 'management' && <span className="cursor">|</span>}
                </div>
              )}
            </StreamingTabContent>
          )}
        </TabContentContainer>
      </DetailsBox>

      <ButtonGroup>
        {isComplete && !isSaved && (
          <StyledButton $variant="primary" onClick={onSaveResult}>
            <FontAwesomeIcon icon={faSave} />
            진단 결과 저장
          </StyledButton>
        )}
        {isSaved && (
          <StyledButton $variant="secondary" onClick={onDownloadReport}>
            <FontAwesomeIcon icon={faDownload} />
            결과 리포트 다운로드
          </StyledButton>
        )}
        <StyledButton onClick={onRestartAnalysis}>
          <FontAwesomeIcon icon={faRedo} />
          다시 분석하기
        </StyledButton>
      </ButtonGroup>
    </DetailsPanelContainer>
  );
};

export default DetailsPanel;
