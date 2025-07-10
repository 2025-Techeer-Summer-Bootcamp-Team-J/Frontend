import { Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 임포트
import SkinAnalysisStep1 from './pages/DiseaseAnalysisStep1'; 
import DiseaseAnalysisStep2Page from './pages/DiseaseAnalysisStep2';
import AnalysisResultPage from './pages/DiseaseAnalysisStep3';
import { GlobalStyle } from './styles/GlobalStyle';
import Layout from './components/Layout';
import SignInPage from './pages/SigninPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import TodaysCare from './pages/TodaysCare';

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        {/* 공통 레이아웃(헤더 등)을 사용하는 페이지 그룹 */}
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/disease-analysis-step1" element={<SkinAnalysisStep1 />} />
          <Route path="/disease-analysis-step2" element={<DiseaseAnalysisStep2Page />} />
          <Route path="/disease-analysis-step3" element={<AnalysisResultPage />} />
          <Route path="/todays-care" element={<TodaysCare />} />
        </Route>

        {/* 단독으로 표시되는 페이지 그룹 */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

export default App;
