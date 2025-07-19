import React from 'react';

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaExclamationTriangle } from 'react-icons/fa';
import {
  Section,
  SectionHeading,
  SectionSubheading,
  NotoSansBlack,
  Grid,
  GlassmorphismCard,
  DiseaseListItem,
  IconWrapper,
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

ChartJS.register(ArcElement, Tooltip, Legend);

const skinTypeChartData = {
  labels: ['여드름', '과다 피지', '블랙헤드', '속건조'],
  datasets: [{
    data: [45, 25, 20, 10],
    backgroundColor: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa'],
    borderColor: 'rgba(255,255,255,0)',
    borderWidth: 5
  }]
};

const skinTypeChartOptions = {
  responsive: true,
  plugins: { legend: { position: 'bottom' as const, labels: { color: '#374151' } } }
};

const SkinTypeAnalysisSection: React.FC = () => {
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

        <Grid lg_cols="3" gap="2rem" align="stretch">
          <GlassmorphismCard style={{ textAlign: 'center', padding: '2rem', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
              피부 유형 진단 결과
            </h3>
            <div style={{ margin: '1rem 0' }}>
              <div style={{
                display: 'inline-block',
                background: 'rgba(219, 234, 254, 0.5)', /* bg-blue-100/50 */
                border: '1px solid rgba(191, 219, 254, 0.5)', /* border-blue-200/50 */
                color: '#1e40af', /* text-blue-800 */
                fontSize: '1.5rem',
                fontWeight: '700',
                padding: '1rem 1.5rem',
                borderRadius: '0.75rem'
              }}>
                수분 부족형 지성
              </div>
            </div>
            <p style={{ color: '#4b5563', maxWidth: '28rem', margin: '0 auto' }}>
              겉은 번들거리지만 속은 건조한 타입입니다. 유수분 밸런스를 맞추는 것이 중요합니다.
            </p>
          </GlassmorphismCard>

          <GlassmorphismCard style={{ padding: '2rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', fontWeight: '700', marginBottom: '1rem' }}>
              주의가 필요한 피부 질환
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <DiseaseListItem>
                <FaExclamationTriangle className="fa-icon" style={{ color: '#ef4444' }} />
                <span>여드름 및 뾰루지</span>
              </DiseaseListItem>
              <DiseaseListItem>
                <IconWrapper as={FaExclamationTriangle} color="#f97316" />
                <span>지루성 피부염</span>
              </DiseaseListItem>
              <DiseaseListItem>
                <IconWrapper as={FaExclamationTriangle} color="#eab308" />
                <span>모낭염</span>
              </DiseaseListItem>
            </ul>
          </GlassmorphismCard>

          <GlassmorphismCard style={{ padding: '2rem', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
                20대 여성 통계
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
                나와 같은 그룹의 피부 고민
              </p>
            </div>
            <div style={{ flexGrow: 1, position: 'relative' }}>
              <Doughnut data={skinTypeChartData} options={skinTypeChartOptions} />
            </div>
          </GlassmorphismCard>
        </Grid>
      </ContentWrapper>
    </Section>
  );
};

export default SkinTypeAnalysisSection;
