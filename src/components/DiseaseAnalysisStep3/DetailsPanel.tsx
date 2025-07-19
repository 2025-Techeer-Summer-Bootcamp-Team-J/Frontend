import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FaCommentMedical } from 'react-icons/fa';
import {
  DetailsPanelContainer,
  DetailsBox,
  TabNav,
  TabButton,
  TabContentContainer,
  TabContent,
  ButtonGroup,
  TwoButtonGrid,
  StyledButton,
  SectionTitle,
  ReportCard,
} from './SharedStyles';
import { Grid, ReportItem, AIOpinionBox, SeverityBar, SeverityBarInner } from '../../components/MainPage/SharedStyles';

interface DetailsPanelProps {
  onRestartAnalysis: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ onRestartAnalysis }) => {
  const [activeTab, setActiveTab] = useState('summary');

  const handleDownloadReport = () => {
    // 리포트 다운로드 로직 (이전과 동일)
  };

  return (
    <DetailsPanelContainer>
      <SectionTitle>AI 진단 결과</SectionTitle>
      <DetailsBox>
        <TabNav>
          <TabButton
            $isActive={activeTab === 'summary'}
            onClick={() => setActiveTab('summary')}
          >
            요약
          </TabButton>
          <TabButton
            $isActive={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            상세 설명
          </TabButton>
          <TabButton
            $isActive={activeTab === 'precautions'}
            onClick={() => setActiveTab('precautions')}
          >
            주의사항
          </TabButton>
          <TabButton
            $isActive={activeTab === 'management method'}
            onClick={() => setActiveTab('management method')}
          >
            관리법
          </TabButton>
        </TabNav>

        <TabContentContainer>
          {activeTab === 'summary' && (
            <TabContent>
              <Grid lg_cols="1" gap="2rem" align="stretch">
                <ReportCard>
                  <h3 className="text-xl font-bold text-gray-800 border-b border-gray-200 pb-2">AI 진단 리포트</h3>
                  <ReportItem>
                    <span className="label">의심 질환</span>
                    <span className="value-disease">아토피 피부염</span>
                  </ReportItem>
                  <ReportItem>
                    <span className="label">확률</span>
                    <span className="value">87%</span>
                  </ReportItem>
                  <ReportItem>
                    <span className="label">심각도</span>
                    <SeverityBar>
                      <SeverityBarInner style={{ width: '65%' }} />
                    </SeverityBar>
                  </ReportItem>
                  <ReportItem>
                    <span className="label">예상 치료 기간</span>
                    <span className="value">3-4주</span>
                  </ReportItem>
                  <AIOpinionBox>
                    <h4><FaCommentMedical style={{ marginRight: '0.5rem' }} />AI 소견 및 주의사항</h4>
                    <p>건조함과 가려움을 동반하는 피부염으로 보입니다. 보습제를 충분히 사용하고, 전문의와 상담하여 정확한 진단 및 치료를 받는 것을 권장합니다.</p>
                  </AIOpinionBox>
                </ReportCard>
              </Grid>
            </TabContent>
          )}
          {activeTab === 'description' && (
            <TabContent>
              <h3>상세 설명 내용...</h3>
              <ul>
                <li><strong>피부 상태:</strong> 피부 상태 설명 ~~</li>
              </ul>
            </TabContent>
          )}
          {activeTab === 'precautions' && (
            <TabContent>
              <h3>
                <strong>'아토피 피부염'</strong>일 가능성이 높습니다. (<strong>55%</strong>)
              </h3>
              <ul>
                <li><strong>주요 증상:</strong> 피부 건조, 심한 가려움, 붉은 반점, 진물 등이 특징입니다.</li>
                <li><strong>악화 요인:</strong> 스트레스, 특정 음식, 건조한 환경, 부적절한 피부 관리 등에 의해 악화될 수 있습니다.</li>
                <li><strong>주의사항:</strong> 절대로 긁지 마세요. 피부 장벽이 손상되어 2차 감염의 위험이 있습니다.</li>
                <li><strong>관리 팁:</strong> 순하고 보습력이 강한 제품을 사용하여 피부 장벽을 강화하고, 미지근한 물로 짧게 샤워하는 것이 좋습니다.</li>
              </ul>
            </TabContent>
          )}
          {activeTab === 'management method' && (
            <TabContent>
              <h3>추천 성분 및 제품 타입</h3>
              <ul>
                <li><strong>추천 성분:</strong> 세라마이드, 판테놀, 히알루론산 등 피부 장벽 강화 및 보습에 도움을 주는 성분</li>
                <li><strong>피해야 할 성분:</strong> 인공 향료, 알코올, 과도한 화학적 각질 제거 성분</li>
                <li><strong>생활 습관:</strong> 실내 습도를 40-60%로 유지하고, 면 소재의 부드러운 옷을 착용하세요.</li>
              </ul>
            </TabContent>
          )}
        </TabContentContainer>
      </DetailsBox>
      <ButtonGroup>
        <StyledButton $variant="primary" onClick={() => window.alert('나의 케어 플랜에 추가되었습니다!')}>
          나의 케어 플랜에 추가
        </StyledButton>
        <TwoButtonGrid>
          <StyledButton onClick={onRestartAnalysis}>
            <FontAwesomeIcon icon={faRedo} /> 다시 분석하기
          </StyledButton>
          <StyledButton $variant="secondary" onClick={handleDownloadReport}>
            <FontAwesomeIcon icon={faDownload} />
            결과 리포트 다운로드
          </StyledButton>
        </TwoButtonGrid>
      </ButtonGroup>
    </DetailsPanelContainer>
  );
};

export default DetailsPanel;
