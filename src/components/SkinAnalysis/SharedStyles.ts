import styled, { createGlobalStyle, keyframes } from 'styled-components';

export const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(1.25rem); }
    to { opacity: 1; transform: translateY(0); }
`;

export const scan = keyframes`
    0% { top: 0; }
    100% { top: 100%; }
`;

export const theme = {
    primaryColor: '#0052ff',
    lightPrimaryColor: '#e9efff',
    darkPrimaryColor: '#0041cc',
    textColor: '#333',
    lightTextColor: '#666',
    bgColor: '#f0f4ff',
    cardBgColor: '#ffffff',
};

export const GlobalStyle = createGlobalStyle`
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

export const PageWrapper = styled.div`
  background-color: ${() => theme.bgColor};
  width: 100%;
  min-height: 100vh;
  padding: 0.1px; /* 👈 [추가된 부분] 자식 margin 상쇄를 방지하는 트릭 */
`;

export const MainContainer = styled.main`
    text-align: center;
    padding: 0 1.25rem;
    width: 100%;
    max-width: 62.5rem;
    box-sizing: border-box;
    margin: 1.25rem auto;
`;

export const PageSection = styled.section<{ $isFadedIn?: boolean }>`
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
        scroll-margin-top: 10rem;
    }
`;

export const MainTitle = styled.h1`
    font-size: clamp(2rem, 5vw, 2.5rem);
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.625rem;
`;

export const MainSubtitle = styled.p`
    font-size: clamp(0.9rem, 2vw, 1.1rem);
    color: ${theme.lightTextColor};
    margin-bottom: 2.5rem;
`;

export const ContentBox = styled.div`
    background-color: ${theme.cardBgColor};
    border-radius: 3.2rem;
    padding: 2.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    width: 100%;
    max-width: 56.25rem;
    margin: 0 auto;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(71, 69, 179, 0.2);
    text-align: left;
    gap: 2.5rem;
    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

export const Guidelines = styled.div`
    width: 100%;
    h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-top: 0;
        margin-bottom: 2rem;
        color: ${theme.primaryColor};
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.625rem;
    }
    @media (min-width: 768px) { flex-basis: 50%; }
`;

export const GuidelineItem = styled.div`
    background-color: ${theme.lightPrimaryColor};
    padding: 1.3rem 1.5rem;
    border-radius: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.95rem;
    font-weight: 500;
    display: flex;
    align-items: center;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

     &:last-child {
        margin-bottom: 0; /* 마지막 항목의 아래 여백만 제거 */
    }

    svg {
        margin-right: 1rem;
        color: ${theme.primaryColor};
        flex-shrink: 0;
        width: 1.2em;
        text-align: center;
    }
`;

export const UploadArea = styled.div`
    width: 100%;
    height: 18.75rem;
    border: 2px dashed #d0d8e8;
    border-radius: 1.2rem;
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

export const UploadAreaContent = styled.div`
    text-align: center;
    color: #888;
    font-weight: 500;
    i {
        font-size: 3rem;
        margin-bottom: 1rem;
        color: #ccc;
    }
`;

export const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
`;

export const AnalysisStartButton = styled.button`
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

export const ScannerAnimation = styled.div<{ $imageUrl?: string }>`
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

export const ScannerLine = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(0, 82, 255, 0.7), transparent);
    animation: ${scan} 3s linear infinite;
`;

export const AnalyzingText = styled.h2`
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-top: 2rem;
`;

export const AnalyzingStatus = styled.p`
    font-size: 1rem;
    color: ${theme.lightTextColor};
    margin-top: 0.625rem;
    min-height: 1.5rem;
    transition: all 0.3s;
`;

export const ResultHeader = styled.div`
    text-align: center;
    margin-bottom: 2.5rem;
    width: 100%;
`;

export const ResultCard = styled.div`
    background: ${theme.cardBgColor};
    border-radius: 3.2rem;
    padding: 2rem;
    box-shadow: 0.25rem 0.25rem 0.5rem rgba(71, 69, 179, 0.2);
    width: 100%;
    max-width: 56.25rem;
    box-sizing: border-box;
    text-align: left;
`;

export const ResultTitle = styled.h2`
    font-size: clamp(1.5rem, 4vw, 1.8rem);
    font-weight: 700;
    color: ${theme.primaryColor};
    margin: 0 0 0.25rem 0;
`;

export const ResultSubtitle = styled.h3`
    font-size: clamp(1rem, 3vw, 1.1rem);
    font-weight: 500;
    color: ${theme.textColor};
    margin: 0 0 1.25rem 0;
`;

export const ResultDescription = styled.p`
    font-size: 1rem;
    line-height: 1.7;
    color: #555;
    margin: 0;
`;

export const ResultGrid = styled.div`
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

export const ResultSectionTitle = styled.h4`
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

export const ResultList = styled.ul`
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

export const RestartButton = styled.a`
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

export const TipBox = styled.div`
    margin-top: 2rem;
    padding: 1.25rem 1.5rem;
    background-color: ${theme.lightPrimaryColor};
    border-radius: 0.75rem;
    width: 100%;
    max-width: 34.375rem; /* 550px */
    text-align: center;
    box-sizing: border-box;
    border-left: 5px solid ${theme.primaryColor};
    animation: ${fadeIn} 0.5s ease-out;

    p {
        margin: 0;
        font-size: 0.95rem;
        color: ${theme.textColor};
        line-height: 1.6;
        font-weight: 500;
    }

    strong {
        color: ${theme.primaryColor};
        font-weight: 700;
    }
`;
