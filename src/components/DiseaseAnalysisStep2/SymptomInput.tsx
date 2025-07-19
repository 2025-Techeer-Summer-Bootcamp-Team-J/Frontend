import React from 'react';
import { InputSection, SectionHeading, TagContainer, SymptomTag } from './SharedStyles';

interface SymptomInputProps {
  symptoms: string[];
  selectedSymptoms: string[];
  onToggle: (symptom: string) => void;
}

const SymptomInput: React.FC<SymptomInputProps> = ({
  symptoms,
  selectedSymptoms,
  onToggle,
}) => {
  return (
    <InputSection>
      <SectionHeading>어떤 증상이 있나요? (중복 선택 가능)</SectionHeading>
      <TagContainer>
        {symptoms.map((symptom) => (
          <SymptomTag
            key={symptom}
            $selected={selectedSymptoms.includes(symptom)}
            onClick={() => onToggle(symptom)}
          >
            {symptom}
          </SymptomTag>
        ))}
      </TagContainer>
    </InputSection>
  );
};

export default SymptomInput;
