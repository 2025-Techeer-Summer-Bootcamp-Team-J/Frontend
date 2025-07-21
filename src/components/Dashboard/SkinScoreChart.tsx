import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, type ChartData, type ChartOptions
} from 'chart.js';
import styled from 'styled-components';

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

interface SkinScoreChartProps {
  scores: number[];
  className?: string;
}

const SkinScoreChart: React.FC<SkinScoreChartProps> = ({ scores, className }) => {
  // 차트 데이터 및 옵션
  const chartLabels = scores?.map((_score: number, index: number) => `${index + 1}`) || [];
  
  const chartData: ChartData<'line'> = {
    labels: chartLabels,
    datasets: [{
      label: '피부 점수',
      data: scores || [],
      fill: true,
      backgroundColor: (context) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(79, 115, 229, 0.4)');
        gradient.addColorStop(1, 'rgba(79, 115, 229, 0)');
        return gradient;
      },
      borderColor: '#4F73E5',
      borderWidth: 3,
      pointRadius: 0,
      pointHoverRadius: 6,
      tension: 0.4,
    }]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 10,
        displayColors: false,
        callbacks: {
          label: (context) => `점수: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        border: { dash: [5, 5] },
        grid: { color: '#e5e7eb' },
        ticks: { color: '#6b7280', font: { size: 12, family: "'Inter', sans-serif" } },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 12, family: "'Inter', sans-serif" } },
      },
    },
  };

  return (
    <div className={className}>
      <CardTitle>피부 상태 점수 변화 (최근 30일)</CardTitle>
      <ChartContainer>
        <Line options={chartOptions} data={chartData} />
      </ChartContainer>
    </div>
  );
};

export default SkinScoreChart;

// Styled Components
const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 1rem;
`;

const ChartContainer = styled.div`
  height: 20rem;
`; 