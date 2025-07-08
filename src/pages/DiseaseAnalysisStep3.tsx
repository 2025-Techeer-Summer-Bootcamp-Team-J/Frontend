// src/pages/AnalysisResultPage.jsx

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRedo, faDownload } from '@fortawesome/free-solid-svg-icons';

// Chart.js에 필요한 요소들을 등록합니다.
ChartJS.register(ArcElement, Tooltip, Legend);

// ----------------------------------------------------------------
// --- 스타일(Styled Components) 정의 ---
// ----------------------------------------------------------------

// 1. 전체 페이지 레이아웃 스타일
const PageContainer = styled.div`
  width: 1440px;
  height: 810px;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  padding: 3rem 4rem;
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6rem;
  flex-grow: 1;
`;

// 2. 단계 표시기 스타일
const StepContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 32rem;
  margin: 0 auto 2.5rem;
`;

const StepItem = styled.div<{ status: 'completed' | 'active' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  color: #94a3b8;
  font-weight: 700;
  ${({ status }) =>
    (status === 'completed' || status === 'active') &&
    css`
      border-color: #3b82f6;
      background-color: #3b82f6;
      color: white;
    `}
`;

const StepLine = styled.div`
  flex-grow: 1;
  height: 2px;
  background-color: #e2e8f0;
`;

// 3. 왼쪽 패널 (차트) 스타일
const ChartPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ChartWrapper = styled.div`
  width: 100%;
  max-width: 28rem;
  height: 20rem;
`;

const LegendContainer = styled.div`
  width: 100%;
  max-width: 28rem;
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.2s ease;
  &:hover { background-color: #f8fafc; }
`;

const LegendLabel = styled.div` display: flex; align-items: center; `;
const LegendColorBox = styled.span<{ color: string }>`
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  margin-right: 0.75rem;
  background-color: ${(props) => props.color};
`;
const LegendText = styled.span` color: #334155; `;
const LegendValue = styled.span` font-weight: 700; color: #1e293b; `;
const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 2rem;
`;

// 4. 오른쪽 패널 (상세정보) 스타일
const DetailsPanelContainer = styled.div` display: flex; flex-direction: column; `;
const DetailsBox = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  background-color: #f8fafc;
`;

const TabNav = styled.nav`
  display: flex;
  padding: 0 1rem;
  border-bottom: 1px solid #e2e8f0;
  background-color: white;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  color: #64748b;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s ease;
  ${({ isActive }) => isActive && css` color: #2563eb; border-bottom-color: #2563eb; `}
`;

const TabContentContainer = styled.div` padding: 2rem; flex-grow: 1; `;
const TabContent = styled.div`
  h3 { font-weight: 700; font-size: 1.125rem; color: #1e293b; margin: 0 0 0.75rem; }
  ul { list-style: disc; list-style-position: inside; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.75rem; color: #475569; line-height: 1.6; }
  strong { font-weight: 700; }
`;

const ButtonGroup = styled.div` padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; `;
const TwoButtonGrid = styled.div` display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; `;
const StyledButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  width: 100%; font-weight: 700; padding: 0.625rem 0; border-radius: 0.5rem;
  font-size: 1rem; border: none; cursor: pointer; transition: background-color 0.2s ease;
  ${({ variant }) => {
    switch (variant) {
      case 'primary': return css` background-color: #2563eb; color: white; &:hover { background-color: #1d4ed8; }`;
      case 'secondary': return css` background-color: #475569; color: white; &:hover { background-color: #334155; }`;
      default: return css` background-color: #e2e8f0; color: #334155; &:hover { background-color: #cbd5e1; }`;
    }
  }}
`;

// ----------------------------------------------------------------
// --- 데이터 정의 ---
// ----------------------------------------------------------------
const chartData = {
  labels: ['아토피 피부염', '접촉성 피부염', '지루성 피부염', '기타'],
  datasets: [{
    data: [55, 25, 15, 5],
    backgroundColor: ['#2563eb', '#60a5fa', '#93c5fd', '#dbeafe'],
    borderColor: 'white',
    borderWidth: 4,
    hoverOffset: 8,
  }],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '60%',
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (context: TooltipItem<'doughnut'>) => `${context.label}: ${context.parsed}%` } },
  },
};

// ----------------------------------------------------------------
// --- 메인 페이지 컴포넌트 ---
// ----------------------------------------------------------------
const AnalysisResultPage = () => {
  const [activeTab, setActiveTab] = useState('precautions');

  const handleDownloadReport = () => {
    // 리포트 다운로드 로직 (이전과 동일)
  };

  return (
    <PageContainer>
      {/* 1. 단계 표시기 */}
      <StepContainer>
        <StepItem status="completed">1</StepItem>
        <StepLine />
        <StepItem status="completed">2</StepItem>
        <StepLine />
        <StepItem status="active">3</StepItem>
      </StepContainer>

      <MainContent>
        {/* 2. 왼쪽 패널 (차트) */}
        <ChartPanel>
          <SectionTitle>예상 질환 통계</SectionTitle>
          <ChartWrapper>
            <Doughnut data={chartData} options={chartOptions} />
          </ChartWrapper>
          <LegendContainer>
            {chartData.labels.map((label, index) => (
              <LegendItem key={label}>
                <LegendLabel>
                  <LegendColorBox color={chartData.datasets[0].backgroundColor[index]} />
                  <LegendText>{label}</LegendText>
                </LegendLabel>
                <LegendValue>{chartData.datasets[0].data[index]}%</LegendValue>
              </LegendItem>
            ))}
          </LegendContainer>
        </ChartPanel>

        {/* 3. 오른쪽 패널 (상세정보) */}
        <DetailsPanelContainer>
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <SectionTitle style={{ marginBottom: '1.5rem' }}>상세 정보 (가장 확률 높은 질환 기준)</SectionTitle>
            <DetailsBox>
              <TabNav>
                <TabButton isActive={activeTab === 'precautions'} onClick={() => setActiveTab('precautions')}>
                  주의사항
                </TabButton>
                <TabButton isActive={activeTab === 'management'} onClick={() => setActiveTab('management')}>
                  관리법
                </TabButton>
              </TabNav>
              <TabContentContainer>
                {activeTab === 'precautions' && (
                  <TabContent>
                    <h3>아토피 피부염 주의사항</h3>
                    <ul>
                      <li>피부를 긁거나 문지르는 등 물리적 자극을 최소화하세요.</li>
                      <li>뜨거운 물 목욕, 잦은 사우나는 피부를 더 건조하게 만들 수 있으니 피하세요.</li>
                      <li>스트레스는 증상을 악화시킬 수 있으니 충분한 휴식과 수면이 중요합니다.</li>
                    </ul>
                  </TabContent>
                )}
                {activeTab === 'management' && (
                  <TabContent>
                    <h3>아토피 피부염 관리법</h3>
                    <ul>
                      <li><strong>보습:</strong> 하루 2회 이상, 목욕 후 3분 이내에 전신에 보습제를 충분히 발라주세요.</li>
                      <li><strong>청결:</strong> 미지근한 물로 10분 이내에 짧게 샤워하고, 약산성 클렌저를 사용하세요.</li>
                      <li><strong>환경:</strong> 실내 온도 18-21℃, 습도 40-50%를 유지하여 쾌적한 환경을 만드세요.</li>
                    </ul>
                  </TabContent>
                )}
              </TabContentContainer>
            </DetailsBox>
          </div>
          <ButtonGroup>
            <TwoButtonGrid>
              <StyledButton>
                <FontAwesomeIcon icon={faArrowLeft} /><span>이전</span>
              </StyledButton>
              <StyledButton variant="secondary">
                <FontAwesomeIcon icon={faRedo} /><span>다시 분석</span>
              </StyledButton>
            </TwoButtonGrid>
            <StyledButton variant="primary" onClick={handleDownloadReport}>
              <FontAwesomeIcon icon={faDownload} /><span>리포트 내려받기</span>
            </StyledButton>
          </ButtonGroup>
        </DetailsPanelContainer>
      </MainContent>
    </PageContainer>
  );
};

export default AnalysisResultPage;