import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  height: 4rem;
  border-bottom: 1px solid #ddd;
`;

const SignUpButtonStyled = styled.button`
  background-color: #2563EB;
  color: white;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.875rem;
  height: 2.5rem;
  padding: 0 1.25rem;
  cursor: pointer;
  border: none;
`;

function Layout() {
  return (
    <>
      <Header>
        <Link to="/">
          <span style={{ fontWeight: 'bold', cursor: 'pointer', position: 'absolute', left: '1rem' }}>My App</span>
        </Link>
        <SignedOut>
          <SignInButton />
          <SignUpButton>
            <SignUpButtonStyled>Sign Up</SignUpButtonStyled>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </Header>
      
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}

export default Layout; 