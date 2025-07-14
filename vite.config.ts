import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,            // 개발 서버 포트 설정
    strictPort: true,      // 포트가 이미 사용중이면 에러 낸 후 종료
    proxy: {
      '/api': {
        target: 'http://localhost:8000',  // 백엔드 서버 포트 추가
        changeOrigin: true,
        secure: false
      }
    }
  }
})
