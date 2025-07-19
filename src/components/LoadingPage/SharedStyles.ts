import styled, { keyframes } from 'styled-components';

export const pulseAnimation = keyframes`
    0% { transform: scale(0.8); opacity: 0; }
    50% { opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
`;
export const scanAnimation = keyframes`
    0% { top: -50%; }
    100% { top: 100%; }
`;
export const buttonAppearAnimation = keyframes`
    to { opacity: 1; transform: translateY(0); }
`;

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1.25rem;
  text-align: center;
`;

export const ScannerContainer = styled.div`
  position: relative;
  width: 11.25rem; /* 180px */
  height: 11.25rem; /* 180px */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ScannerPulse = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 0.125rem solid rgba(0, 82, 255, 0.3);
  border-radius: 50%;
  animation: ${pulseAnimation} 2s ease-out infinite;
  opacity: 0;
  &:nth-child(2) { animation-delay: 1s; }
`;

export const ScannerAnimation = styled.div`
  width: 9.375rem; /* 150px */
  height: 9.375rem; /* 150px */
  position: relative;
  border-radius: 50%;
  border: 0.1875rem solid var(--card-bg-color);
  background-color: var(--light-primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0.3125rem 1.5625rem rgba(0, 82, 255, 0.15);

  .scanner-icon {
    font-size: 5rem; /* 80px */
    color: var(--primary-color);
    opacity: 0.6;
  }
`;

export const ScannerLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to bottom, rgba(0, 82, 255, 0.4), transparent);
  animation: ${scanAnimation} 3s ease-in-out infinite;
`;

export const MainHeading = styled.h2`
  font-size: clamp(1.2rem, 4vw, 1.5rem);
  font-weight: 700;
  color: #1a1a1a;
  margin: 3.75rem 0 0 0; /* 60px */
`;

export const StatusText = styled.p<{ $isComplete: boolean }>`
  font-size: ${({ $isComplete }) => $isComplete ? 'clamp(1.2rem, 4vw, 1.5rem)' : 'clamp(0.9rem, 2.5vw, 1rem)'};
  font-weight: ${({ $isComplete }) => ($isComplete ? '700' : '400')};
  color: ${({ $isComplete }) => ($isComplete ? '#1a1a1a' : 'var(--light-text-color)')};
  margin: ${({ $isComplete }) => ($isComplete ? '3rem 0 1.875rem 0' : '0.625rem 0 0 0')};
  min-height: 1.5rem; /* 24px */
  transition: all 0.3s ease-in-out;
`;

export const InfoCard = styled.div<{ $isVisible: boolean }>`
  margin-top: 1.875rem; /* 30px */
  padding: 1.25rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(0.3125rem);
  border-radius: 0.9375rem; /* 15px */
  width: 100%;
  max-width: 25rem; /* 400px */
  box-shadow: 0 0.25rem 0.9375rem rgba(0, 82, 255, 0.05);
  text-align: left;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) => ($isVisible ? 'translateY(0)' : 'translateY(0.625rem)')};
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
`;

export const InfoTitle = styled.h4`
  margin: 0 0 0.625rem 0;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  svg { margin-right: 0.5rem; }
`;

export const InfoDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--light-text-color);
`;

export const ResultButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.875rem; /* 12px 30px */
  font-size: 1rem;
  font-weight: 700;
  color:rgb(0, 110, 255);
  background-color: var(--primary-color);
  border: none;
  border-radius: 0.5rem; /* 8px */
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.7;
  transform: translateY(0.625rem);
  animation: ${buttonAppearAnimation} 0.5s forwards;

  &:hover {
    background-color: var(--dark-primary-color);
    transform: translateY(-0.125rem);
    box-shadow: 0 0.375rem 1.25rem rgba(0, 82, 255, 0.25);
  }
`;
