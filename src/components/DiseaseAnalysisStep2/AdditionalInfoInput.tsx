import React from 'react';
import { InputSection, SectionHeading, InfoTextarea } from './SharedStyles';

interface AdditionalInfoInputProps {
  value: string;
  onChange: (info: string) => void;
}

const AdditionalInfoInput: React.FC<AdditionalInfoInputProps> = ({
  value,
  onChange,
}) => {
  return (
    <InputSection>
      <SectionHeading>그 외에 다른 정보가 있다면 알려주세요.</SectionHeading>
      <InfoTextarea
        placeholder="예) 특정 음식을 먹었을 때, 특정 화장품을 사용했을 때 등"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputSection>
  );
};

export default AdditionalInfoInput;
