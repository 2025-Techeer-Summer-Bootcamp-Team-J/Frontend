import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface DiagnosisRecord {
  id: number;
  disease_name: string;
  created_at: string;
}

interface RecentDiagnosisRecordsProps {
  records: DiagnosisRecord[];
  className?: string;
}

const RecentDiagnosisRecords: React.FC<RecentDiagnosisRecordsProps> = ({ records, className }) => {
  const navigate = useNavigate();
  return (
    <div className={className}>
      <CardTitle>최근 진단 기록</CardTitle>
      <ListContainer>
        {records?.map((item) => (
          <ListItem key={item.id} onClick={() => navigate(`/diagnoses/${item.id}`)}>
            <div>
              <p className="font-semibold text-gray-700">{item.disease_name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('ko-KR')}</p>
            </div>
          </ListItem>
        ))}
      </ListContainer>
    </div>
  );
};

export default RecentDiagnosisRecords;

// Styled Components
const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  margin-bottom: 1rem;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ListItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  p { margin: 0; }
  .font-semibold { font-weight: 600; }
  .text-gray-700 { color: #374151; }
  .text-sm { font-size: 0.875rem; }
  .text-gray-500 { color: #6b7280; }
`;