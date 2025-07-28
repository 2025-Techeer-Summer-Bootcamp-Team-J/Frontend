import React from 'react';
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
  ResultGrid,
  ResultSectionTitle,
  ResultList,
  RestartButton,
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
      '피부타입',
      '주름',
      '유분',
      '모공',
      '블랙헤드',
      '여드름',
      '민감도',
      '멜라닌',
      '수분',
      '거침',
      '종합점수',
    ];
    const data = {
      labels,
      datasets: [
        {
          label: '피부 점수',
          data: [
            resultData.score_info.dark_circle_score,
            resultData.score_info.skin_type_score,
            resultData.score_info.wrinkle_score,
            resultData.score_info.oily_intensity_score,
            resultData.score_info.pores_score,
            resultData.score_info.blackhead_score,
            resultData.score_info.acne_score,
            resultData.score_info.sensitivity_score,
            resultData.score_info.melanin_score,
            resultData.score_info.water_score,
            resultData.score_info.rough_score,
            resultData.score_info.total_score,
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
    return (
      <div style={{ maxWidth: 500, margin: '2rem auto' }}>
        <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>피부 항목별 점수 레이더 차트</h3>
        <Radar data={data} options={options} />
      </div>
    );
  };

  return (
    <PageSection $isFadedIn={true}>
      <ResultHeader>
        <MainTitle>AI 피부 진단 결과</MainTitle>
        <MainSubtitle>당신의 피부 타입과 맞춤 관리법을 확인해보세요.</MainSubtitle>
      </ResultHeader>

      <ResultCard>
        <ResultTitle>{resultData.title}</ResultTitle>
        <ResultSubtitle>{resultData.subtitle}</ResultSubtitle>
        <ResultDescription>{resultData.description}</ResultDescription>
      </ResultCard>

      {/* 레이더 차트 */}
      {renderRadarChart()}

      <ResultGrid>
        <ResultCard>
          <ResultSectionTitle><FontAwesomeIcon icon={faListCheck} /> 주요 특징</ResultSectionTitle>
          <ResultList>
            {resultData.features.map((item: string, index: number) => <li key={index}>{item}</li>)}
          </ResultList>
        </ResultCard>
        <ResultCard>
          <ResultSectionTitle><FontAwesomeIcon icon={faHandHoldingHeart} /> 추천 관리법</ResultSectionTitle>
          <ResultList>
            {resultData.care.map((item: string, index: number) => <li key={index}>{item}</li>)}
          </ResultList>
        </ResultCard>
      </ResultGrid>

      <RestartButton href="#upload" onClick={handleRestart}>
        <FontAwesomeIcon icon={faRedo} /> 처음부터 다시 진단하기
      </RestartButton>
    </PageSection>
  );
};

export default ResultSection;
