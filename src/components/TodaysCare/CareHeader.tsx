import React from 'react';
import { Header } from './SharedStyles';
import { ContentWrapper } from '../../components/Layout';

const CareHeader: React.FC = () => {
  return (
    <ContentWrapper>
      <Header>
        <h1>오늘의 맞춤 케어</h1>
        <p>현재 자외선 지수를 확인하고, 내 피부를 위한 팁을 알아보세요.</p>
      </Header>
    </ContentWrapper>
  );
};

export default CareHeader;
