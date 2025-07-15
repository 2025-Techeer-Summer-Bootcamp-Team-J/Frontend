import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { analyzeSkinType } from '../services/skintypeApi';
import type { SkinTypeAnalysisResponse } from '../services/types';
import { AxiosError } from 'axios';

// --- 1. 타입 정의 ---
interface SkinResult {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    care: string[];
}

// API 응답을 UI용 SkinResult로 변환하는 함수
const convertApiResponseToSkinResult = (response: SkinTypeAnalysisResponse): SkinResult => {
    // 피부 타입별 기본 정보 (실제로는 별도 API나 데이터베이스에서 가져와야 함)
    const skinTypeInfo = {
        1: {
            name: "지성 피부",
            description: "유분 분비가 활발하여 번들거림이 있지만 수분 보유력이 좋은 피부 타입입니다.",
            characteristics: ["T존 유분 과다", "모공이 뚜렷함", "여드름 발생 가능성 높음", "화장이 잘 지워짐"],
            care: ["유분 조절 토너 사용", "주 2-3회 딥클렌징", "수분 크림보다 젤 타입 제품 사용", "자외선 차단제 필수"]
        },
        2: {
            name: "중성 피부",
            description: "유분과 수분의 균형이 잘 맞는 이상적인 피부 타입으로, 트러블이 적고 탄력이 좋습니다.",
            characteristics: ["적당한 유분과 수분", "모공이 작고 깔끔함", "트러블이 적음", "탄력이 좋음"],
            care: ["기본적인 세안과 보습", "주 1-2회 각질 제거", "계절에 맞는 보습 제품 사용", "꾸준한 자외선 차단"]
        },
        3: {
            name: "건성 피부",
            description: "유분과 수분이 부족하여 당김과 각질이 생기기 쉬운 피부 타입입니다.",
            characteristics: ["피부 당김 현상", "각질 발생", "모공이 작음", "주름 생기기 쉬움"],
            care: ["풍부한 보습 크림 사용", "각질 제거는 주 1회", "오일 제품 활용", "수분 공급 집중 관리"]
        },
        4: {
            name: "복합성 피부",
            description: "T존은 지성, U존은 건성의 특징을 보이는 가장 흔한 피부 타입입니다.",
            characteristics: ["T존 유분 과다", "U존 건조함", "부위별 다른 관리 필요", "계절 변화에 민감"],
            care: ["부위별 맞춤 관리", "T존은 유분 조절, U존은 보습", "순한 세안제 사용", "부분별 다른 제품 사용"]
        },
        5: {
            name: "민감성 피부",
            description: "외부 자극에 쉽게 반응하여 붉어지거나 트러블이 생기기 쉬운 피부 타입입니다.",
            characteristics: ["쉽게 붉어짐", "자극에 민감", "알레르기 반응 가능", "얇고 예민한 피부"],
            care: ["무향, 무색소 제품 사용", "패치 테스트 필수", "순한 세안제 사용", "자극적인 성분 피하기"]
        }
    };

    const skinTypeCode = response.data.skin_type_code;
    const defaultInfo = skinTypeInfo[skinTypeCode as keyof typeof skinTypeInfo] || {
        name: response.data.skin_type_name,
        description: `${response.data.skin_type_name}으로 분석되었습니다.`,
        characteristics: ["개인별 특성에 따라 다를 수 있습니다."],
        care: ["전문가와 상담하여 맞춤 관리를 받으시기 바랍니다."]
    };

    return {
        title: defaultInfo.name,
        subtitle: response.data.skin_type_name,
        description: defaultInfo.description,
        features: defaultInfo.characteristics,
        care: defaultInfo.care
    };
};

// --- 2. 글로벌 스타일 및 테마 ---
const theme = {
    primaryColor: '#0052ff',
    lightPrimaryColor: '#e9efff',
    darkPrimaryColor: '#0041cc',
    textColor: '#333',
    lightTextColor: '#666',
    bgColor: '#f0f4ff',
    cardBgColor: '#ffffff',
};

const GlobalStyle = createGlobalStyle`
    /* Google Noto Sans KR 폰트 import */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

    html {
        scroll-behavior: smooth;
    }

    body {
        font-family: 'Noto Sans KR', sans-serif;
        margin: 0;
        background-color: ${() => theme.bgColor};
        color: ${() => theme.textColor};
    }
`;

// --- 3. 애니메이션 (Keyframes) ---
const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(1.25rem); }
    to { opacity: 1; transform: translateY(0); }
`;

const scan = keyframes`
    0% { top: 0; }
    100% { top: 100%; }
`;

// --- 4. 스타일 컴포넌트 ---

const PageWrapper = styled.div`
  background-color: ${() => theme.bgColor};
  width: 100%;
  min-height: 100vh;
  padding: 0.1px; /* 👈 [추가된 부분] 자식 margin 상쇄를 방지하는 트릭 */
`;

const MainContainer = styled.main`
    text-align: center;
    padding: 0 1.25rem;
    width: 100%;
    max-width: 62.5rem;
    box-sizing: border-box;
    margin: 1.25rem auto;
`;

const PageSection = styled.section<{ $isFadedIn?: boolean }>`
    padding: 3.75rem 0;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    opacity: 0;
    animation: ${({ $isFadedIn }) => $isFadedIn ? fadeIn : 'none'} 0.8s ease-out forwards;
    
    &:first-child {
        padding-top: 1.25rem;
    }
`;

const MainTitle = styled.h1`
    font-size: clamp(2rem, 5vw, 2.5rem);
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.625rem;
`;

const MainSubtitle = styled.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: ${theme.lightTextColor};
    margin-bottom: 2.5rem;
`;

const ContentBox = styled.div`
    background-color: ${theme.cardBgColor};
    border-radius: 1.25rem;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 56.25rem;
    margin: 0 auto;
    box-shadow: 0 0.25rem 1.25rem rgba(0, 82, 255, 0.05);
    text-align: left;
    gap: 2.5rem;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

const Guidelines = styled.div`
    width: 100%;
    h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 1.5rem;
        color: ${theme.primaryColor};
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
    }
    @media (min-width: 768px) { flex-basis: 50%; }
`;

const GuidelineItem = styled.div`
    background-color: ${theme.lightPrimaryColor};
    padding: 1.125rem 1.5rem;
    border-radius: 0.625rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    i {
        margin-right: 1rem;
        color: ${theme.primaryColor};
        flex-shrink: 0;
        width: 1.2em;
        text-align: center;
    }
`;

const UploadArea = styled.div`
    width: 100%;
    height: 18.75rem;
    border: 2px dashed #d0d8e8;
    border-radius: 0.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f9faff;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
    &:hover {
        border-color: ${theme.primaryColor};
        background-color: #f0f4ff;
    }
    @media (min-width: 768px) { flex-basis: 50%; }
`;

const UploadAreaContent = styled.div`
    text-align: center;
    color: #888;
    font-weight: 500;
    i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #ccc;
    }
`;

const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
`;

const AnalysisStartButton = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: 2rem;
    padding: 1.25rem 2.5rem;
    background-color: ${theme.primaryColor};
    color: white;
    border: none;
    border-radius: 0.625rem;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s;
    box-shadow: 0 0.25rem 1rem rgba(0, 82, 255, 0.2);
    
    &:hover {
        background-color: ${theme.darkPrimaryColor};
        transform: translateY(-2px);
        box-shadow: 0 0.375rem 1.25rem rgba(0, 82, 255, 0.3);
    }
    
    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
    
    i {
        font-size: 1.2em;
    }
`;

const ScannerAnimation = styled.div<{ $imageUrl?: string }>`
    width: 9.375rem;
    height: 9.375rem;
    position: relative;
    border-radius: 50%;
    border: 3px solid ${theme.lightPrimaryColor};
    background-image: url(${({ $imageUrl }) => $imageUrl || 'https://placehold.co/150x150/ffffff/cccccc?text=Face'});
    background-size: cover;
    background-position: center;
    overflow: hidden;
`;

const ScannerLine = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(0, 82, 255, 0.7), transparent);
    animation: ${scan} 3s linear infinite;
`;

const AnalyzingText = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-top: 2rem;
`;

const AnalyzingStatus = styled.p`
    font-size: 1rem;
    color: ${theme.lightTextColor};
    margin-top: 0.625rem;
    min-height: 1.5rem;
    transition: all 0.3s;
`;

const ResultHeader = styled.div`
    text-align: center;
    margin-bottom: 2.5rem;
    width: 100%;
`;

const ResultCard = styled.div`
    background: ${theme.cardBgColor};
    border-radius: 1.25rem;
    padding: 2rem;
    box-shadow: 0 0.25rem 1.25rem rgba(0, 82, 255, 0.05);
    width: 100%;
    max-width: 56.25rem;
    box-sizing: border-box;
    text-align: left;
`;

const ResultTitle = styled.h2`
    font-size: clamp(1.5rem, 4vw, 1.8rem);
    font-weight: 700;
    color: ${theme.primaryColor};
    margin: 0 0 0.25rem 0;
`;

const ResultSubtitle = styled.h3`
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 500;
    color: ${theme.textColor};
    margin: 0 0 1.25rem 0;
`;

const ResultDescription = styled.p`
    font-size: 1rem;
    line-height: 1.7;
    color: #555;
    margin: 0;
`;

const ResultGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.875rem;
    width: 100%;
    max-width: 56.25rem;
    margin-top: 1.875rem;
    @media (min-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const ResultSectionTitle = styled.h4`
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 1.25rem 0;
    padding-bottom: 0.625rem;
    border-bottom: 2px solid ${theme.lightPrimaryColor};
    display: flex;
    align-items: center;
    i {
        margin-right: 0.625rem;
        color: ${theme.primaryColor};
    }
`;

const ResultList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    li {
        background-color: #f9faff;
        padding: 1rem;
        border-radius: 0.5rem;
        margin-bottom: 0.625rem;
        color: ${theme.textColor};
        font-weight: 500;
    }
`;

const RestartButton = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 0.625rem;
    margin-top: 2.5rem;
    padding: 1rem 2rem;
    background-color: ${theme.primaryColor};
    color: white;
    border: none;
    border-radius: 0.625rem;
    cursor: pointer;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.3s;
    box-shadow: 0 0.25rem 1rem rgba(0, 82, 255, 0.2);
    text-decoration: none;
    &:hover {
        background-color: ${theme.darkPrimaryColor};
        transform: translateY(-2px);
        box-shadow: 0 0.375rem 1.25rem rgba(0, 82, 255, 0.3);
    }
    i {
        font-size: 1em;
    }
`;






// --- 6. React 컴포넌트 ---
const SkinAnalysis: React.FC = () => {
    type Section = 'upload' | 'analyzing' | 'result' | 'error';
    const [currentSection, setCurrentSection] = useState<Section>('upload');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState<string>('초기화 중...');
    const [resultData, setResultData] = useState<SkinResult | null>(null);
    const [hasAnalyzed, setHasAnalyzed] = useState<boolean>(false);
    const [analysisError, setAnalysisError] = useState<string | null>(null);
    const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);

    const uploadSectionRef = useRef<HTMLElement>(null);
    const analyzingSectionRef = useRef<HTMLElement>(null);
    const resultSectionRef = useRef<HTMLElement>(null);
    const errorSectionRef = useRef<HTMLElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 임시 사용자 ID (실제로는 로그인 상태에서 가져와야 함)
    const userId = 1;

    // API로 피부 분석 요청
    const performSkinAnalysis = useCallback(async (imageFile: File) => {
        try {
            setAnalysisError(null);
            console.log('피부 분석 시작:', { userId, imageFile: imageFile.name, size: imageFile.size });
            
            // 피부 타입 분석 API 호출
            const analysisResponse = await analyzeSkinType(userId, { image: imageFile });
            console.log('분석 응답:', analysisResponse);
            
            // 새로운 API 응답 구조에 맞게 결과 처리
            const skinResult = convertApiResponseToSkinResult(analysisResponse);
            console.log('최종 결과 데이터:', skinResult);
            
            setResultData(skinResult);
            setHasAnalyzed(true);
            setCurrentSection('result');
        } catch (error) {
            console.error('피부 분석 실패:', error);
            let errorMessage = '분석 중 오류가 발생했습니다.';
            
            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (error && typeof error === 'object' && 'response' in error) {
                // Axios 에러인 경우
                const axiosError = error as AxiosError<{ error?: string }>;
                if (axiosError.response?.data?.error) {
                    errorMessage = axiosError.response.data.error;
                } else if (axiosError.response?.status === 404) {
                    errorMessage = 'API 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.';
                } else if (axiosError.response?.status && axiosError.response.status >= 500) {
                    errorMessage = '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
                } else if (axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ECONNREFUSED') {
                    errorMessage = '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.';
                }
            }
            
            setAnalysisError(errorMessage);
            setCurrentSection('error');
        }
    }, [userId]);

    const handleUploadAreaClick = useCallback(() => {
        // 이미 분석을 시작했으면 다시 업로드 창을 열지 않음
        if (currentSection !== 'upload' || hasAnalyzed) return;
        fileInputRef.current?.click();
    }, [currentSection, hasAnalyzed]);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && !hasAnalyzed) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setUploadedImageUrl(imageUrl);
                setUploadedFile(file);
                setIsImageUploaded(true);
                // 자동으로 analyzing 섹션으로 이동하지 않음
            };
            reader.readAsDataURL(file);
        }
    }, [hasAnalyzed]);

    // 분석 시작 버튼 클릭 핸들러
    const handleStartAnalysis = useCallback(() => {
        if (uploadedFile && !hasAnalyzed) {
            setCurrentSection('analyzing');
        }
    }, [uploadedFile, hasAnalyzed]);
    
    const handleRestart = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setUploadedImageUrl(null);
        setUploadedFile(null);
        setResultData(null);
        setHasAnalyzed(false);
        setAnalysisError(null);
        setIsImageUploaded(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setCurrentSection('upload');
    }, []);

    useEffect(() => {
        let analysisTimer: ReturnType<typeof setTimeout>;
        let statusInterval: ReturnType<typeof setInterval>;

        if (currentSection === 'upload') {
            uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (currentSection === 'analyzing') {
            analyzingSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            const statuses = ["모공 패턴 분석 중...", "유분량 측정 중...", "수분 레벨 확인 중...", "피부톤 분석 중...", "트러블 요인 확인 중...", "결과를 종합하는 중..."];
            let statusIndex = 0;
            setAnalysisStatus(statuses[statusIndex]);

            statusInterval = setInterval(() => {
                statusIndex++;
                if (statusIndex < statuses.length) {
                    setAnalysisStatus(statuses[statusIndex]);
                }
            }, 1000);

            // API 호출 (1회만 실행되도록 hasAnalyzed 체크)
            analysisTimer = setTimeout(() => {
                if (uploadedFile && !hasAnalyzed) {
                    performSkinAnalysis(uploadedFile);
                }
            }, statuses.length * 1000);

        } else if (currentSection === 'result') {
            resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (currentSection === 'error') {
            errorSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return () => {
            clearTimeout(analysisTimer);
            clearInterval(statusInterval);
        };
    }, [currentSection, uploadedFile, hasAnalyzed, performSkinAnalysis]);
    
    return (
        <PageWrapper>
            <GlobalStyle />
            <MainContainer>
                {/* 섹션 1: 사진 업로드 (항상 보임) */}
                <PageSection ref={uploadSectionRef} $isFadedIn={true}>
                    <MainTitle>나의 피부 유형 바로 알기</MainTitle>
                    <MainSubtitle>AI가 당신의 피부 타입을 분석하고, 유형별 특징과 통계를 제공합니다.</MainSubtitle>
                    <ContentBox>
                        <Guidelines>
                            <h3><i className="fas fa-camera-retro" /> 촬영 가이드</h3>
                            <GuidelineItem><i className="fas fa-user" /> 정면을 응시하고, 머리카락이 얼굴을 가리지 않게 하세요.</GuidelineItem>
                            <GuidelineItem><i className="fas fa-lightbulb" /> 그림자 없는 밝은 조명 아래에서 선명하게 촬영하세요.</GuidelineItem>
                            <GuidelineItem><i className="fas fa-tint-slash" /> 화장기 없는 맨 얼굴에서 가장 정확한 분석이 가능합니다.</GuidelineItem>
                        </Guidelines>
                        <UploadArea onClick={handleUploadAreaClick} style={{ cursor: currentSection === 'upload' ? 'pointer' : 'default' }}>
                            {/* 업로드 이후에도 이미지가 보이도록 수정 */}
                            {!uploadedImageUrl && (
                                <UploadAreaContent>
                                    <i className="fas fa-cloud-upload-alt" />
                                    <p>클릭하여 사진 업로드</p>
                                </UploadAreaContent>
                            )}
                            {uploadedImageUrl && <PreviewImage src={uploadedImageUrl} alt="업로드 이미지 미리보기" />}
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} accept="image/*" disabled={currentSection !== 'upload'} />
                        </UploadArea>
                    </ContentBox>
                    
                    {/* 사진 업로드 후 분석 시작 버튼 표시 */}
                    {isImageUploaded && currentSection === 'upload' && (
                        <AnalysisStartButton onClick={handleStartAnalysis}>
                            <i className="fas fa-brain" />
                            AI 피부 분석 시작하기
                        </AnalysisStartButton>
                    )}
                </PageSection>

                {/* 섹션 2: 분석 중 (업로드 이후에 보임) */}
                {(currentSection === 'analyzing' || currentSection === 'result') && (
                    <PageSection ref={analyzingSectionRef} $isFadedIn={true}>
                        <ScannerAnimation $imageUrl={uploadedImageUrl || undefined}>
                            {currentSection === 'analyzing' && <ScannerLine />}
                        </ScannerAnimation>
                        <AnalyzingText>
                            {currentSection === 'analyzing' ? 'AI가 피부를 분석하고 있습니다.' : 'AI 피부 분석 완료'}
                        </AnalyzingText>
                        <AnalyzingStatus>
                            {currentSection === 'analyzing' ? analysisStatus : '아래에서 진단 결과를 확인하세요.'}
                        </AnalyzingStatus>
                    </PageSection>
                )}
                
                {/* 섹션 3: 결과 (분석 완료 후에 보임) */}
                {currentSection === 'result' && resultData && (
                    <PageSection ref={resultSectionRef} $isFadedIn={true}>
                        <ResultHeader>
                            <MainTitle>AI 피부 진단 결과</MainTitle>
                            <MainSubtitle>당신의 피부 타입과 맞춤 관리법을 확인해보세요.</MainSubtitle>
                        </ResultHeader>
                        
                        <ResultCard>
                            <ResultTitle>{resultData.title}</ResultTitle>
                            <ResultSubtitle>{resultData.subtitle}</ResultSubtitle>
                            <ResultDescription>{resultData.description}</ResultDescription>
                        </ResultCard>
                        
                        <ResultGrid>
                            <ResultCard>
                                <ResultSectionTitle><i className="fas fa-list-check" /> 주요 특징</ResultSectionTitle>
                                <ResultList>
                                    {resultData.features.map((item, index) => <li key={index}>{item}</li>)}
                                </ResultList>
                            </ResultCard>
                            <ResultCard>
                                <ResultSectionTitle><i className="fas fa-hand-holding-heart" /> 추천 관리법</ResultSectionTitle>
                                <ResultList>
                                    {resultData.care.map((item, index) => <li key={index}>{item}</li>)}
                                </ResultList>
                            </ResultCard>
                        </ResultGrid>

                        <RestartButton href="#upload" onClick={handleRestart}>
                           <i className="fas fa-redo" /> 처음부터 다시 진단하기
                        </RestartButton>
                    </PageSection>
                )}

                {/* 섹션 4: 에러 (분석 실패 시 보임) */}
                {currentSection === 'error' && (
                    <PageSection ref={errorSectionRef} $isFadedIn={true}>
                        <ResultHeader>
                            <MainTitle style={{ color: '#ff4757' }}>분석 중 오류가 발생했습니다</MainTitle>
                            <MainSubtitle> 조건에 맞는 사진을 확인하고 다시 시도해주세요.</MainSubtitle>
                        </ResultHeader>
                        
                        <ResultCard>
                            <ResultDescription style={{ color: '#ff4757', textAlign: 'center' }}>
                                <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }} />
                                {analysisError || '분석 중 알 수 없는 오류가 발생했습니다.'}
                            </ResultDescription>
                        </ResultCard>

                        <RestartButton href="#upload" onClick={handleRestart}>
                           <i className="fas fa-redo" /> 처음부터 다시 진단하기
                        </RestartButton>
                    </PageSection>
                )}
            </MainContainer>
        </PageWrapper>
    );
};

export default SkinAnalysis;