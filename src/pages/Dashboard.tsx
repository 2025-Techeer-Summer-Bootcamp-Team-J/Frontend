import React, { useEffect, useState } from 'react';
import { api } from '../services';
import type { DashboardData } from '../services/dashboardApi';
import styled, { css, createGlobalStyle } from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler, type ChartData, type ChartOptions
} from 'chart.js';
import { useUser } from "@clerk/clerk-react";

// Chart.js 모듈 등록
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
);

// --- SVG 아이콘 컴포넌트들 ---
const InfoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// --- 데이터 정의 ---
type DiagnosisStatus = '개선' | '유지' | '악화';

// --- 메인 대시보드 컴포넌트 ---

const Dashboard = () => {
    const { user, isLoaded } = useUser();

    // Clerk 기본 정보
    let name = (user?.fullName ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()) || '미입력';
    if (name.startsWith('/') && name.includes(' ')) {
        name = name.substring(name.indexOf(' ') + 1);
    }
    const email = user?.primaryEmailAddress?.emailAddress ?? '미입력';
    const gender = user?.unsafeMetadata?.gender as string || '';
    const birthdate = user?.unsafeMetadata?.birthdate as string || '';

    const getGenderDisplay = (value: string) => {
        switch (value) {
            case 'male':
                return '남성';
            case 'female':
                return '여성';
            default:
                return '미입력';
        }
    };

    // 정보 수정 관련 상태
    const [isEditing, setIsEditing] = useState(false);
    const [editGender, setEditGender] = useState(gender);
    const [editBirthdate, setEditBirthdate] = useState(birthdate);
    const [isSaving, setIsSaving] = useState(false);
    const [userError, setUserError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            setEditGender(user.unsafeMetadata.gender as string || '');
            setEditBirthdate(user.unsafeMetadata.birthdate as string || '');
        }
    }, [user]);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUserError(null);
        // Reset to original values
        setEditGender(gender);
        setEditBirthdate(birthdate);
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        setUserError(null);

        try {
            await user.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    gender: editGender,
                    birthdate: editBirthdate,
                },
            });
            setIsEditing(false);
        } catch (err) {
            setUserError("정보 저장에 실패했습니다. 다시 시도해주세요.");
            console.error("Failed to update user metadata:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dashboardError, setDashboardError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Replace with actual user ID from authentication context
                const userId = 1;
                const response = await api.dashboard.getDashboard(userId);
                setDashboardData(response.data.data); // Access the 'data' field from the API response
            } catch (err) {
                setDashboardError('Failed to fetch dashboard data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return <BodyContainer><p>Loading dashboard...</p></BodyContainer>;
    }

    if (dashboardError) {
        return <BodyContainer><p>Error: {dashboardError}</p></BodyContainer>;
    }

    if (!dashboardData) {
        return <BodyContainer><p>No dashboard data available.</p></BodyContainer>;
    }

    // 차트 데이터 및 옵션
    const chartLabels = dashboardData.recent_skinType_scores?.map((score: any) => score.date) || [];
    
    const chartData: ChartData<'line'> = {
        labels: chartLabels,
        datasets: [{
            label: '피부 점수',
            data: dashboardData.recent_skinType_scores?.map((score: any) => score.score) || [],
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

    if (!isLoaded || !user) {
        return (
            <BodyContainer>
                <Main>
                    <div>Loading...</div>
                </Main>
            </BodyContainer>
        );
    }

    return (
        <>
            <GlobalFontStyle />
            <BodyContainer>
                <Main>
                    <PageTitle>
                        <h2>개인 맞춤형 대시보드</h2>
                        <p>{name}님의 피부 상태 변화를 기록하고, 한눈에 추적하세요.</p>
                    </PageTitle>

                    <DashboardGrid>
                        {/* 왼쪽 영역 */}
                        <MainContent>
                            {/* 피부 점수 차트 */}
                            <Card>
                                <CardTitle>피부 상태 점수 변화 (최근 30일)</CardTitle>
                                <ChartContainer>
                                    <Line options={chartOptions} data={chartData} />
                                </ChartContainer>
                            </Card>

                            {/* 최근 진단 기록 */}
                            <Card>
                                <CardTitle>최근 진단 기록</CardTitle>
                                <ListContainer>
                                    {dashboardData.recent_diagnosis_records?.map((item) => (
                                        <ListItem key={item.id}>
                                            <div>
                                                <p className="font-semibold text-gray-700">{item.disease_name || 'N/A'}</p>
                                                <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('ko-KR')}</p>
                                            </div>
                                            {/* Backend does not provide status, using a placeholder */}
                                            <StatusBadge status={'유지'}>유지</StatusBadge>
                                        </ListItem>
                                    ))}
                                </ListContainer>
                            </Card>
                        </MainContent>

                        {/* 오른쪽 사이드바 */}
                        <Sidebar>
                            {/* 내 정보 */}
                            <Card>
                                <CardTitleContainer>
                                    <CardTitle>내 정보</CardTitle>
                                    {!isEditing && <EditButton onClick={handleEdit}>수정</EditButton>}
                                </CardTitleContainer>
                                <ProfileContent>
                                    <div>
                                        <ProfileLabel>이름</ProfileLabel>
                                        <ProfileValue>{name}</ProfileValue>
                                    </div>
                                    <div>
                                        <ProfileLabel>이메일</ProfileLabel>
                                        <ProfileValue>{email}</ProfileValue>
                                    </div>
                                    {isEditing ? (
                                        <>
                                            <FormRow>
                                                <ProfileLabel>성별</ProfileLabel>
                                                <select value={editGender} onChange={e => setEditGender(e.target.value)}>
                                                    <option value="">선택</option>
                                                    <option value="male">남성</option>
                                                    <option value="female">여성</option>
                                                </select>
                                            </FormRow>
                                            <FormRow>
                                                <ProfileLabel>생년월일</ProfileLabel>
                                                <input type="date" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} />
                                            </FormRow>
                                            {userError && <p style={{ color: 'red', fontSize: '0.875rem' }}>{userError}</p>}
                                            <ButtonContainer>
                                                <SaveButton onClick={handleSave} disabled={isSaving}>
                                                    {isSaving ? '저장 중...' : '저장'}
                                                </SaveButton>
                                                <CancelButton onClick={handleCancel}>취소</CancelButton>
                                            </ButtonContainer>
                                        </>
                                    ) : (
                                        <>
                                            <div>
                                                <ProfileLabel>성별</ProfileLabel>
                                                <ProfileValue>{getGenderDisplay(gender)}</ProfileValue>
                                            </div>
                                            <div>
                                                <ProfileLabel>생년월일</ProfileLabel>
                                                <ProfileValue>{birthdate || '미입력'}</ProfileValue>
                                            </div>
                                        </>
                                    )}
                                    <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />
                                    <div>
                                        <ProfileLabel>피부 타입</ProfileLabel>
                                        <ProfileValue>민감성 수부지</ProfileValue>
                                    </div>
                                    <div>
                                        <ProfileLabel>주요 고민 부위</ProfileLabel>
                                        <TagContainer>
                                            <Tag color="blue">아토피</Tag>
                                            <Tag color="red">지루성 피부염</Tag>
                                        </TagContainer>
                                    </div>
                                    <div>
                                        <ProfileLabel style={{ marginBottom: '0.5rem' }}>주의사항 및 관리 팁</ProfileLabel>
                                        <TipList>
                                            <li>세라마이드 성분 보습제 사용 권장</li>
                                            <li>약산성 클렌저로 부드럽게 세안</li>
                                            <li>자외선 차단제 필수 사용</li>
                                        </TipList>
                                    </div>
                                </ProfileContent>
                            </Card>

                            {/* 피부 지식 */}
                            <Card>
                                <CardTitle>피부 지식</CardTitle>
                                <KnowledgeContainer>
                                    <InfoBox color="blue">
                                        <InfoTitle><InfoIcon /> 보습의 골든타임</InfoTitle>
                                        <InfoText>샤워 후 3분 안에 보습제를 발라주면 피부 수분 손실을 효과적으로 막을 수 있어요.</InfoText>
                                    </InfoBox>
                                    <InfoBox color="yellow">
                                        <InfoTitle><WarningIcon /> 자외선 차단제의 진실</InfoTitle>
                                        <InfoText>흐린 날에도 자외선은 존재해요. 날씨와 상관없이 자외선 차단제를 사용하는 습관이 중요합니다.</InfoText>
                                    </InfoBox>
                                </KnowledgeContainer>
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

const CardTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const EditButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background-color: #f9fafb;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  flex-grow: 1;
  padding: 0.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  &:disabled {
    background-color: #9ca3af;
  }
`;

const CancelButton = styled.button`
  flex-grow: 1;
  padding: 0.5rem;
  background-color: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
`;

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

const InfoFormCard = styled(Card)`
  background-color: #fffbe7;
  border: 1px solid #fde68a;

  button {
    padding: 0.5rem 1.2rem;
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }
  }
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #374151;
  }

  select, input {
    padding: 0.375rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    flex-grow: 1;
  }
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
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

const ChartContainer = styled.div`
  height: 20rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  p { margin: 0; }
  .font-semibold { font-weight: 600; }
  .text-gray-700 { color: #374151; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-500 { color: #6b7280; }
`;

const statusStyles = {
  개선: css` background-color: #d1fae5; color: #065f46; `,
  유지: css` background-color: #fef3c7; color: #92400e; `,
  악화: css` background-color: #fee2e2; color: #991b1b; `,
};

const StatusBadge = styled.span<{ status: DiagnosisStatus }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  ${({ status }) => statusStyles[status]}
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProfileLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const ProfileValue = styled.p`
  font-weight: 600;
  color: #2563eb;
  margin: 0;
`;

const TagContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const Tag = styled.span<{ color: 'blue' | 'red' }>`
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  background-color: ${({ color }) => (color === 'blue' ? '#dbeafe' : '#fee2e2')};
  color: ${({ color }) => (color === 'blue' ? '#1e40af' : '#991b1b')};
`;

const TipList = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
  font-size: 0.875rem;
  color: #4b5563;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const KnowledgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoBox = styled.div<{ color: 'blue' | 'yellow' }>`
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ color }) => (color === 'blue' ? '#eff6ff' : '#fefce8')};
  h4, p { color: ${({ color }) => (color === 'blue' ? '#1d4ed8' : '#a16207')}; }
`;

const InfoTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin: 0;
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  margin: 0.5rem 0 0 0;
`;
