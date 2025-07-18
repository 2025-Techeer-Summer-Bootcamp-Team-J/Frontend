import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const RedirectPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user) {
      const { gender, birthdate } = user.unsafeMetadata;
      if (!gender || !birthdate) {
        navigate('/user-info');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isLoaded, user, navigate]);

  return (
      <PageContainer>
          <div>Loading...</div>
      </PageContainer>
  );
};

export default RedirectPage;
