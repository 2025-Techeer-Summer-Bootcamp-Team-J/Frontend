import React from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import {
  Section,
  NotoSansBlack
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

const DashboardWrapper = styled.div`
  background-color: #FFFFFF;
  border-radius: 3rem;
  padding: 1.5rem 2rem;
  color: #202123;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(71,69,179,0.2);
  width: 100%;
  display: flex;
`;

const ChartContainer = styled.div`
  min-width: 0;
  width: 100%;

  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
`;

const skinScoreChartData = {
  labels: ['28일 전', '27일 전', '25일 전', '23일 전', '21일 전', '19일 전', '17일 전', '15일 전', '13일 전', '11일 전', '9일 전', '7일 전', '5일 전', '3일 전', '1일 전'],
  datasets: [
    {
      label: '피부 점수',
      data: [62, 68, 72, 71, 77, 79, 82, 80, 79, 84, 86, 88, 89, 90, 91],
      fill: true,
      backgroundColor: (context: any) => {
        const chart = context.chart;
        const {
          ctx,
          chartArea
        } = chart;

        if (!chartArea) return;

        const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)'); // 위쪽 연파랑
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)'); // 아래쪽 거의 흰색
        return gradient;
      },
      borderColor: '#4F73E5',
      tension: 0.4,
      pointRadius: 0,           
      pointHoverRadius: 10,    
    },
  ]
};

const skinScoreChartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
      border: { dash: [5, 5] },
      ticks: { color: '#9ca3af', stepSize: 20 },
      grid: { color: 'rgba(156, 163, 175, 0.2)',
        borderWidth: 1,
        drawBorder: false } },
    x: { ticks: { color: '#9ca3af' },
    grid: { display: false } }
  },
  plugins: { legend: { display: false } }
};

const DashboardSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  width: 100%;
`;

const HeaderSection = styled.div`
  max-width: 960px;
  margin: 0 0 1rem;
  text-align: left;
  align-items: flex-start;
  justify-content: flex-start;

`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
`;

const Description = styled.p`
  margin-top: 1rem;
  color: #475569;
  line-height: 1.6;
`;

const TipsCard = styled.div`
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
  padding-bottom: 0.5rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(71,69,179,0.2);
`;

const TipsTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const TipBox = styled.div<{ yellow?: boolean }>`
  background-color: ${(props) => (props.yellow ? '#FEFBE8' : '#EFF6FF')};
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1rem;
`;

const TipTitleBlue = styled.p`
  font-weight: 700;
  color: #2555B7;
`;

const TipTitleYellow = styled.p`
  font-weight: 700;
  color: #8C6B2F;
`;

const TipText = styled.div<{ yellow?: boolean }>`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${(props) => (props.yellow ? '#8C6B2F' : '#2555B7')};
`;

const InfoCard = styled.div`
  min-width: 240px;
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(71,69,179,0.2);
  height: fit-content;
`;

const InfoTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const InfoItem = styled.p`
  font-weight: 600;
  color: #00A6FD;
  margin: 0.5rem 0;
  
  strong {
  font-weight: 400;
  font-size: 0.875rem;
  color: #6b7280;
  }
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 3rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const LeftColumn = styled.div`
  flex: 2;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RightColumn = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const DashboardPreviewSection: React.FC = () => {
  return (
    <Section id="dashboard" bg="#F0F9FF">
      <ContentWrapper>
        <TopRow>  
          <LeftColumn>
            <HeaderSection>
                <HeaderTitle>
                  <NotoSansBlack>개인 맞춤형 대시보드</NotoSansBlack>
                </HeaderTitle>
                <Description>
                  피부 상태를 한눈에 확인하고, 관리하세요. 매일의 피부 상태가 점수가 되어 그래프에 차곡차곡 쌓이고, 지난 진단 기록과 유용한 스킨케어 팁까지 한 페이지에 모두 담아 드립니다. 흩어져 있던 내 피부 정보를 이곳에서 한눈에 관리하고, 더 스마트한 피부 변화를 경험해 보세요.
                </Description>
            </HeaderSection>
            
            <DashboardSection>
                <DashboardWrapper>
                    <ChartContainer>
                      <h3>피부 상태 점수 변화 (최근 4주)</h3>
                      <Line data={skinScoreChartData} options={skinScoreChartOptions} />
                    </ChartContainer>
                </DashboardWrapper>
            </DashboardSection>
          </LeftColumn>

          <RightColumn>
            <InfoCard>
                <InfoTitle>내 정보</InfoTitle>
                <InfoItem><strong>이름</strong><br/>홍길동</InfoItem>
                <InfoItem><strong>이메일</strong><br/>chan@gmail.com</InfoItem>
                <InfoItem><strong>성별</strong><br/>남</InfoItem>
                <InfoItem><strong>생년월일</strong><br/>2001.09.13</InfoItem>
                <InfoItem><strong>피부 타입</strong><br/>건성</InfoItem>
                <InfoItem><strong>주의사항 및 관리 팁<br/>미입력</strong></InfoItem>
            </InfoCard>

            <TipsCard>
                    <TipsTitle>피부 지식</TipsTitle>
                      <TipBox>
                        <TipTitleBlue>💧 보습의 골든타임</TipTitleBlue>
                        <TipText>세수 후 3분 이내 보습제를 발라주면 피부 수분 손실을 효과적으로 막을 수 있어요.</TipText>
                      </TipBox>
                      <TipBox yellow>
                        <TipTitleYellow>⚠️ 자외선 차단제의 진실</TipTitleYellow>
                        <TipText yellow>흐린 날에도 자외선은 존재해요. 날씨와 상관없이 자외선 차단제를 사용하는 습관이 중요해요.</TipText>
                      </TipBox>
            </TipsCard>      
          </RightColumn>
        </TopRow>
      </ContentWrapper>
    </Section>
  );
};

export default DashboardPreviewSection;
