// src/main.tsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom' // 이 부분이 있는지 확인!

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* App을 감싸고 있는지 확인! */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)