import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { GlobalStyle } from '../styles/GlobalStyle';
import logoImage from '../assets/삐까로고가로형.png';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 80rem;
  max-height: 90%;
  margin: 0 auto;
  padding: 0 2rem;

  @media (min-width: 1600px) {
    max-width: 90rem;
  }
  @media (min-width: 1920px) {
    max-width: 100rem; 
    padding: 0 4rem;
  }
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

export const HeaderWrapper = styled.header`
  width: 100%;
  height: 4rem;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 50;
  
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    height: 4rem;
    padding: 0.5rem 0;
  }
`;

const HeaderContent = styled(ContentWrapper)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;

  &:nth-child(1) { // Logo
    justify-content: flex-start;
    flex: 0 0 auto;
  }
  &:nth-child(2) { // Nav
    justify-content: center;
    flex: 1 1 auto;
    
    @media (max-width: 768px) {
      flex: 1 1 0;
      min-width: 0;
    }
  }
  &:nth-child(3) { // Auth
    justify-content: flex-end;
    flex: 0 0 auto;
  }
`;

// 2. 텍스트 로고 대신 이미지를 감싸는 링크와 이미지 스타일을 정의합니다.
const LogoLink = styled(NavLink)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

const LogoImage = styled.img`
  height: 2.0rem; /* 원하는 로고 높이로 조절하세요 */
  width: auto;

  @media (max-width: 768px) {
    height: 1.5rem; /* 모바일 화면에서의 로고 높이 */
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(0.5rem, 1vw, 1.25rem);

  @media (max-width: 768px) {
    gap: 0.2rem;
    overflow: hidden;
  }
`;

const NavLinks = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: clamp(0.5rem, 0.5vw, 1rem);
`;

const NavItem = styled(NavLink)`
  color: #374151;
  text-decoration: none;
  font-weight: 400;
  font-size: clamp(0.9rem, 1.2vw, 1.3rem); 
  padding: 0.5rem clamp(0.75rem, 1.5vw, 1.25rem);
  border-radius: 9999px;
  transition: color 0.2s, background-color 0.2s;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.3rem;
  }
    
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

const AuthButton = styled.button`
  background-color: #4A6CFD;
  color: white;
  border-radius: 9999px;
  font-weight: 400;
  font-size: 0.9rem;
  height: auto;
  padding: 0.5rem clamp(0.75rem, 1.5vw, 1.25rem);
  cursor: pointer;
  border: none;
  transition: background-color 0.2s;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.6rem;
  }

  &:hover {
    color: white;
    background-color: #2949d5;
  }
`;

const UserButtonWrapper = styled.div`
  @media (max-width: 768px) {
    .cl-userButtonBox {
      width: 2rem;
      height: 2rem;
    }
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
      <GlobalStyle />
      <HeaderWrapper>
        <HeaderContent>
          <HeaderSection>
            <LogoLink to="/">
             <LogoImage src={logoImage} alt="PPIKA 로고" />
            </LogoLink>
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
                <SignInButton mode="modal">
                  <AuthButton>로그인</AuthButton>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <UserButtonWrapper>
                  <UserButton afterSignOutUrl="/" />
                </UserButtonWrapper>
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
          <p>© 2025 PPIKA. All Rights Reserved.</p>
        </FooterContent>
      </FooterWrapper>
    </PageWrapper>
  );
}

export default Layout; 