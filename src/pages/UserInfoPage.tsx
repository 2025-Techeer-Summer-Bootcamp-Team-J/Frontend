import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/usersApi";  

import { PageContainer } from "../components/UserInfoPage/SharedStyles";
import UserInfoForm from "../components/UserInfoPage/UserInfoForm";

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
        // 1단계: Clerk 메타데이터 업데이트
        console.log("Updating Clerk user metadata...");
        await user.update({
          unsafeMetadata: {
            gender,
            birthdate,
          },
        });
        console.log("Clerk metadata updated successfully");

        // 2단계: 백엔드 사용자 생성 (재시도 로직 포함)
        console.log("Creating user in backend...");
        const maxRetries = 3;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            await signup({
              clerk_user_id: user.id,
              email: user.primaryEmailAddress?.emailAddress || '',
              name: user.fullName || '',
              gender,
              birth_date: birthdate,
            });
            console.log("Backend user created successfully");
            break; // 성공시 루프 탈출
          } catch (apiError) {
            console.warn(`API call attempt ${attempt}/${maxRetries} failed:`, apiError);
            
            if (attempt === maxRetries) {
              // 모든 재시도 실패시 에러 처리
              console.error("All API retry attempts failed:", apiError);
              throw new Error(
                apiError && typeof apiError === 'object' && 'response' in apiError 
                  ? `백엔드 연동 실패: ${(apiError as Error & { response?: { data?: { message?: string } } }).response?.data?.message || '알 수 없는 오류'}`
                  : '백엔드 서버와 연결할 수 없습니다.'
              );
            }
            
            // 재시도 전 잠시 대기 (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }

        // 성공적으로 완료
        console.log("User registration process completed successfully");
        navigate("/dashboard");
        
      } catch (error) {
        console.error("User registration failed:", error);
        
        // 구체적인 에러 메시지 제공
        if (error instanceof Error) {
          setError(error.message);
        } else if (error && typeof error === 'object' && 'message' in error) {
          setError(error.message as string);
        } else {
          setError("사용자 정보 저장에 실패했습니다. 네트워크 상태를 확인하고 다시 시도해주세요.");
        }
      } finally {
        setIsLoading(false);
      }
  };

  if (!isLoaded) {
    return (
      <PageContainer>
        <div>사용자 정보를 불러오는 중...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <UserInfoForm
        gender={gender}
        setGender={setGender}
        birthdate={birthdate}
        setBirthdate={setBirthdate}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        error={error}
      />
    </PageContainer>
  );
};

export default UserInfoPage;