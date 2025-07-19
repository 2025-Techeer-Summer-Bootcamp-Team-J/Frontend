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
        await user.update({
          unsafeMetadata: {
            gender,
            birthdate,
          },
        });

        try {
          await signup({
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: user.fullName || '',
            gender,
            birth_date: birthdate,
          });
        } catch (apiError) {
          console.warn("API call to signup failed, but proceeding anyway:", apiError);
        }

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