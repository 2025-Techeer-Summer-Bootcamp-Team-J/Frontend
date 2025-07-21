import React from 'react';
import styled from 'styled-components';

const AdditionalInfoBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
`;

const InfoTitle = styled.h4`
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InfoItem = styled.div`
  color: #64748b;
  margin-bottom: 0.25rem;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const SymptomTag = styled.span`
  display: inline-block;
  background: #e0e7ff;
  color: #3730a3;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
`;

const ItchLevelBar = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const ItchBar = styled.div`
  width: 100px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
`;

const ItchBarFill = styled.div<{ $level: number }>`
  height: 100%;
  background: ${props => 
    props.$level >= 8 ? '#dc2626' : 
    props.$level >= 6 ? '#ea580c' : 
    props.$level >= 4 ? '#d97706' : 
    props.$level >= 2 ? '#65a30d' : '#16a34a'
  };
  width: ${props => props.$level * 10}%;
  transition: width 0.3s ease;
`;

interface AdditionalInfo {
  symptoms: string[];
  itchLevel: number;
  duration: string;
  additionalInfo: string;
}

interface AdditionalInfoDisplayProps {
  additionalInfo: AdditionalInfo;
}

const AdditionalInfoDisplay: React.FC<AdditionalInfoDisplayProps> = ({ additionalInfo }) => {
  // 건너뛰기를 선택했거나 정보가 없는 경우 렌더링하지 않음
  if (!additionalInfo || additionalInfo.additionalInfo === '건너뛰기 선택') {
    return null;
  }

  const hasAnyInfo = 
    additionalInfo.symptoms.length > 0 || 
    additionalInfo.itchLevel > 0 || 
    additionalInfo.duration !== 'unknown' || 
    (additionalInfo.additionalInfo && additionalInfo.additionalInfo.trim() !== '');

  if (!hasAnyInfo) {
    return null;
  }

  return (
    <AdditionalInfoBox>
      <InfoTitle>
        <span>📋</span>
        입력하신 증상 정보
      </InfoTitle>
      
      {additionalInfo.symptoms.length > 0 && (
        <InfoItem>
          <strong>증상:</strong>
          <div style={{ marginTop: '0.5rem' }}>
            {additionalInfo.symptoms.map((symptom, index) => (
              <SymptomTag key={index}>{symptom}</SymptomTag>
            ))}
          </div>
        </InfoItem>
      )}
      
      {additionalInfo.itchLevel > 0 && (
        <InfoItem>
          <strong>가려움 정도:</strong> {additionalInfo.itchLevel}/10
          <ItchLevelBar>
            <ItchBar>
              <ItchBarFill $level={additionalInfo.itchLevel} />
            </ItchBar>
            <span style={{ 
              fontSize: '0.75rem', 
              color: additionalInfo.itchLevel >= 7 ? '#dc2626' : '#64748b' 
            }}>
              {additionalInfo.itchLevel >= 8 ? '매우 심함' :
               additionalInfo.itchLevel >= 6 ? '심함' :
               additionalInfo.itchLevel >= 4 ? '보통' :
               additionalInfo.itchLevel >= 2 ? '약함' : '거의 없음'}
            </span>
          </ItchLevelBar>
        </InfoItem>
      )}
      
      {additionalInfo.duration && additionalInfo.duration !== 'unknown' && (
        <InfoItem>
          <strong>지속 기간:</strong> {additionalInfo.duration}부터 시작됨
        </InfoItem>
      )}
      
      {additionalInfo.additionalInfo && 
       additionalInfo.additionalInfo.trim() !== '' && 
       !additionalInfo.additionalInfo.startsWith('가려움 정도:') && (
        <InfoItem>
          <strong>추가 정보:</strong> {additionalInfo.additionalInfo}
        </InfoItem>
      )}
    </AdditionalInfoBox>
  );
};

export default AdditionalInfoDisplay; 