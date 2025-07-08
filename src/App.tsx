// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import SkinAnalysisStep1 from './pages/DiseaseAnalysisStep1';
import { GlobalStyle } from './styles/GlobalStyle';

// HomePage 컴포넌트는 이제 필요 없으니 지워도 됩니다.
// const HomePage = () => <h1>메인 페이지입니다.</h1>;

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        {/* 
          이전 코드: 
          <Route path="/" element={<HomePage />} />
          <Route path="/Skin" element={<SkinAnalysisStep1 />} />
        */}

        {/* --- 수정된 코드 --- */}
        {/* 기본 주소(path="/")로 접속하면 바로 SkinAnalysisStep1 페이지를 보여줌 */}
        <Route path="/disease-analysis-step1" element={<SkinAnalysisStep1 />} />

        {/* 
          만약 /Skin 주소를 유지하고 싶다면 그대로 두어도 괜찮습니다.
          이 경우, http://localhost:5173/ 와 http://localhost:5173/Skin 두 주소 모두
          같은 페이지를 보여주게 됩니다. 
          지금은 하나만 남겨두는 것이 깔끔합니다.
        */}
      </Routes>
    </>
  );
}

export default App;