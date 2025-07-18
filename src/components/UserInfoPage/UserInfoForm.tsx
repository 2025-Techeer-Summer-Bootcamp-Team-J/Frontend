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
            required
          />
        </FormGroup>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '저장 중...' : '저장'}
        </Button>
      </form>
    </FormContainer>
  );
};

export default UserInfoForm;
