// src/pages/AnalysisResultPage.jsx

import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo, faDownload } from '@fortawesome/free-solid-svg-icons';
import { ContentWrapper } from '../components/Layout';

// Chart.js에 필요한 요소들을 등록합니다.
ChartJS.register(ArcElement, Tooltip, Legend);

// ----------------------------------------------------------------
// --- 스타일(Styled Components) 정의 ---
// ----------------------------------------------------------------

// 1. 전체 페이지 레이아웃 스타일
const MainContent = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6rem;
  flex-grow: 1;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
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

  @media (max-width: 768px) {
    height: 16rem;
    max-width: 100%;
  }

  @media (min-width: 1024px) {
    max-width: 32rem;
    height: 24rem;
  }
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

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }
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
const TwoButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;
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
    <ContentWrapper style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
      {/* 1. 단계 표시기 */}
      <StepContainer>
        <StepItem status="completed">1</StepItem>
        <StepLine />
        <StepItem status="completed">2</StepItem>
        <StepLine />
        <StepItem status="active">3</StepItem>
      </StepContainer>

      <MainContent>
        {/* 왼쪽: 차트 패널 */}
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

        {/* 오른쪽: 상세정보 패널 */}
        <DetailsPanelContainer>
          <SectionTitle>AI 진단 결과</SectionTitle>
          <DetailsBox>
            <TabNav>
              <TabButton
                isActive={activeTab === 'precautions'}
                onClick={() => setActiveTab('precautions')}
              >
                상세 정보 및 주의사항
              </TabButton>
              <TabButton
                isActive={activeTab === 'solutions'}
                onClick={() => setActiveTab('solutions')}
              >
                추천 솔루션
              </TabButton>
            </TabNav>

            <TabContentContainer>
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
              {activeTab === 'solutions' && (
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
            <StyledButton variant="primary" onClick={() => window.alert('나의 케어 플랜에 추가되었습니다!')}>
              나의 케어 플랜에 추가
            </StyledButton>
            <TwoButtonGrid>
              <StyledButton onClick={() => window.location.reload()}>
                <FontAwesomeIcon icon={faRedo} /> 다시 분석하기
              </StyledButton>
              <StyledButton variant="secondary" onClick={handleDownloadReport}>
                <FontAwesomeIcon icon={faDownload} />
                결과 리포트 다운로드
              </StyledButton>
            </TwoButtonGrid>
          </ButtonGroup>
        </DetailsPanelContainer>
      </MainContent>
    </ContentWrapper>
  );
};

export default AnalysisResultPage;