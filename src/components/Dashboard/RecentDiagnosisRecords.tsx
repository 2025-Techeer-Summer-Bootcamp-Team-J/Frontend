import React from 'react';
import styled, { css } from 'styled-components';

// 타입 정의
type DiagnosisStatus = '개선' | '유지' | '악화';

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
  return (
    <div className={className}>
      <CardTitle>최근 진단 기록</CardTitle>
      <ListContainer>
        {records?.map((item) => (
          <ListItem key={item.id}>
            <div>
              <p className="font-semibold text-gray-700">{item.disease_name || 'N/A'}</p>
              <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString('ko-KR')}</p>
            </div>
            {/* Backend does not provide status, using a placeholder */}
            <StatusBadge status={'유지'}>유지</StatusBadge>
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

const statusStyles = {
  개선: css` background-color: #d1fae5; color: #065f46; `,
  유지: css` background-color: #fef3c7; color: #92400e; `,
  악화: css` background-color: #fee2e2; color: #991b1b; `,
};

const StatusBadge = styled.span<{ status: DiagnosisStatus }>`
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  ${({ status }) => statusStyles[status]}
`; 