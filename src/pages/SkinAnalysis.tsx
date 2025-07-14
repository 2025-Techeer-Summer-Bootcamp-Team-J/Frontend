import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

// --- 1. 타입 정의 ---
interface SkinResult {
    title: string;
    subtitle: string;
    description: string;
    features: string[];
    care: string[];
}

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

// --- 5. 데이터 ---
const MOCK_RESULTS: SkinResult[] = [
    { title: '지성 피부', subtitle: '유분은 많지만, 잘 관리하면 건강한 피부', description: '피지 분비가 활발하여 얼굴 전체적으로 유분이 많고 번들거리는 타입입니다. 모공이 넓고 블랙헤드나 뾰루지 같은 트러블이 생기기 쉽지만, 유분 덕분에 피부 장벽이 튼튼하고 주름이 늦게 생기는 장점도 있습니다.', features: ['세안 후 얼마 지나지 않아 번들거림', '넓은 모공과 블랙헤드', '메이크업이 쉽게 지워지고 다크닝 발생', '뾰루지, 여드름 등 트러블 발생 빈도가 높음'], care: ['꼼꼼한 이중 세안으로 모공 속 노폐물 제거', '유분 조절 기능이 있는 가벼운 수분 제품 사용', '주 1~2회 각질 및 피지 제거', '오일프리(Oil-Free) 제품 위주로 사용'] },
    { title: '건성 피부', subtitle: '수분과 유분이 모두 부족한 상태', description: '세안 후 피부가 심하게 당기고, 각질이 쉽게 일어나며 피부결이 거칠게 느껴지는 타입입니다. 유수분 부족으로 피부 장벽이 약해 외부 자극에 민감하게 반응할 수 있으며, 잔주름이 생기기 쉽습니다.', features: ['세안 후 심한 속당김과 건조함', '피부결이 거칠고 각질이 잘 일어남', '잔주름이 쉽게 생김', '윤기가 없고 푸석푸석해 보임'], care: ['약산성 클렌저로 부드럽게 세안', '보습력이 강한 스킨케어 제품 사용 (세라마이드, 히알루론산)', '페이스 오일이나 보습 크림으로 마무리', '가습기 사용으로 실내 습도 유지'] },
    { title: '복합성 피부', subtitle: '부위별로 다른 피부 특성을 가진 타입', description: '이마, 코, 턱으로 이어지는 T존은 피지 분비가 많아 번들거리지만, 양 볼과 눈가의 U존은 건조한 특징을 동시에 가진 피부 타입입니다. 부위별로 다른 관리가 필요하여 가장 까다로울 수 있습니다.', features: ['T존(이마, 코)은 번들거리고 U존(볼)은 건조함', 'T존에만 모공이 넓고 블랙헤드가 있음', '계절에 따라 피부 상태 변화가 큼', '부위별로 다른 트러블 발생'], care: ['T존과 U존에 다른 제품을 사용하는 부위별 케어', '전체적으로는 유수분 밸런스를 맞춰주는 제품 선택', 'T존에는 가벼운 제품, U존에는 보습력이 좋은 제품 사용', '주기적인 각질 관리로 피부결 정돈'] },
];

const getMockResult = (): SkinResult => {
    return MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
};


// --- 6. React 컴포넌트 ---
const SkinAnalysis: React.FC = () => {
    type Section = 'upload' | 'analyzing' | 'result';
    const [currentSection, setCurrentSection] = useState<Section>('upload');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [analysisStatus, setAnalysisStatus] = useState<string>('초기화 중...');
    const [resultData, setResultData] = useState<SkinResult | null>(null);

    const uploadSectionRef = useRef<HTMLElement>(null);
    const analyzingSectionRef = useRef<HTMLElement>(null);
    const resultSectionRef = useRef<HTMLElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadAreaClick = useCallback(() => {
        // 이미 분석을 시작했으면 다시 업로드 창을 열지 않음
        if (currentSection !== 'upload') return;
        fileInputRef.current?.click();
    }, [currentSection]);

    const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                setUploadedImageUrl(imageUrl);
                setCurrentSection('analyzing');
            };
            reader.readAsDataURL(file);
        }
    }, []);
    
    const handleRestart = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setUploadedImageUrl(null);
        setResultData(null);
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

            analysisTimer = setTimeout(() => {
                setResultData(getMockResult());
                setCurrentSection('result');
            }, statuses.length * 1000);

        } else if (currentSection === 'result') {
            resultSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        return () => {
            clearTimeout(analysisTimer);
            clearInterval(statusInterval);
        };
    }, [currentSection]);
    
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
            </MainContainer>
        </PageWrapper>
    );
};

export default SkinAnalysis;