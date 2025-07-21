import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js';
import {
  ChartPanel as StyledChartPanel,
  ChartWrapper,
  LegendContainer,
  LegendItem,
  LegendLabel,
  LegendColorBox,
  LegendText,
  LegendValue,
  SectionTitle,
} from './SharedStyles';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartPanelProps {
  analysisResult?: {
    disease_name: string;
    confidence: number;
  };
}

const ChartPanel: React.FC<ChartPanelProps> = ({ analysisResult }) => {
  // 실제 분석 결과가 있으면 사용, 없으면 기본값
  const mainDisease = analysisResult?.disease_name || '분석 중';
  const mainConfidence = analysisResult?.confidence || 0;
  
  // 나머지 확률들은 추정값으로 계산
  const remainingConfidence = 100 - mainConfidence;
  const otherDiseases = [
    { name: '접촉성 피부염', confidence: Math.round(remainingConfidence * 0.4) },
    { name: '지루성 피부염', confidence: Math.round(remainingConfidence * 0.3) },
    { name: '기타', confidence: remainingConfidence - Math.round(remainingConfidence * 0.4) - Math.round(remainingConfidence * 0.3) }
  ];

  const chartData = {
    labels: [mainDisease, ...otherDiseases.map(d => d.name)],
    datasets: [{
      data: [mainConfidence, ...otherDiseases.map(d => d.confidence)],
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
  return (
    <StyledChartPanel>
      <SectionTitle>예상 질환 통계</SectionTitle>
      <ChartWrapper>
        <Doughnut data={chartData} options={chartOptions} />
      </ChartWrapper>
      <LegendContainer>
        {chartData.labels.map((label, index) => (
          <LegendItem key={label}>
            <LegendLabel>
              <LegendColorBox color={chartData.datasets[0].backgroundColor[index] as string} />
              <LegendText>{label}</LegendText>
            </LegendLabel>
            <LegendValue>{chartData.datasets[0].data[index]}%</LegendValue>
          </LegendItem>
        ))}
      </LegendContainer>
    </StyledChartPanel>
  );
};

export default ChartPanel;
