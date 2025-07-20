import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FaCalendarAlt } from 'react-icons/fa';
import {
  Section,
  SectionHeading,
  SectionSubheading,
  NotoSansBlack,
  StatusBadge,
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

const DashboardWrapper = styled.div`
  background-color: #1f2937;
  border-radius: 1.5rem;
  padding: 4rem;
  color: #e5e7eb;
  box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2.5rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ChartContainer = styled.div`
  min-width: 0;
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

const HistoryContainer = styled.div`
  min-width: 0;
  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

const HistoryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const HistoryItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  
  .info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
`;

const skinScoreChartData = {
  labels: ['4주 전', '3주 전', '2주 전', '1주 전'],
  datasets: [{
    label: '피부 점수',
    data: [65, 70, 68, 82],
    fill: true,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderColor: '#3b82f6',
    tension: 0.3,
    pointBackgroundColor: '#3b82f6',
    pointRadius: 5,
    pointHoverRadius: 7,
  }]
};

const skinScoreChartOptions = {
  responsive: true,
  scales: {
    y: { beginAtZero: true, max: 100, ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.2)' } },
    x: { ticks: { color: '#9ca3af' }, grid: { color: 'rgba(156, 163, 175, 0.2)' } }
  },
  plugins: { legend: { display: false } }
};

const DashboardPreviewSection: React.FC = () => {
  return (
    <Section id="dashboard">
      <ContentWrapper>
        <SectionHeading>
          <NotoSansBlack>개인 맞춤형 대시보드</NotoSansBlack>
        </SectionHeading>
        <SectionSubheading>
          나의 피부 상태 변화를 기록하고, 한눈에 추적하세요.
        </SectionSubheading>
        <DashboardWrapper>
          <DashboardGrid>
            <ChartContainer>
              <h3>피부 상태 점수 변화 (최근 4주)</h3>
              <Line data={skinScoreChartData} options={skinScoreChartOptions} />
            </ChartContainer>
            <HistoryContainer>
              <h3>최근 진단 기록</h3>
              <HistoryList>
                <HistoryItem>
                  <div className="info">
                    <FaCalendarAlt />
                    <span>7월 4일</span>
                    <span>아토피</span>
                  </div>
                  <StatusBadge status="개선">개선</StatusBadge>
                </HistoryItem>
                <HistoryItem>
                  <div className="info">
                    <FaCalendarAlt />
                    <span>6월 28일</span>
                    <span>아토피</span>
                  </div>
                  <StatusBadge status="유지">유지</StatusBadge>
                </HistoryItem>
                <HistoryItem>
                  <div className="info">
                    <FaCalendarAlt />
                    <span>6월 21일</span>
                    <span>접촉성 피부염</span>
                  </div>
                  <StatusBadge status="악화">악화</StatusBadge>
                </HistoryItem>
              </HistoryList>
            </HistoryContainer>
          </DashboardGrid>
        </DashboardWrapper>
      </ContentWrapper>
    </Section>
  );
};

export default DashboardPreviewSection;
