import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
    /* 폰트 import */
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');

    /* CSS 리셋 및 기본 스타일 */
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: 'Noto Sans KR', sans-serif;
        background-color: #f0f2f5;
        min-height: 100vh;
    }
`;