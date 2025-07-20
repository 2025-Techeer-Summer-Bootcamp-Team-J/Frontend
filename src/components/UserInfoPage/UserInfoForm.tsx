import React from "react";
import {
  FormContainer,
  Title,
  FormGroup,
  Label,
  Input,
  Select,
  Button,
} from "./SharedStyles";

interface UserInfoFormProps {
  gender: string;
  setGender: (gender: string) => void;
  birthdate: string;
  setBirthdate: (birthdate: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  gender,
  setGender,
  birthdate,
  setBirthdate,
  handleSubmit,
  isLoading,
  error,
}) => {
  const isFormValid = gender && birthdate;

  return (
    <FormContainer>
      <Title>추가 정보 입력</Title>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="gender">성별</Label>
          <Select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            disabled={isLoading}
            required
          >
            <option value="">선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </Select>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="birthdate">생년월일</Label>
          <Input
            id="birthdate"
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            disabled={isLoading}
            required
          />
        </FormGroup>
        
        {error && (
          <div style={{
            color: '#dc3545',
            backgroundColor: '#f8d7da',
            border: '1px solid #f5c6cb',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            margin: '1rem 0',
            fontSize: '0.875rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {isLoading && (
          <div style={{
            color: '#0066cc',
            backgroundColor: '#cce7ff',
            border: '1px solid #b3d9ff',
            padding: '0.75rem',
            borderRadius: '0.375rem',
            margin: '1rem 0',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: '2px solid #0066cc',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              사용자 정보를 저장하고 있습니다...
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={isLoading || !isFormValid}
          style={{
            opacity: (isLoading || !isFormValid) ? 0.6 : 1,
            cursor: (isLoading || !isFormValid) ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </form>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </FormContainer>
  );
};

export default UserInfoForm;
