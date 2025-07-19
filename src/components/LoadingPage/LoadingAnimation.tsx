import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import {
  ScannerContainer,
  ScannerPulse,
  ScannerAnimation,
  ScannerLine,
} from './SharedStyles';

const LoadingAnimation: React.FC = () => {
  return (
    <ScannerContainer>
      <ScannerPulse />
      <ScannerPulse />
      <ScannerAnimation>
        <FontAwesomeIcon icon={faUser} className="scanner-icon" />
        <ScannerLine />
      </ScannerAnimation>
    </ScannerContainer>
  );
};

export default LoadingAnimation;
