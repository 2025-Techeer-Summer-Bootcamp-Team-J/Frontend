import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    /* 폰트 import */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+KR:wght@400;500;700;900&display=swap');

    /* CSS 리셋 및 기본 스타일 */
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    html {
      /* 화면 너비에 따라 폰트 크기를 유동적으로 조절합니다. */
      /* 최소 14px, 기본 16px, 최대 18px (뷰포트 너비 360px ~ 1200px 기준) */
        font-size: 100%;
    }

    body {
        font-family: 'Inter', 'Noto Sans KR', sans-serif;
        background-color: #EFF3FE;
        min-height: 100vh;
    }

`;