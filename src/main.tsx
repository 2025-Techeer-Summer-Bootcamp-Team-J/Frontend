import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { dark } from '@clerk/themes';

// Vite 환경 변수에서 Clerk Publishable Key 가져오기
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// 다크 테마 + 커스텀 색상 적용
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#2563EB", // 원하는 색상 코드
    // 필요시 추가 커스텀 변수
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={clerkAppearance}
        signInUrl="/signin"
        signUpUrl="/signup"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
  </React.StrictMode>
);
