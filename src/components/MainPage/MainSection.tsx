// src/components/mainpage/mainsection.tsx

import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

interface MainSectionProps {
  mainImage: string;
}

const Main = styled.main`
  padding: 6.875rem 3rem 0 3rem ;
`;

const HeroSection = styled.section`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 5rem;
  border-radius: 20px;
  min-height: 82vh; 

  &:first-child {
    padding-top: 1.25rem;
    scroll-margin-top: 6rem;
  }

  @media (max-width: 768px) {
    padding: 0 2rem;
    min-height: 70vh;
  }
`;

const BackgroundImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  border-radius: 20px;
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(17, 24, 39, 0.8), rgba(17, 24, 39, 0.4), transparent);
  z-index: 10;
  border-radius: 20px;

`;

const HeroContent = styled.div`
  position: relative;
  z-index: 20;
  display: flex;
  align-items: center;
  min-height: 80vh;

  @media (min-width: 768px) {
    min-height: 70vh;
  }
`;

const ContentContainer = styled.div`
  width: 100%;
  padding: 0 1rem;

  @media (min-width: 768px) {
    padding: 0 2rem;
  }
`;

const TextWrapper = styled.div`
  padding: clamp(2rem, 7vw, 5rem) 0;
  max-width: clamp(20rem, 80%, 36rem);
`;

const HeroTitle = styled.h2`
  font-size: 3.2rem;
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: white;

  @media (min-width: 768px) {
    font-size: 4.8rem;
  }
`;

const HeroDescription = styled.p`
  margin-top: 1.5rem;
  font-size: 1.125rem; 
  color: #d1d5db;
`;

// [수정] 이미지와 유사한 버튼 스타일로 변경합니다.
const HeroButton = styled.a`
  display: inline-block;
  background-color: #5856d6; // 보라색 계열
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 9999px;
  font-weight: 600;
  margin-top: 2.5rem;
  text-decoration: none;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background-color: #4c4ac8;
    transform: translateY(-2px);
  }
`;

const MainSection: React.FC<MainSectionProps> = () => {
  const navigate = useNavigate();
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const target = e.currentTarget;
    target.src = 'assets/ffffff.svg';
  };

  return (
    <>
     <Main>
            <HeroSection>
              <BackgroundImage
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                alt="의료진이 진단하는 이미지"
                onError={handleImageError}
              />
              <GradientOverlay />
              <HeroContent>
                <ContentContainer>
                  <TextWrapper>
                    <HeroTitle>PPIKA Clinic</HeroTitle>
                    <HeroDescription>
                      최첨단 AI 기술로 당신의 피부를 정밀 분석하고, 가장 효과적인
                      관리법을 찾아보세요. 이제 집에서 간편하게 전문적인 피부 분석을
                      경험할 수 있습니다.
                    </HeroDescription>
                    <HeroButton onClick={() => navigate('/disease-analysis-step1')}>
                      AI 피부 진단 시작하기
                    </HeroButton>
                  </TextWrapper>
                </ContentContainer>
              </HeroContent>
            </HeroSection>
          </Main>
    </>
  );
};

export default MainSection;