import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaPlay, FaPause } from 'react-icons/fa';


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
  cursor: pointer;
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

const PlayControlButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  color: white;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
    transform: scale(1.1);
  }
  
  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      if (isPlaying) {
        videoRef.current.play();
      }
    }
  }, [currentVideoIndex, isPlaying]);

  const handleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
          />

          <PlayControlButton onClick={handleVideoPlay}>
            {isPlaying ? <FaPause /> : <FaPlay />}
          </PlayControlButton>

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
