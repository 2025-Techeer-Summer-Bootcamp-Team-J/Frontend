import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { diagnosesApi } from '../services';
import type { DiagnosisDetail } from '../services/types';
import DetailsPanel from '../components/DiseaseAnalysisStep3/DetailsPanel';
import type { TabType } from '../components/DiseaseAnalysisStep3/DetailsPanel';
import styled from 'styled-components';
import { ContentWrapper } from '../components/Layout';
import ChartPanel from '../components/DiseaseAnalysisStep3/ChartPanel';
import { MainContent } from '../components/DiseaseAnalysisStep3/SharedStyles';

// 진단 상세 페이지 컨테이너
const PageWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1rem 4rem;
`;

const DiagnosisDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<DiagnosisDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  

  // id가 없으면 대시보드로
  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
      return;
    }

    const fetchDetail = async () => {
      try {
        const data = await diagnosesApi.getById(Number(id));
        setDetail(data.data); // API 응답 구조: { code, message, data }
      } catch (err) {
        console.error(err);
        setError('진단 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  if (loading) return <PageWrapper>불러오는 중...</PageWrapper>;
  if (error || !detail) return <PageWrapper>{error ?? '진단 정보를 찾을 수 없습니다.'}</PageWrapper>;

  const diseaseInfo = {
    disease_name: detail.image_analysis.disease_name,
    confidence: detail.image_analysis.confidence,
  };

  const streamingContent = {
    summary: detail.text_analysis.ai_opinion,
    description: detail.text_analysis.detailed_description,
    precautions: detail.text_analysis.precautions,
    management: detail.text_analysis.management,
  };

  const analysisMetrics = {
    skin_score: detail.image_analysis.skin_score,
    severity: detail.image_analysis.severity,
    estimated_treatment_period: detail.image_analysis.estimated_treatment_period,
  };

  return (
    <ContentWrapper>
      <MainContent>
        <ChartPanel analysisResult={{ disease_name: diseaseInfo.disease_name, confidence: diseaseInfo.confidence }} />
        <DetailsPanel
        imageUrls={detail.image_base64 ? [detail.image_base64] : []}
        diseaseInfo={diseaseInfo}
        streamingContent={streamingContent}
        analysisMetrics={analysisMetrics}
        activeTab={activeTab}
        isStreaming={false}
        isComplete={true}
        isSaved={true}
        isSaving={false}
        setActiveTab={setActiveTab}
        onSave={() => {}}
        onRestart={() => navigate('/disease-analysis-step1')}
      />
      </MainContent>
    </ContentWrapper>
  );
};

export default DiagnosisDetailPage;
