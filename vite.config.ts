import { defineConfig } from "vite";
/// <reference types="node" />
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              "displayName": true,
              "fileName": false
            }
          ]
        ]
      }
    })
  ],
  server: {
    port: 5173,            // 개발 서버 포트 설정
    strictPort: true,      // 포트가 이미 사용중이면 에러 낸 후 종료
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8000', // 백엔드 URL
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
