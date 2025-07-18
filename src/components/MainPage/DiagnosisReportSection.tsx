import React, { useState } from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js';
import { FaCommentMedical, FaArrowLeft, FaRedo, FaDownload } from 'react-icons/fa';
import {
  Section,
  SectionHeading,
  SectionSubheading,
  NotoSansBlack,
  ReportItem,
  AIOpinionBox,
  SeverityBar,
  SeverityBarInner,
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

ChartJS.register(ArcElement, Tooltip, Legend);

const DiagnosisGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 6rem;
    align-items: start;
  }
`;
const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 28rem; /* 최대 너비 설정 */
  margin: 0 auto; /* 중앙 정렬 */
  .section-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin-bottom: 2rem; }
`;
const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const NewChartWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  height: clamp(10rem, 20vw, 25rem); /* 반응형 높이 (최소 10rem, 뷰포트 너비의 20%, 최대 25rem) */
  border: none;
  background-color: transparent;
`;
const NewLegendContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NewLegendItem = styled.div`

  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #f1f5f9; }
`;

const NewLegendColorBox = styled.span<{ color: string }>`
  width: 1rem;
  height: 1rem;

  border-radius: 9999px;
  background-color: ${props => props.color};
  margin-right: 0.75rem;
`;

const FullReportCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1; /* 남은 세로 공간을 채우도록 */
`;

const FullTabNav = styled.nav`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 1rem;
  overflow-x: auto;
`;
const FullTabButton = styled.button<{ $isActive: boolean }>`
  /* 기본 스타일 */
  background-color: transparent; /* 배경색을 투명하게 만듭니다. */
  border: none;                /* 모든 테두리를 제거합니다. */
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;


  /* 활성/비활성 상태에 따른 동적 스타일 */
  color: ${props => (props.$isActive ? '#2563eb' : '#64748b')};
  
  /* 활성 탭에만 파란색 밑줄을 표시하고, 나머지는 투명하게 처리합니다. */
  border-bottom: 3px solid ${props => (props.$isActive ? '#2563eb' : 'transparent')};


  /* 마우스 오버 효과 */
  &:hover {
    color: #2563eb;
  }
`;

const FullTabContentContainer = styled.div`
  padding: 1.5rem 2rem;
  /* min-height: 240px; */ /* 최소 높이 제거 */
  overflow-y: auto;
  flex-grow: 1; /* 남은 세로 공간을 채우도록 */
`;
const FullActionsContainer = styled.div`
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  width: 100%;
`;
const ActionButton = styled.button<{ primary?: boolean; fullWidth?: boolean }>`
  background-color: ${props => props.primary ? '#2563eb' : '#e2e8f0'};
  color: ${props => props.primary ? 'white' : '#334155'};
  font-weight: 700;
  padding: 0.625rem 0;
  border-radius: 0.5rem;
  border: none;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  &:hover { background-color: ${props => props.primary ? '#1d4ed8' : '#cbd5e1'}; }
`;
const FullContentBlock = styled.div`
  h3 { font-size: 1.125rem; font-weight: 700; margin-bottom: 0.75rem; }
  ul { list-style-position: inside; list-style-type: disc; display: flex; flex-direction: column; gap: 0.75rem; color: #334155; line-height: 1.7; }
`;

const ReportContainer = styled.div`
  background-color: white;
  padding: 2.5rem;
  border-radius: 1.5rem; /* 24px, 부드러운 모서리 */
  box-shadow: 0 10px 25px 10px rgba(0, 0, 0, 0.07), 0 8px 10px -6px rgba(0, 0, 0, 0.07);
  max-width: 80rem; /* 최대 너비 제한 */
  margin: 0 auto; /* 중앙 정렬 */
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const diagnosisChartData = {
  labels: ['아토피 피부염', '접촉성 피부염', '지루성 피부염', '기타'],
  datasets: [{
    data: [87, 8, 3, 2],
    backgroundColor: ['#2563eb', '#60a5fa', '#93c5fd', '#dbeafe'],
    borderColor: 'white',
    borderWidth: 0,
  }]
};

const diagnosisChartOptions = {
  responsive: true,
  maintainAspectRatio: false, 
  devicePixelRatio: window.devicePixelRatio > 1 ? window.devicePixelRatio : 2,
  cutout: '60%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context: TooltipItem<'doughnut'>) => `${context.label}: ${context.parsed}%`
      }
    }
  }
};

type TabType = 'summary' | 'description' | 'precautions' | 'management';

const DiagnosisReportSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const handleDownloadReport = () => { /* 다운로드 로직 */ };

  const tabContent: Record<TabType, React.ReactNode> = {
    summary: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
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
              <SeverityBarInner style={{ width: '75%' }} />
            </SeverityBar>
          </ReportItem>
          <ReportItem>
            <span className="label">예상 치료 기간</span>
            <span className="value">3-4주</span>
          </ReportItem>
        </div>
        <AIOpinionBox>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaCommentMedical /> AI 소견 및 주의사항</h4>
          <p>건조함과 가려움을 동반하는 피부염으로 보입니다. 보습제를 충분히 사용하고, 전문의와 상담하여 정확한 진단 및 치료를 받는 것을 권장합니다.</p>
        </AIOpinionBox>
      </div>
    ),
    description: (<FullContentBlock><h3>상세 설명 내용...</h3></FullContentBlock>),
    precautions: (<FullContentBlock><h3>주의사항 내용...</h3></FullContentBlock>),
    management: (<FullContentBlock><h3>관리법 내용...</h3></FullContentBlock>),
  };

  return (
    <Section id="diagnosis-result" bg="#eff6ff">
      <ContentWrapper>
        <SectionHeading>
          <NotoSansBlack>AI 피부 질환 진단</NotoSansBlack>
        </SectionHeading>
        <SectionSubheading>
          사진 한 장으로 AI가 질환을 예측하고, 상세한 리포트를 제공합니다.
        </SectionSubheading>
        <ReportContainer>
          <DiagnosisGrid>
            {/* 왼쪽 패널 */}
            <LeftPanel>
              <h2 className="section-title">예상 질환 통계</h2>
              <NewChartWrapper>
                <Doughnut data={diagnosisChartData} options={diagnosisChartOptions} />
              </NewChartWrapper>
              <NewLegendContainer>
                {diagnosisChartData.labels.map((label, index) => (
                  <NewLegendItem key={label}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <NewLegendColorBox color={diagnosisChartData.datasets[0].backgroundColor[index] as string} />
                      <span style={{ color: '#334155' }}>{label}</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{diagnosisChartData.datasets[0].data[index]}%</span>
                  </NewLegendItem>
                ))}
              </NewLegendContainer>
            </LeftPanel>

            {/* 오른쪽 패널 */}
            <RightPanel>
              <FullReportCard>
                <FullTabNav>
                  <FullTabButton onClick={() => setActiveTab('summary')} $isActive={activeTab === 'summary'}>요약</FullTabButton>
                  <FullTabButton onClick={() => setActiveTab('description')} $isActive={activeTab === 'description'}>상세 설명</FullTabButton>
                  <FullTabButton onClick={() => setActiveTab('precautions')} $isActive={activeTab === 'precautions'}>주의사항</FullTabButton>
                  <FullTabButton onClick={() => setActiveTab('management')} $isActive={activeTab === 'management'}>관리법</FullTabButton>
                </FullTabNav>
                <FullTabContentContainer>
                  {tabContent[activeTab]}
                </FullTabContentContainer>
              </FullReportCard>
              <FullActionsContainer>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <ActionButton><FaArrowLeft /><span>이전</span></ActionButton>
                  <ActionButton><FaRedo /><span>다시 분석</span></ActionButton>
                </div>
                <ActionButton primary fullWidth onClick={handleDownloadReport}>
                  <FaDownload /><span>리포트 내려받기</span>
                </ActionButton>
              </FullActionsContainer>
            </RightPanel>
          </DiagnosisGrid>
        </ReportContainer>
      </ContentWrapper>
    </Section>
  );
};

export default DiagnosisReportSection;
