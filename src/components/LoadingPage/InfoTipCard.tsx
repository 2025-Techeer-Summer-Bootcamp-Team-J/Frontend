import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import {
  InfoCard as StyledInfoCard,
  InfoTitle,
  InfoDescription,
} from './SharedStyles';

interface InfoTipCardProps {
  title: string;
  description: string;
  isVisible: boolean;
}

const InfoTipCard: React.FC<InfoTipCardProps> = ({
  title,
  description,
  isVisible,
}) => {
  return (
    <StyledInfoCard $isVisible={isVisible}>
      <InfoTitle>
        <FontAwesomeIcon icon={faLightbulb} />
        {title}
      </InfoTitle>
      <InfoDescription>{description}</InfoDescription>
    </StyledInfoCard>
  );
};

export default InfoTipCard;
