import React, { useEffect, useState } from 'react';
import { api } from '../services';
import type { DashboardData } from '../services/types';
import styled, { createGlobalStyle } from 'styled-components';
import { useUser } from "@clerk/clerk-react";
import { UserProfile, SkinScoreChart, RecentDiagnosisRecords, SkinKnowledgeCard } from '../components/Dashboard';

// --- 메인 대시보드 컴포넌트 ---

const Dashboard = () => {
    const { user, isLoaded } = useUser();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);

    // Clerk 기본 정보
    let name = (user?.fullName ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()) || '미입력';
    if (name.startsWith('/') && name.includes(' ')) {
        name = name.substring(name.indexOf(' ') + 1);
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Replace with actual user ID from authentication context
                const userId = 1;
                const response = await api.users.getDashboard(userId);
                setDashboardData(response);
            } catch (err) {
                setDashboardError('Failed to fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Clerk 로딩 중일 때만 로딩 화면 표시
    if (!isLoaded || !user) {
        return (
            <BodyContainer>
                <Main>
                    <div>사용자 정보를 불러오는 중...</div>
                </Main>
            </BodyContainer>
        );
    }

    // API 데이터가 없거나 에러가 있어도 기본 UI 표시
    const displayData = dashboardData || {
        recent_skinType_scores: [],
        recent_diagnosis_records: []
    };

    return (
        <>
            <GlobalFontStyle />
            <BodyContainer>
                <Main>
                    <PageTitle>
                        <h2>개인 맞춤형 대시보드</h2>
                        <p>{name}님의 피부 상태 변화를 기록하고, 한눈에 추적하세요.</p>
                        {loading && (
                            <StatusMessage $type="loading">
                                데이터를 불러오는 중...
                            </StatusMessage>
                        )}
                        {dashboardError && (
                            <StatusMessage $type="error">
                                일부 데이터를 불러올 수 없습니다. 새로고침을 시도해주세요.
                            </StatusMessage>
                        )}
                    </PageTitle>

                    <DashboardGrid>
                        {/* 왼쪽 영역 */}
                        <MainContent>
                            {/* 피부 점수 차트 */}
                            <Card>
                                <SkinScoreChart scores={displayData.recent_skinType_scores || []} />
                            </Card>

                            {/* 최근 진단 기록 */}
                            <Card>
                                <RecentDiagnosisRecords records={displayData.recent_diagnosis_records || []} />
                            </Card>
                        </MainContent>

                        {/* 오른쪽 사이드바 */}
                        <Sidebar>
                            {/* 내 정보 */}
                            <Card>
                                <UserProfile />
                            </Card>

                            {/* 피부 지식 */}
                            <Card>
                                <SkinKnowledgeCard />
                            </Card>
                        </Sidebar>
                    </DashboardGrid>
                </Main>
            </BodyContainer>
        </>
    );
};

export default Dashboard;

// --- Styled-Components 정의 ---

// 전역 스타일
const GlobalFontStyle = createGlobalStyle`
  body {
    font-family: 'Noto Sans KR', 'Inter', sans-serif;
    background-color: #f8f9fa;
    margin: 0;
  }
`;

// 레이아웃
const BodyContainer = styled.div`
  min-height: 100vh;
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  @media (min-width: 640px) {
    padding: 1.5rem;
  }
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
`;

const MainContent = styled.div`
  grid-column: span 1 / span 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 1024px) {
    grid-column: span 2 / span 2;
    gap: 2rem;
  }
`;

const Sidebar = styled.div`
  grid-column: span 1 / span 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (min-width: 1024px) {
    gap: 2rem;
  }
`;

const Card = styled.div`
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
`;

const PageTitle = styled.div`
  margin-bottom: 2rem;
  text-align: center;
  h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0;
  }
  p {
    color: #6b7280;
    margin-top: 0.25rem;
  }
`;

const StatusMessage = styled.div<{ $type: 'loading' | 'error' }>`
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  ${({ $type }) => $type === 'loading' 
    ? `
      background-color: #dbeafe;
      color: #1e40af;
      border: 1px solid #bfdbfe;
    ` 
    : `
      background-color: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    `
  }
`;
