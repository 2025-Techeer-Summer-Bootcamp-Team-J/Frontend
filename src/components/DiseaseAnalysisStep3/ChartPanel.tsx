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

const ChartPanel: React.FC = () => {
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
