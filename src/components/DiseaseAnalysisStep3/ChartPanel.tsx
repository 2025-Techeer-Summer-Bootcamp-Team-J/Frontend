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
  // 업로드된 이미지 URL (옵션)
  imageUrl?: string;
  // 실제 확률 리스트 (백분율, 소수 첫째)
  diseaseStats?: Array<{ name: string; percent: number }>;
  // 하위 호환용 - 개별 최고 질병명만 전달될 때
  analysisResult?: {
    disease_name: string;
    confidence: number;
  };
  metrics?: {
    skin_score?: number;
    severity?: string;
    estimated_treatment_period?: string;
  } | null;
}

const ChartPanel: React.FC<ChartPanelProps> = ({ diseaseStats, analysisResult, metrics, imageUrl }) => {

  // 차트 레이블과 값 배열 초기화

  let chartLabels: string[] = [];
  let chartValues: number[] = [];

  if (diseaseStats && diseaseStats.length > 0) {
    chartLabels = diseaseStats.map(d => d.name);
    chartValues = diseaseStats.map(d => d.percent);
  } else {
    // 하위 호환: 단일 결과만 있을 때 기존 더미 로직 유지
    const mainDisease = analysisResult?.disease_name || '분석 중';
    const mainConfidence = analysisResult?.confidence || 0;
    const remainingConfidence = 100 - mainConfidence;
    const otherDiseases: { name: string; percent: number }[] = [

      { name: '접촉성 피부염', percent: Math.round(remainingConfidence * 0.4) },
      { name: '지루성 피부염', percent: Math.round(remainingConfidence * 0.3) },
      { name: '기타', percent: remainingConfidence - Math.round(remainingConfidence * 0.4) - Math.round(remainingConfidence * 0.3) }
    ];

    chartLabels = [mainDisease, ...otherDiseases.map((d) => d.name)];
    chartValues = [mainConfidence, ...otherDiseases.map((d) => d.percent)];

  }

  const chartData = {
    labels: chartLabels,

    datasets: [
      {
        data: chartValues,
        backgroundColor: ['#157FF1', '#60a5fa', '#93c5fd', '#dbeafe'],
        borderColor: 'white',
        borderWidth: 4,
        hoverOffset: 8,
      },
    ],

    datasets: [{

      data: [mainConfidence, ...otherDiseases.map(d => d.confidence)],
      backgroundColor: ['#157FF1', '#60a5fa', '#93c5fd', '#dbeafe'],

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
      {imageUrl && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <SectionTitle>업로드한 이미지</SectionTitle>
          <img
            src={imageUrl}
            alt="Uploaded skin"
            style={{ maxWidth: '100%', borderRadius: '0.5rem' }}
          />
        </div>
      )}
      <SectionTitle>피부 질환 비율</SectionTitle>
      <ChartWrapper>
        <Doughnut data={chartData} options={chartOptions} />
      </ChartWrapper>
      <LegendContainer>
        {chartData.labels.map((label, index) => (
          <LegendItem key={`${label}-${index}`}>
            <LegendLabel>
              <LegendColorBox color={chartData.datasets[0].backgroundColor[index] as string} />
              <LegendText>{label}</LegendText>
            </LegendLabel>
            <LegendValue>{chartData.datasets[0].data[index]}%</LegendValue>
          </LegendItem>
        ))}
      </LegendContainer>

      {metrics && (
        <div style={{ marginTop: '1.5rem' }}>
          <SectionTitle>AI 분석 지표</SectionTitle>
          <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', marginTop: '1rem' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{metrics.skin_score ?? 'N/A'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>피부 점수</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{metrics.severity ?? 'N/A'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>심각도</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{metrics.estimated_treatment_period ?? 'N/A'}</div>
              <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>예상 기간</div>
            </div>
          </div>
        </div>
      )}
    </StyledChartPanel>
  );
};

export default ChartPanel;
