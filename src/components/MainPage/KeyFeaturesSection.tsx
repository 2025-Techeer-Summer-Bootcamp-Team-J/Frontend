import React from 'react';

import { FaCamera, FaCommentMedical, FaCalendarAlt } from 'react-icons/fa';
import {
  Section,
  SectionHeading,
  SectionSubheading,
  NotoSansBlack,
  GradientText,
  Grid,
  GlassmorphismCard,
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

const KeyFeaturesSection: React.FC = () => {
  return (
    <Section id="care">
      <ContentWrapper>
        <SectionHeading>
          <NotoSansBlack>PPIKA AI</NotoSansBlack>가 제공하는
          <br />
          <GradientText>핵심 기능 3가지</GradientText>
        </SectionHeading>
        <SectionSubheading>
          피부 분석부터 맞춤형 솔루션, 그리고 지속적인 관리까지. PPIKA AI는 당신의 피부 건강을 위한 모든 것을 제공합니다.
        </SectionSubheading>
        <Grid md_cols="3" gap="2rem">
          <GlassmorphismCard>
            <FaCamera size={36} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI 피부 분석</h3>
            <p className="text-gray-600">
              사진 한 장으로 피부 나이, 주요 고민(여드름, 모공, 주름 등)을 정밀하게 분석합니다. 시간과 장소에 구애받지 않고 전문가 수준의 진단을 받아보세요.
            </p>
          </GlassmorphismCard>
          <GlassmorphismCard>
            <FaCommentMedical size={36} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">맞춤형 솔루션 제안</h3>
            <p className="text-gray-600">
              분석 결과를 바탕으로 당신의 피부 타입과 고민에 가장 적합한 성분, 제품, 생활 습관을 추천해 드립니다. 더 이상 추측에 의존하지 마세요.
            </p>
          </GlassmorphismCard>
          <GlassmorphismCard>
            <FaCalendarAlt size={36} className="text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">피부 상태 트래킹</h3>
            <p className="text-gray-600">
              일일, 주간, 월간 단위로 피부 변화를 기록하고 시각적인 리포트를 통해 개선 과정을 한눈에 확인하세요. 꾸준한 관리가 아름다운 피부의 비결입니다.
            </p>
          </GlassmorphismCard>
        </Grid>
      </ContentWrapper>
    </Section>
  );
};

export default KeyFeaturesSection;
