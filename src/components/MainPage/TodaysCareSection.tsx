import React from 'react';
import styled from 'styled-components';
import { FaSun, FaLightbulb } from 'react-icons/fa';
import {
  Section,
  SectionHeading,
  SectionSubheading,
  NotoSansBlack,
  Grid,
  CardTitle,
} from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

const UvIndexCard = styled.div`
  background: rgba(255, 255, 255, 0.4);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem;
  transition: all 0.3s ease-in-out;

  /* --- [추가] Flexbox 속성 --- */
  display: flex;
  flex-direction: column; 

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(31, 38, 135, 0.4);
  }
justify-content: space-between;
`;

const UvIndexDisplay = styled.div`
  text-align: center;
  margin: 1.5rem 0;
`;

const UvIndexNumber = styled.p`
  font-size: 4.5rem;
  font-weight: 700;
  color: #f97316;
  margin: 0.5rem 0;
`;

const UvIndexText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #ea580c;
`;

const UvInfoBox = styled.div`
  background-color: rgba(254, 249, 231, 0.5);
  border-left: 4px solid #f97316;
  padding: 1rem;
  color: #9a3412;
  border-radius: 0.375rem;
  p:first-child {
    font-weight: 700;
  }
`;

const TipsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 두 팁 카드 사이의 간격만 정의 */
`;

const TipCard = styled.div`
  background: rgba(255, 255, 255, 0.3);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  h4 {
    font-weight: 600;
    font-size: 1.125rem;
  }
  p {
    color: #4b5563;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

const TodaysCareSection: React.FC = () => {
  return (
    <Section id="care">
      <ContentWrapper>
        <SectionHeading>
          <NotoSansBlack>오늘의 맞춤 케어</NotoSansBlack>
        </SectionHeading>
        <SectionSubheading>
          자외선 지수와 전문가 팁으로 매일 피부를 보호하세요.
        </SectionSubheading>
        <Grid md_cols="2" gap="2rem" align="stretch">
          <UvIndexCard>
            <CardTitle>
              <FaSun style={{ color: '#fb923c', marginRight: '0.75rem' }} />
              오늘의 자외선 지수
            </CardTitle>
            <UvIndexDisplay>
              <UvIndexNumber>7</UvIndexNumber>
              <UvIndexText>높음 (부천시)</UvIndexText>
            </UvIndexDisplay>
            <UvInfoBox>
              <p>외출 시 주의!</p>
              <p>햇볕이 강한 시간대에는 외출을 자제하고, 긴 소매 옷과 자외선 차단제를 꼭 사용하세요.</p>
            </UvInfoBox>
          </UvIndexCard>

          <UvIndexCard>
            <CardTitle>
              <FaLightbulb style={{ color: '#22c55e', marginRight: '0.75rem' }} />
              이주의 관리 팁
            </CardTitle>
            <TipsContainer>
              <TipCard>
                <h4>수분 부족형 지성, 클렌징이 중요!</h4>
                <p>약산성 클렌저를 사용하여 유분은 제거하되 수분은 남기는 것이 핵심입니다. 과도한 세안은 오히려 피부를 더 건조하게 만들 수 있습니다.</p>
              </TipCard>
              <TipCard>
                <h4>보습, 가볍지만 확실하게</h4>
                <p>오일프리 타입의 수분 크림이나 젤 타입의 제품을 사용하여 속건조를 해결해주세요.</p>
              </TipCard>
            </TipsContainer>
          </UvIndexCard>
        </Grid>
      </ContentWrapper>
    </Section>
  );
};

export default TodaysCareSection;
