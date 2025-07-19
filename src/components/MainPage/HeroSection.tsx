import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera } from 'react-icons/fa';

import {
  Section,
  Grid,
  MainHeading,
  SubHeading,
  NotoSansBlack,
  GradientText,
  NeumorphicButton,
  MagnifyContainer,
  MagnifierImage,
  MagnifierLens,
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

interface HeroSectionProps {
  mainImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ mainImage }) => {
  const navigate = useNavigate();

  const [magnifierState, setMagnifierState] = useState({
    visible: false,
    x: 0,
    y: 0,
    bgSize: '',
    bgPos: '',
  });

  const magnifyContainerRef = useRef<HTMLDivElement>(null);
  const magnifyImageRef = useRef<HTMLImageElement>(null);
  const zoom = 2.5;

  const handleMagnifierMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!magnifyContainerRef.current || !magnifyImageRef.current) return;

    const container = magnifyContainerRef.current;
    const img = magnifyImageRef.current;
    const rect = container.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) {
      handleMagnifierLeave();
      return;
    }

    const imgWidth = img.width;
    const imgHeight = img.height;
    const bgSize = `${imgWidth * zoom}px ${imgHeight * zoom}px`;
    const bgPosX = `-${x * zoom - 150 / 2}px`;
    const bgPosY = `-${y * zoom - 150 / 2}px`;

    setMagnifierState({
      visible: true,
      x,
      y,
      bgSize: bgSize,
      bgPos: `${bgPosX} ${bgPosY}`,
    });
  };

  const handleMagnifierLeave = () => {
    setMagnifierState((prevState) => ({ ...prevState, visible: false }));
  };

  return (
    <Section bg="#eff6ff">
      <ContentWrapper>
        <Grid lg_cols="2" gap="1rem" align="center">
          <div>
            <MainHeading>
              <NotoSansBlack>AI 피부 전문가,</NotoSansBlack>
              <br />
              <NotoSansBlack>
                <GradientText>PPIKA</GradientText>
              </NotoSansBlack>
              <br />
              <NotoSansBlack>당신의 피부 건강을<br /> 책임집니다</NotoSansBlack>
            </MainHeading>
            <SubHeading>
              PPIKA의 AI 진단으로 피부 고민의 원인을 정확히 파악하고, 가장 효과적인 관리법을 찾아보세요. 이제 집에서 간편하게 전문적인 피부 분석을 경험할 수 있습니다.
            </SubHeading>
            <NeumorphicButton onClick={() => navigate('/disease-analysis-step1')}>
              <FaCamera style={{ marginRight: '0.75rem' }} />
              AI 피부 진단 시작하기
            </NeumorphicButton>
          </div>
          <MagnifyContainer
            ref={magnifyContainerRef}
            onMouseMove={handleMagnifierMove}
            onMouseLeave={handleMagnifierLeave}
          >
            <MagnifierImage ref={magnifyImageRef} src={mainImage} alt="피부 상태" />
            <MagnifierLens
              visible={magnifierState.visible}
              x={magnifierState.x}
              y={magnifierState.y}
              bgImage={mainImage}
              bgSize={magnifierState.bgSize}
              bgPos={magnifierState.bgPos}
            />
          </MagnifyContainer>
        </Grid>
      </ContentWrapper>
    </Section>
  );
};

export default HeroSection;
