import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { createUser } from "../services";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
`;

const FormContainer = styled.div`
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const UserInfoPage = () => {
  const { user, isLoaded } = useUser();
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      await user.update({
        unsafeMetadata: {
          gender,
          birthdate,
        },
      });

      await createUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        gender,
        birthdate,
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to update user metadata or create user:", error);
      setError("정보 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <PageContainer>
        <div>Loading...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
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
    </PageContainer>
  );
};

export default UserInfoPage;
