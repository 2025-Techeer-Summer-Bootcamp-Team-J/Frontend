import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLightbulb, faTintSlash, faBullseye } from '@fortawesome/free-solid-svg-icons';
import {
  GuidePanel as StyledGuidePanel,
  Title,
  Subtitle,
  GuideList,
  GuideItem,
  GuideIcon
} from './SharedStyles';

const GuidePanel: React.FC = () => {
  return (
    <StyledGuidePanel>
        <Title>촬영 가이드</Title>
        <Subtitle>정확한 분석을 위해 아래 가이드를 확인해주세요</Subtitle>
      <GuideList>
        <GuideItem>
          <GuideIcon><FontAwesomeIcon icon={faEye} size="lg" /></GuideIcon>
          <span>피부 질환이 있는 부위가 선명하게 보이도록 촬영해 주세요.</span>
        </GuideItem>
        <GuideItem>
          <GuideIcon><FontAwesomeIcon icon={faBullseye} size="lg" /></GuideIcon>
          <span>질환이 전체 화면의 중심에 오도록 해 주세요.</span>
        </GuideItem>
        <GuideItem>
          <GuideIcon><FontAwesomeIcon icon={faLightbulb} size="lg" /></GuideIcon>
          <span>밝고 균일한 조명 아래에서 촬영하면 분석 정확도가 올라갑니다.</span>
        </GuideItem>
        <GuideItem>
          <GuideIcon><FontAwesomeIcon icon={faTintSlash} size="lg" /></GuideIcon>
          <span>화장이나 액세서리는 모두 제거한 상태의 민낯 사진을 업로드해주세요.</span>
        </GuideItem>
      </GuideList>
    </StyledGuidePanel>
  );
};

export default GuidePanel;