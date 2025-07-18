import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 2rem;

  @media (min-width: 1600px) {
    max-width: 96rem;
  }
  @media (min-width: 1920px) {
    max-width: 110rem;
  }
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const HeaderWrapper = styled.header`
  width: 100%;
  height: 5.2rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05);
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    height: auto;
    padding: 1rem 0;
  }
`;

const HeaderContent = styled(ContentWrapper)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: clamp(1rem, 4vw, 1.5rem); /* 모바일에서 세로 간격을 유동적으로 조정 */
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  flex: 1;

  &:nth-child(1) { // Logo
    justify-content: flex-start;
  }
  &:nth-child(2) { // Nav
    justify-content: center;
    flex: 2;
  }
  &:nth-child(3) { // Auth
    justify-content: flex-end;
  }
`;

const Logo = styled(NavLink)`
  font-weight: bold;
  text-decoration: none;
  color: #2563eb;
  font-size: clamp(1.5rem, 2.5vw, 2.2rem); /* 로고도 유동적으로! */
  font-family: 'Noto Sans KR', sans-serif;
  font-weight: 900;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(0.5rem, 1.5vw, 1.25rem);
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 1rem);
`;

const NavItem = styled(NavLink)`
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  font-size: clamp(0.9rem, 1.2vw, 1.3rem); /* 최소 0.9rem, 최대 1.1rem, 중간에서는 화면너비의 1.2% */
  padding: 0.5rem clamp(0.75rem, 1.5vw, 1.25rem);
  border-radius: 0.5rem;
  transition: color 0.2s, background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
    color: #1f2937;
  }

  &.active {
    background-color: #eff6ff;
    color: #1d4ed8;
    font-weight: 700;
  }
`;

const AuthLink = styled(NavLink)`
  background-color: #2563EB;
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  height: auto;
  padding: 0.5rem clamp(0.75rem, 1.5vw, 1.25rem);
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
  text-decoration: none;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const Main = styled.main`
  flex-grow: 1;
  width: 100%;
`;

const FooterWrapper = styled.footer`
  width: 100%;
  padding: 2rem 0;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
`;

const FooterContent = styled(ContentWrapper)`
  text-align: center;
  color: #6b7280;
`;

function Layout() {
  return (
    <PageWrapper>
      <HeaderWrapper>
        <HeaderContent>
          <HeaderSection>
            <Logo to="/">BlueScope</Logo>
          </HeaderSection>
          <HeaderSection>
            <Nav>
              <NavItem to="/disease-analysis-step1">AI 진단</NavItem>
              <NavItem to="/skin-analysis">피부 유형 분석</NavItem>
              <NavItem to="/dashboard">대시보드</NavItem>
              <NavItem to="/todays-care">오늘의 케어</NavItem>
            </Nav>
          </HeaderSection>
          <HeaderSection>
            <NavLinks>
              <SignedOut>
                <AuthLink to="/signin">로그인</AuthLink>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </NavLinks>
          </HeaderSection>
        </HeaderContent>
      </HeaderWrapper>
      
      <Main>
        <Outlet />
      </Main>

      <FooterWrapper>
        <FooterContent>
          <p>© 2024 BlueScope. All Rights Reserved.</p>
        </FooterContent>
      </FooterWrapper>
    </PageWrapper>
  );
}

export default Layout; 