import { SignIn } from "@clerk/clerk-react";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const SignInPage = () => {
  return (
    <PageContainer>
      <SignIn path="/signin" routing="path" signUpUrl="/signup" afterSignInUrl="/" />
    </PageContainer>
  );
};

export default SignInPage; 