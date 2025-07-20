import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import main_image from '../assets/mainpage_image.png';
import video1 from '../assets/video1.svg';
import video2 from '../assets/video2.mp4';
import video3 from '../assets/video3.mp4';

import VideoSection from '../components/MainPage/VideoSection';
import HeroSection from '../components/MainPage/HeroSection';
import KeyFeaturesSection from '../components/MainPage/KeyFeaturesSection';
import DiagnosisReportSection from '../components/MainPage/DiagnosisReportSection';
import SkinTypeAnalysisSection from '../components/MainPage/SkinTypeAnalysisSection';
import DashboardPreviewSection from '../components/MainPage/DashboardPreviewSection';
import TodaysCareSection from '../components/MainPage/TodaysCareSection';

import {
  Section,
  CustomContainer,
  NotoSansBlack,
  SectionHeading,
  NeumorphicButton,
  ScrollToTopButton,
  Footer,
} from '../components/MainPage/SharedStyles';
import { FaArrowUp } from 'react-icons/fa';

const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    const videoList = [
        { id: 1, src: video1 },
        { id: 2, src: video2 },
        { id: 3, src: video3 },
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        const checkScrollTop = () => {
            if (!showScrollTop && window.pageYOffset > 400) {
                setShowScrollTop(true);
            } else if (showScrollTop && window.pageYOffset <= 400) {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', checkScrollTop);
        return () => window.removeEventListener('scroll', checkScrollTop);
    }, [showScrollTop]);

    return (
      <>
        <VideoSection videoList={videoList} />
        <HeroSection mainImage={main_image} />
        <KeyFeaturesSection />
        <DiagnosisReportSection />
        <SkinTypeAnalysisSection />
        <DashboardPreviewSection />
        <TodaysCareSection />
            
       <Section bg="#eff6ff">
        <Footer>
            <CustomContainer className="text-center">
                <SectionHeading className="text-2xl font-bold md:text-3xl">
                  <NotoSansBlack>지금 바로 PPIKA과 함께 건강한 피부 변화를 시작하세요.</NotoSansBlack>
                </SectionHeading>
                <div style={{ marginTop: '2rem' }}>
                <NeumorphicButton onClick={() => navigate('/disease-analysis-step1')}>
                        AI 진단 시작하기
                </NeumorphicButton>
                </div>
                </CustomContainer>
        </Footer>
        </Section>

        {showScrollTop && (
            <ScrollToTopButton onClick={scrollToTop}>
                <FaArrowUp />
            </ScrollToTopButton>
        )}
    </>
    );
};


export default MainPage;