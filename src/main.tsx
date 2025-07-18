import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';

// Vite 환경 변수에서 Clerk Publishable Key 가져오기
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
  </React.StrictMode>
);
