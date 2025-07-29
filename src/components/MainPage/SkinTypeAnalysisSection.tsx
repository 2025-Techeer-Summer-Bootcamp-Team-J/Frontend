import React from 'react';
import styled from 'styled-components';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

import {
  Section,
  SectionHeading,
  SectionSubheading,
  NotoSansBlack
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3rem;
  justify-content: center;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: stretch;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 2.5rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(71,69,179,0.2);
  padding: 1.5rem;
  width: 300px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.4);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #4D4D4D;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  background: #F0F9FF;
  border-radius: 0.75rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #525b69ff;
  margin-bottom: 0.5rem;
`;

const ResultBox = styled.div`
  background: #F0F9FF;
  padding: 1.5rem 1rem;
  border-radius: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  gap: 1.2rem;
`;

const ResultText = styled.div`
  color: #05A6FD;
  font-size: 1.8rem;
  font-weight: 700;
`;

const ResultDescription = styled.p`
  font-size: 0.875rem;
  font-weight: 400;
  color: #8A8A8A;
  margin: 0;
  line-height: 2;
`;

const ResultDivider = styled.hr`
  border: none;
  height: 1px;
  background-color: #DAF0FF;
  margin: 0.75rem 0;
`;

const SkinTypeAnalysisSection: React.FC = () => {
  const radarData = {
    labels: ['주름', '유분', '모공', '블랙헤드', '여드름', '민감도', '멜라닌', '수분', '각질'],
    datasets: [
      {
        label: '점수',
        data: [90, 70, 60, 80, 60, 80, 50, 70, 60],
        backgroundColor: 'rgba(34, 202, 236, 0.2)',
        borderColor: 'rgba(34, 202, 236, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(34, 202, 236, 1)',
      },
    ],
  };

  const radarOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          display: false,
        },
        angleLines: {
          color: '#e5e7eb',
        },
        grid: {
          color: '#e5e7eb',
        },
        pointLabels: {
          color: '#4b5563',
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Section id="analysis">
      <ContentWrapper>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <SectionHeading>
            <NotoSansBlack>나의 피부 유형 바로 알기</NotoSansBlack>
          </SectionHeading>
          <SectionSubheading>
            AI가 당신의 피부 타입을 분석하고, 유형별 특징과 통계를 제공합니다.
          </SectionSubheading>
        </div>

        <CardWrapper>
          <Card>
            <CardTitle>피부 항목별 점수 차트</CardTitle>
            <Radar data={radarData} options={radarOptions} />
          </Card>

          <Card>
            <CardTitle>피부 유형 진단 결과</CardTitle>
            <ResultBox>
              <ResultText>중성 피부</ResultText>
              <ResultDivider />
              <ResultDescription>
                유분과 수분의 균형이 잘 맞는 이상적인 피부 타입으로, 트러블이 적고 탄력이 좋습니다.
              </ResultDescription>
            </ResultBox>
          </Card>

          <Card>
            <CardTitle>📋 주요 특징</CardTitle>
            <List>
              <ListItem>적당한 유분과 수분</ListItem>
              <ListItem>트러블이 적음</ListItem>
            </List>

            <CardTitle>💧 추천 관리법</CardTitle>
            <List>
              <ListItem>주 1-2회 각질 제거</ListItem>
              <ListItem>계절에 맞는 보습 제품 사용</ListItem>
            </List>
          </Card>
        </CardWrapper>
      </ContentWrapper>
    </Section>
  );
};

export default SkinTypeAnalysisSection;
