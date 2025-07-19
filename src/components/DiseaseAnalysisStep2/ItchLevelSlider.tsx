import React from 'react';
import { InputSection, SectionHeading, SliderContainer, ItchSlider } from './SharedStyles';

interface ItchLevelSliderProps {
  itchLevel: number;
  onChange: (level: number) => void;
}

const ItchLevelSlider: React.FC<ItchLevelSliderProps> = ({
  itchLevel,
  onChange,
}) => {
  return (
    <InputSection>
      <SectionHeading>가려움의 정도는 어떤가요?</SectionHeading>
      <SliderContainer>
        <span>없음</span>
        <ItchSlider
          type="range"
          min="0"
          max="10"
          value={itchLevel}
          onChange={(e) => onChange(Number(e.target.value))}
        />
        <span>매우 심함 ({itchLevel})</span>
      </SliderContainer>
    </InputSection>
  );
};

export default ItchLevelSlider;
