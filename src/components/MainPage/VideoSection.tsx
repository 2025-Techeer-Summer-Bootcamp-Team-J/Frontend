import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';


// Styled Components (moved from MainPage.tsx)
const VideoSectionWrapper = styled.section`
  padding: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  height: 100vh;
  width: 100vw;
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top; /* 상단 잘림 최소화 */
  cursor: pointer;

  @media (max-width: 768px) {
    object-position: center center; /* 모바일에서는 중앙으로 */
  }
`;

const VideoNavigation = styled.div`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;
  background: transparent;
  padding: 1rem 2rem;
  border-radius: 3rem;
`;

const VideoIndicators = styled.div`
  display: flex;
  gap: 1rem;
`;

const VideoIndicator = styled.button<{ $isActive: boolean }>`
  width: 60px;
  height: 2px;
  border-radius: 1px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$isActive ? '#000000' : 'rgba(255, 255, 255, 0.4)'};
  
  &:hover {
    background: white;
    transform: scaleY(2);
  }
`;

const VideoTitle = styled.div`
  position: absolute;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: white;
  
  @media (max-width: 768px) {
    bottom: 6rem;
    left: 1rem;
    right: 1rem;
    transform: none;
  }
  
  h2 {
    font-size: 3rem;
    font-weight: 900;
    margin: 0 0 1rem 0;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.25rem;
    margin: 0;
    opacity: 0.9;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
`;

interface VideoSectionProps {
  videoList: { id: number; src: string }[];
}

const VideoSection: React.FC<VideoSectionProps> = ({ videoList }) => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [currentVideoIndex, isPlaying]);


  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) =>
      prev === videoList.length - 1 ? 0 : prev + 1
    );
    setIsPlaying(false);
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsPlaying(false);
  };

  return (
    <VideoSectionWrapper>
      <VideoContainer>
        <VideoWrapper>
          <VideoElement
            ref={videoRef}
            src={videoList[currentVideoIndex].src}
            onClick={handleNextVideo}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            muted
            loop
            autoPlay
          />

          <VideoTitle>
            <h2>PPIKA AI 피부 케어</h2>
            <p>전문적인 피부 관리의 모든 것을 경험해보세요</p>
          </VideoTitle>

          <VideoNavigation>
            <VideoIndicators>
              {videoList.map((_, index) => (
                <VideoIndicator
                  key={index}
                  $isActive={index === currentVideoIndex}
                  onClick={() => handleVideoSelect(index)}
                />
              ))}
            </VideoIndicators>
          </VideoNavigation>
        </VideoWrapper>
      </VideoContainer>
    </VideoSectionWrapper>
  );
};

export default VideoSection;
