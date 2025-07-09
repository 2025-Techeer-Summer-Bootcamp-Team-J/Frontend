import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Link, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2.5rem;
  height: 5.2rem;
  border-bottom: 1px solid #ddd;
  background-color: white; /* 배경색 추가 */
  position: sticky; /* 상단에 고정 */
  top: 0;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 1rem;
    flex-direction: column;
    height: auto;
  }
`;

const HeaderSection = styled.div`
  flex: 1;
`;

const Logo = styled(Link)`
  font-weight: bold;
  text-decoration: none;
  color: #2563eb;
  font-size: 2rem;
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 900;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  font-size: 1.5rem;
  gap: 2.5rem;
  flex: 2;
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
`;

const NavItem = styled(Link)`
  color: #4b5563;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
  &:hover {
    color: #2563eb;
  }
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

const Main = styled.main`
  flex-grow: 1;
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

function Layout() {
  return (
    <LayoutWrapper>
      <Header>
        <HeaderSection>
          <Logo to="/">BlueScope</Logo>
        </HeaderSection>
        <Nav>
          <NavItem to="/disease-analysis-step1">AI 진단</NavItem>
          <NavItem to="/#care">상세 분석</NavItem>
          <NavItem to="/#dashboard">대시보드</NavItem>
          <NavItem to="/#testimonials">오늘의 케어</NavItem>
        </Nav>
        <HeaderSection>
          <NavLinks>
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <SignUpButtonStyled>Sign Up</SignUpButtonStyled>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </NavLinks>
        </HeaderSection>
      </Header>
      
      <Main>
        <Outlet />
      </Main>
    </LayoutWrapper>
  );
}

export default Layout; 