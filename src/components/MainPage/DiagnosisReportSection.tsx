import React from 'react';
import styled from 'styled-components';
<<<<<<< HEAD
=======
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type TooltipItem } from 'chart.js';
import { FaCommentMedical, FaArrowLeft, FaRedo, FaDownload } from 'react-icons/fa';
import {
  Section,
  SectionHeading,
  SectionSubheading,
  NotoSansBlack,
  ReportItem,
  SeverityBar,
  SeverityBarInner,
} from './SharedStyles';
import { AIOpinionBox } from '../DiseaseAnalysisStep3/SharedStyles';
import { ContentWrapper as LayoutContentWrapper } from '../../components/Layout';
>>>>>>> origin/develop

import mainSkinPhoto from '../../assets/AI 피부 진단 메인 사진.jpeg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCamera,
  faFileMedical,
  faCircleInfo,
  faTriangleExclamation,
  faBookMedical,
} from '@fortawesome/free-solid-svg-icons';
// --- Styled Components Definition ---

const PageContainer = styled.section`
  background-color: #f0f9ff;
  padding: 3rem 1rem 3rem;
  @media (min-width: 640px) { padding: 4rem 1.5rem 4rem; }
  @media (min-width: 1024px) { padding: 5rem 2rem 5rem; }
`;

const ContentWrapper = styled.div`
  max-width: 80rem; margin-left: auto; margin-right: auto;
`;
const MainGrid = styled.main`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: start;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(5, 1fr);
    align-items: end;
  }
`;
const MainContentColumn = styled.div`
  display: flex; flex-direction: column; gap: 2.5rem; order: 2;
  @media (min-width: 1024px) { grid-column: span 3 / span 3; }
`;
const PageHeading = styled.div`
  text-align: left;
  h1 {
    font-size: 1.875rem; font-weight: 600; color: #1f2937;
    padding-left: 1rem;
    @media (min-width: 640px) { font-size: 2.25rem; }
  }
  p { margin-top: 0.75rem; color: #4b5563; font-size: 1.125rem;
    padding-left: 1rem;
  }

`;
const InfoSection = styled.div``;
const InfoGrid = styled.div`
  display: grid; grid-template-columns: 1fr; gap: 1.5rem;
  @media (min-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`;

// [수정] InfoCard의 h3 스타일을 ::before 가상 요소를 사용하도록 변경합니다.
const InfoCard = styled.div`
  background-color: #f5fbffff; 
  padding: 1.1rem; border-radius: 0.75rem;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(118, 177, 255, 0.2);
  transition: box-shadow 0.3s ease;
  &:hover { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
  
  h3 {
    position: relative; /* ::before의 기준점이 되도록 설정 */
    font-size: 1.125rem;
    font-weight: 700;
    color: #374151; /* 선과 색을 분리하기 위해 글자색은 기본으로 변경 */
    
    /* 1. 선과 글자 사이 여백 조절 */
    padding-left: 1rem; /* 이 값을 조절하여 여백을 변경할 수 있습니다. */

    /* 2. ::before 가상 요소를 이용해 새로운 선 생성 */
    &::before {
      content: '';
      position: absolute;
      left: 0;
      
      /* 3. 선의 높이 조절 */
      top: 0.125rem;    /* 위에서 살짝 띄워서 선을 짧게 만듭니다. */
      bottom: 0.125rem; /* 아래에서 살짝 띄워서 선을 짧게 만듭니다. */
      /* 만약 글자 높이에 꽉 맞추고 싶다면 top: 0; bottom: 0; 으로 설정하세요. */
      
      width: 4px; /* 선의 두께 */
      background-color: #05A6FD; /* 선의 색상 */
      border-radius: 2px; /* 선의 끝을 부드럽게 */
    }
  }

  p { margin-top: 0.5rem; color: #4b5563; font-size: 0.875rem; }
  
  @media (min-width: 768px) {
    &.md-col-span-2 {
      grid-column: span 2 / span 2;
    }
  }
`;

const ResultPanel = styled.aside`
  order: 1;
  background-color: white; border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 1.25rem;
  @media (min-width: 1024px) { grid-column: span 2 / span 2; }
`;
const ResultTitle = styled.h2`
  font-size: 1.125rem; font-weight: 700; text-align: center; color: #1f2937;
  margin-bottom: 1.25rem;
`;
const ResultContentGrid = styled.div`
  display: flex; flex-direction: column;
  gap: 0.75rem;
`;
const ResultCardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const ResultCard = styled.div`
  /* background-color: F0F9FF; border: 1px solid #e5e7eb; border-radius: 0.75rem; */
  border-radius: 0.75rem;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(112, 147, 243, 0.2);
  padding: 0.875rem;
  h3 {
    font-size: 0.875rem; font-weight: 700; color: #05A6FD; display: flex; align-items: center;
    margin-bottom: 0.75rem;
    svg {
      width: 0.75rem; height: 0.75rem;
      margin-right: 0.3rem; color: #05A6FD;
    }
  }
`;
const SummaryResultCard = styled(ResultCard)`
  display: flex;
  flex-direction: column;
`;
const SummaryContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  font-size: 0.68rem;
  margin-bottom: 0.75rem; /* 이 줄을 추가하세요. */
  .summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label { color: #6b7280; }
    .value-disease { font-weight: 600; color: #05A6FD; }
    .value { font-weight: 600; color: #1f2937; }
  }
`;
const AiOpinionBox = styled.div`
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: auto;
  h4 {
    font-weight: 700; color: #05A6FD; font-size: 0.68rem;
    display: flex; align-items: center; margin-bottom: 0.25rem;
    svg { width: 0.55rem; height: 0.55rem; margin-right: 0.2rem; }
  }
  p {
    color: #05A6FD; font-size: 0.6rem; line-height: 1.5;
  }
`;
const AttachedImage = styled.div`
  aspect-ratio: 1 / 1;
  img { width: 100%; height: 100%; object-fit: cover; border-radius: 0.5rem; }
`;
const CardParagraph = styled.p`
  margin-top: 0; font-size: 0.68rem; color: #6b7280; line-height: 1.6;
`;
const ActionCard = styled.div`
  /* background-color: white; border: 1px solid #e5e7eb; */
  background-color: #E2E8F0;
  border-radius: 0.75rem;
  padding: 0.2rem; text-align: center;
  box-shadow: 0.1rem 0.1rem 0.4rem rgba(112, 147, 243, 0.2);
`;
const RetryButton = styled.button`
  color: #4b5563; font-weight: 600;
  font-size: 0.6rem;
  display: inline-flex; align-items: center; background: none; border: none; cursor: pointer;
  &:hover { color: #1f2937; }
  svg {
    width: 0.6rem; height: 0.6rem; margin-right: 0.5rem;
  }
`;

// --- React Component ---
const DiagnosisReportSection: React.FC = () => {
  const handleRetryAnalysis = () => { console.log("다시 분석하기 클릭"); };
  const diagnosisData = {
    diseaseName: "사마귀 또는 전염성 연속종",
    treatmentPeriod: "4-6주",
    aiOpinion: "바이러스성 피부 질환(사마귀/전염성 연속종)일 가능성이 높습니다.",
    imageUrl: mainSkinPhoto,
    description: "HPV 또는 MCV 바이러스 감염으로 발생하며, 접촉으로 전염될 수 있습니다.",
    precautions: "병변 접촉 및 개인 물품 공유를 피하고, 면역력이 약한 사람과의 접촉을 주의해야 합니다.",
    management: "정확한 진단을 위해 피부과 상담이 필요하며, 자가 치료는 권장되지 않습니다."
  };

  return (
<<<<<<< HEAD
    <PageContainer>
      <ContentWrapper>
        <MainGrid>
          {/* 왼쪽 열: AI 진단 결과 패널 */}
          <ResultPanel>
            <ResultTitle>AI 진단 결과</ResultTitle>
            <ResultContentGrid>
              <ResultCardGrid>
                 <ResultCard>
                   <h3><FontAwesomeIcon icon={faCamera} /> 첨부 사진</h3>
                   <AttachedImage><img src={diagnosisData.imageUrl} alt="AI 피부 진단 메인 사진" /></AttachedImage>
                 </ResultCard>
                <SummaryResultCard>
                  <h3><FontAwesomeIcon icon={faFileMedical} /> 종합 요약</h3>
                  <SummaryContent>
                    <div className="summary-item"><span className="label">의심 질환</span><span className="value-disease">{diagnosisData.diseaseName}</span></div>
                    <div className="summary-item"><span className="label">예상 치료 기간</span><span className="value">{diagnosisData.treatmentPeriod}</span></div>
                  </SummaryContent>
                  <AiOpinionBox>
                    <h4><FontAwesomeIcon icon={faFileMedical} /> AI 소견</h4>
                    <p>{diagnosisData.aiOpinion}</p>
                  </AiOpinionBox>
                </SummaryResultCard>
              </ResultCardGrid>
              <ResultCardGrid>
                <ResultCard>
                   <h3><FontAwesomeIcon icon={faCircleInfo} /> 상세 설명</h3>
                  <CardParagraph>{diagnosisData.description}</CardParagraph>
                </ResultCard>
                <ResultCard>
                   <h3><FontAwesomeIcon icon={faTriangleExclamation} /> 주의사항</h3>
                  <CardParagraph>{diagnosisData.precautions}</CardParagraph>
                </ResultCard>
              </ResultCardGrid>
              <ResultCard>
                  <h3><FontAwesomeIcon icon={faBookMedical} /> 관리법</h3>
                  <CardParagraph>{diagnosisData.management}</CardParagraph>
              </ResultCard>
              <ActionCard>
                <RetryButton onClick={handleRetryAnalysis}>
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4 9a9 9 0 0114.13-6.36M20 15a9 9 0 01-14.13 6.36" /></svg>
                  다시 분석하기
                </RetryButton>
              </ActionCard>
            </ResultContentGrid>
          </ResultPanel>
          
          {/* 오른쪽 열 */}
          <MainContentColumn>
            <PageHeading>
              <h1>AI 피부 질환 진단 서비스</h1>
              <p>AI가 당신의 피부를 분석하고 제공하는 결과 리포트를 확인하세요.</p>
            </PageHeading>
            <InfoSection>
              <InfoGrid>
                <InfoCard><h3>첨부사진</h3><p>진단을 위해 사용자가 업로드한 원본 사진을 보여주며, 피부 상태를 확인할 수 있습니다.</p></InfoCard>
                <InfoCard><h3>종합요약</h3><p>AI 분석 결과를 바탕으로 피부 상태를 한눈에 파악할 수 있도록 핵심 내용을 요약하여 제공합니다.</p></InfoCard>
                <InfoCard><h3>상세설명</h3><p>진단된 피부 질환의 원인, 증상, 그리고 현재 심각도에 대해 의학적 정보를 바탕으로 자세하게 설명합니다.</p></InfoCard>
                <InfoCard><h3>주의사항</h3><p>진단된 피부 질환을 악화시킬 수 있는 일상생활 속 습관이나 환경적 요인 등 피해야 할 점들을 안내합니다.</p></InfoCard>
                <InfoCard className="md-col-span-2"><h3>관리법</h3><p>질환 완화 및 피부 건강 개선을 위해 추천되는 스킨케어 방법, 식습관, 전문적인 관리법 등을 제안합니다.</p></InfoCard>
              </InfoGrid>
            </InfoSection>
          </MainContentColumn>
        </MainGrid>
      </ContentWrapper>
    </PageContainer>
=======
    <Section id="diagnosis-result" bg="#F0F9FF">
      <LayoutContentWrapper>
        <SectionHeading>
          <NotoSansBlack>AI 피부 질환 진단</NotoSansBlack>
        </SectionHeading>
        <SectionSubheading>
          사진 한 장으로 AI가 질환을 예측하고, 상세한 리포트를 제공합니다.
        </SectionSubheading>
        <ReportContainer>
          <DiagnosisGrid>
            {/* 왼쪽 패널 */}
            <LeftPanel>
              <h2 className="section-title">예상 질환 통계</h2>
              <NewChartWrapper>
                <Doughnut data={diagnosisChartData} options={diagnosisChartOptions} />
              </NewChartWrapper>
              <NewLegendContainer>
                {diagnosisChartData.labels.map((label, index) => (
                  <NewLegendItem key={label}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <NewLegendColorBox color={diagnosisChartData.datasets[0].backgroundColor[index] as string} />
                      <span style={{ color: '#334155' }}>{label}</span>
                    </div>
                    <span style={{ fontWeight: 'bold', color: '#1e293b' }}>{diagnosisChartData.datasets[0].data[index]}%</span>
                  </NewLegendItem>
                ))}
              </NewLegendContainer>
            </LeftPanel>

            {/* 오른쪽 패널 */}
            <RightPanel>
              <FullReportCard>
                <FullTabNav>
                  <FullTabButton onClick={() => setActiveTab('summary')} $isActive={activeTab === 'summary'}>요약</FullTabButton>
                  <FullTabButton onClick={() => setActiveTab('description')} $isActive={activeTab === 'description'}>상세 설명</FullTabButton>
                  <FullTabButton onClick={() => setActiveTab('precautions')} $isActive={activeTab === 'precautions'}>주의사항</FullTabButton>
                  <FullTabButton onClick={() => setActiveTab('management')} $isActive={activeTab === 'management'}>관리법</FullTabButton>
                </FullTabNav>
                <FullTabContentContainer>
                  {tabContent[activeTab]}
                </FullTabContentContainer>
              </FullReportCard>
              <FullActionsContainer>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <ActionButton><FaArrowLeft /><span>이전</span></ActionButton>
                  <ActionButton><FaRedo /><span>다시 분석</span></ActionButton>
                </div>
                <ActionButton primary fullWidth onClick={handleDownloadReport}>
                  <FaDownload /><span>리포트 내려받기</span>
                </ActionButton>
              </FullActionsContainer>
            </RightPanel>
          </DiagnosisGrid>
        </ReportContainer>
      </LayoutContentWrapper>
    </Section>
>>>>>>> origin/develop
  );
};

export default DiagnosisReportSection;