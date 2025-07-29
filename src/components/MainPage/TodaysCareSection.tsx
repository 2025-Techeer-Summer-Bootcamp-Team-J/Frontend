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
  border-radius: 3rem;
  box-shadow: 0.25rem 0.25rem 0.5rem rgba(71,69,179,0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem;
  transition: all 0.3s ease-in-out;

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
  border-radius: 0.5rem 1rem 1rem 0.5rem;
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
  background: rgba(233, 255, 231, 0.3);
  padding: 1rem;
  border-radius: 0.5rem 1rem 1rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 4px solid #16a34a;

  h4 {
    color: #16a34a;
    font-weight: 600;
    font-size: 1.125rem;
  }
  p {
    color: #065f46;
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
          자외선 지수와 관리 팁으로 매일 피부를 보호하세요.
        </SectionSubheading>
        <Grid md_cols="2" gap="3rem" align="stretch">
          <UvIndexCard>
            <CardTitle>
              <FaSun style={{ color: '#fb923c', marginRight: '0.75rem' }} />
              오늘의 자외선 지수
            </CardTitle>
            <UvIndexDisplay>
              <UvIndexNumber>7</UvIndexNumber>
              <UvIndexText>높음</UvIndexText>
            </UvIndexDisplay>
            <UvInfoBox>
              <p>외출 시 주의!</p>
              <p>자외선 차단제를 꼼꼼히 바르고, 2시간마다 덧발라주세요. 가능한 한 긴 소매 옷을 착용하는 것이 좋습니다.</p>
            </UvInfoBox>
          </UvIndexCard>

          <UvIndexCard>
            <CardTitle>
              <FaLightbulb style={{ color: '#22c55e', marginRight: '0.75rem' }} />
              오늘의 관리 팁
            </CardTitle>
            <TipsContainer>
              <TipCard>
                <h4>차단 지수 높은 제품 사용!</h4>
                <p>SPF 50, PA+++ 이상의 강력한 자외선 차단제를 외출 30분 전에 바르세요.</p>
              </TipCard>
              <TipCard>
                <h4>긴 소매 옷 착용!</h4>
                <p>피부 보호를 위해 긴 소매 옷, 긴 바지를 입어 노출을 최소화하세요.</p>
              </TipCard>
              <TipCard>
                <h4>실내 활동 권장!</h4>
                <p>햇볕이 가장 강한 시간에는 가급적 실내에 머무르는 것이 안전합니다.</p>
              </TipCard>
            </TipsContainer>
          </UvIndexCard>
        </Grid>
      </ContentWrapper>
    </Section>
  );
};

export default TodaysCareSection;
