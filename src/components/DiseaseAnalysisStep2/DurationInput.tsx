import React from 'react';
import { InputSection, SectionHeading, TagContainer, SymptomTag } from './SharedStyles';

interface DurationInputProps {
  durations: string[];
  selectedDuration: string | null;
  onSelect: (duration: string) => void;
}

const DurationInput: React.FC<DurationInputProps> = ({
  durations,
  selectedDuration,
  onSelect,
}) => {
  return (
    <InputSection>
      <SectionHeading>증상이 언제부터 시작됐나요?</SectionHeading>
      <TagContainer>
        {durations.map((duration) => (
          <SymptomTag
            key={duration}
            $selected={selectedDuration === duration}
            onClick={() => onSelect(duration)}
          >
            {duration}
          </SymptomTag>
        ))}
      </TagContainer>
    </InputSection>
  );
};

export default DurationInput;
