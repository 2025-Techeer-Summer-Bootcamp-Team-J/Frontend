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
import type { SkinResult } from '../../utils/skinAnalysis';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck, faHandHoldingHeart, faRedo } from '@fortawesome/free-solid-svg-icons';
import {
  PageSection,
  ResultHeader,
  MainTitle,
  MainSubtitle,
  ResultCard,
  ResultTitle,
  ResultSubtitle,
  ResultDescription,
  ResultLeftGrid,
  ResultRightGrid,
  ResultSectionTitle,
  ResultList,
  RestartButton,
  ResultGridWrapper,
  ChartCard
} from './SharedStyles';

interface ResultSectionProps {
  resultData: SkinResult;
  handleRestart: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const ResultSection: React.FC<ResultSectionProps> = ({ resultData, handleRestart }) => {
  console.log('ResultSection 컴포넌트 렌더링:', resultData);
  // 레이더 차트 렌더 함수
  const renderRadarChart = () => {
    if (!resultData.score_info) return null;
    const labels = [
      '다크서클',
      '주름',
      '유분',
      '모공',
      '블랙헤드',
      '여드름',
      '민감도',
      '멜라닌',
      '수분',
      '거침'
    ];
    const data = {
      labels,
      datasets: [
        {
          label: '점수',
          data: [
            resultData.score_info.dark_circle_score,
            resultData.score_info.wrinkle_score,
            resultData.score_info.oily_intensity_score,
            resultData.score_info.pores_score,
            resultData.score_info.blackhead_score,
            resultData.score_info.acne_score,
            resultData.score_info.sensitivity_score,
            resultData.score_info.melanin_score,
            resultData.score_info.water_score,
            resultData.score_info.rough_score
          ],
          backgroundColor: 'rgba(34, 202, 236, 0.2)',
          borderColor: 'rgba(34, 202, 236, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(34, 202, 236, 1)',
        },
      ],
    };
    const options = {
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { stepSize: 20 },
        },
      },
    };

    const Wrapper = styled.div`
      margin: auto;
    `;

    const Title = styled.h3`
      text-align: center;
    `;

    const BlueDivider = styled.div`
      width: 100%;
      height: 1.5px;
      background-color: #c7f7ffff;
      margin: 0.8rem auto;
      border-radius: 9999px;
    `;

    const ChartWrapper = styled.div`
      max-width: 550px;
      margin: auto;
    `;

    const TotalScore = styled.div`
      position: absolute;
      left: 590px;
      text-align: right;
      font-size: 1rem;
      font-weight: 500;
      color: #00A6FD;
      background-color: #F0F9FF;
      border-radius: 9999px;
      padding: 0.2rem 1rem;
      margin: 0 1rem; 
    `;

   return (
    <Wrapper>
      <Title>피부 항목별 점수</Title>
      <BlueDivider />
      <ChartWrapper>
      <TotalScore>종합 점수 : { resultData.score_info.total_score }</TotalScore>
        <Radar data={data} options={options} />
      </ChartWrapper>
    </Wrapper>
  );
}

  return (
    <PageSection $isFadedIn={true}>
      <ResultHeader>
        <MainTitle>AI 피부 진단 결과</MainTitle>
        <MainSubtitle>당신의 피부 타입과 맞춤 관리법을 확인해보세요.</MainSubtitle>
      </ResultHeader>

      <ResultGridWrapper>
        <ResultLeftGrid>
          <ChartCard>
            {renderRadarChart()}
          </ChartCard>
        </ResultLeftGrid>

        <ResultRightGrid>
          <ResultCard>
            <ResultTitle>{resultData.title}</ResultTitle>
            <ResultSubtitle>{resultData.subtitle}</ResultSubtitle>
            <ResultDescription>{resultData.description}</ResultDescription>
          </ResultCard>

          <ResultCard>
              <ResultSectionTitle><FontAwesomeIcon icon={faListCheck} /> 주요 특징</ResultSectionTitle>
              <ResultList>
                {resultData.features.map((item: string, index: number) => <li key={index}>{item}</li>)}
              </ResultList>
          </ResultCard>
        </ResultRightGrid>
      </ResultGridWrapper>

        <ResultCard>
          <ResultSectionTitle><FontAwesomeIcon icon={faHandHoldingHeart} /> 추천 관리법</ResultSectionTitle>
          <ResultList>
            {resultData.care.map((item: string, index: number) => <li key={index}>{item}</li>)}
          </ResultList>
        </ResultCard>
      

      <RestartButton href="#upload" onClick={handleRestart}>
        <FontAwesomeIcon icon={faRedo} /> 처음부터 다시 진단하기
      </RestartButton>
    </PageSection>
  );
};

export default ResultSection;
