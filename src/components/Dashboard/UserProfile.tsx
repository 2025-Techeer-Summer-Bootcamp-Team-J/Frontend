import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import styled from 'styled-components';

// (삭제) 주요 고민 부위 태그 관련 인터페이스 제거

import type { MyProfile } from '../../services/types';

interface UserProfileProps {
  className?: string;
  // 백엔드에서 내려오는 MyProfile 구조를 그대로 사용하되,
  // concerns / managementTips 는 선택적으로 확장해 사용합니다.
  mySkinProfile?: MyProfile & {
    concerns?: string[];
    managementTips?: string[];
  };
}



const UserProfile: React.FC<UserProfileProps> = ({ className, mySkinProfile }) => {
  const { user, isLoaded } = useUser();

  // Clerk 기본 정보
  let name = (user?.fullName ?? `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim()) || '미입력';
  if (name.startsWith('/') && name.includes(' ')) {
    name = name.substring(name.indexOf(' ') + 1);
  }
  const email = user?.primaryEmailAddress?.emailAddress ?? '미입력';
  const gender = user?.unsafeMetadata?.gender as string || '';
  const birthdate = user?.unsafeMetadata?.birthdate as string || '';

  const getGenderDisplay = (value: string) => {
    switch (value) {
      case 'male':
        return '남성';
      case 'female':
        return '여성';
      default:
        return '미입력';
    }
  };

  // 정보 수정 관련 상태
  const [isEditing, setIsEditing] = useState(false);
  const [editGender, setEditGender] = useState(gender);
  const [editBirthdate, setEditBirthdate] = useState(birthdate);
  const [isSaving, setIsSaving] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEditGender(user.unsafeMetadata.gender as string || '');
      setEditBirthdate(user.unsafeMetadata.birthdate as string || '');
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setUserError(null);
    // Reset to original values
    setEditGender(gender);
    setEditBirthdate(birthdate);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setUserError(null);

    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          gender: editGender,
          birthdate: editBirthdate,
        },
      });
      setIsEditing(false);
    } catch (err) {
      setUserError("정보 저장에 실패했습니다. 다시 시도해주세요.");
      console.error("Failed to update user metadata:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className={className}>
        <CardTitleContainer>
          <CardTitle>내 정보</CardTitle>
        </CardTitleContainer>
        <div>Loading...</div>
      </div>
    );
  }

  // 임시 데이터 (실제로는 API에서 가져와야 함)
  // 백엔드에서 내려오는 tip_content (단일 문자열)를 사용
  const tipContent = mySkinProfile?.tip_content || '';

  return (
    <div className={className}>
      <CardTitleContainer>
        <CardTitle>내 정보</CardTitle>
        {!isEditing && <EditButton onClick={handleEdit}>수정</EditButton>}
      </CardTitleContainer>
      <ProfileContent>
        <div>
          <ProfileLabel>이름</ProfileLabel>
          <ProfileValue>{name}</ProfileValue>
        </div>
        <div>
          <ProfileLabel>이메일</ProfileLabel>
          <ProfileValue>{email}</ProfileValue>
        </div>
        {isEditing ? (
          <>
            <FormRow>
              <ProfileLabel>성별</ProfileLabel>
              <select value={editGender} onChange={e => setEditGender(e.target.value)}>
                <option value="">선택</option>
                <option value="male">남성</option>
                <option value="female">여성</option>
              </select>
            </FormRow>
            <FormRow>
              <ProfileLabel>생년월일</ProfileLabel>
              <input type="date" value={editBirthdate} onChange={e => setEditBirthdate(e.target.value)} />
            </FormRow>
            {userError && <p style={{ color: 'red', fontSize: '0.875rem' }}>{userError}</p>}
            <ButtonContainer>
              <SaveButton onClick={handleSave} disabled={isSaving}>
                {isSaving ? '저장 중...' : '저장'}
              </SaveButton>
              <CancelButton onClick={handleCancel}>취소</CancelButton>
            </ButtonContainer>
          </>
        ) : (
          <>
            <div>
              <ProfileLabel>성별</ProfileLabel>
              <ProfileValue>{getGenderDisplay(gender)}</ProfileValue>
            </div>
            <div>
              <ProfileLabel>생년월일</ProfileLabel>
              <ProfileValue>{birthdate || '미입력'}</ProfileValue>
            </div>
          </>
        )}
        <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }} />
        <div>
          <ProfileLabel>피부 타입</ProfileLabel>
          <ProfileValue>{mySkinProfile?.type_name || '미입력'}</ProfileValue>
        </div>

        <div>
          <ProfileLabel style={{ marginBottom: '0.5rem' }}>주의사항 및 관리 팁</ProfileLabel>
          <TipList>
            {tipContent ? (
              <li>{tipContent}</li>
            ) : (
              <li style={{color: '#aaa'}}>미입력</li>
            )}
          </TipList>
        </div>
      </ProfileContent>
    </div>
  );
};

export default UserProfile;

// Styled Components
const CardTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
`;

const EditButton = styled.button`
  background: none;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background-color: #f9fafb;
  }
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ProfileLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
`;

const ProfileValue = styled.p`
  font-weight: 600;
  color: #2563eb;
  margin: 0;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  label {
    font-weight: 500;
    color: #374151;
  }

  select, input {
    padding: 0.375rem 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    flex-grow: 1;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const SaveButton = styled.button`
  flex-grow: 1;
  padding: 0.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  &:disabled {
    background-color: #9ca3af;
  }
`;

const CancelButton = styled.button`
  flex-grow: 1;
  padding: 0.5rem;
  background-color: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
`;


const TipList = styled.ul`
  list-style-type: disc;
  list-style-position: inside;
  font-size: 0.875rem;
  color: #4b5563;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`; 