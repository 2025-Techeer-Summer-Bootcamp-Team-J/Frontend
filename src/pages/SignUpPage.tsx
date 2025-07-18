import { SignUp } from "@clerk/clerk-react";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 1rem;
`;

const SignUpPage = () => {
  return (
    <PageContainer>
      <SignUp path="/signup" routing="path" signInUrl="/signin" afterSignUpUrl="/user-info" />
    </PageContainer>
  );
};

export default SignUpPage; 