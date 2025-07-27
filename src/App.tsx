import { Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 임포트
import SkinAnalysisStep1 from './pages/DiseaseAnalysisStep1'; 
import DiseaseAnalysisStep2Page from './pages/DiseaseAnalysisStep2';
import AnalysisResultPage from './pages/DiseaseAnalysisStep3';
import LoadingPage from './pages/LoadingPage';
import { GlobalStyle } from './styles/GlobalStyle';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import TodaysCare from './pages/TodaysCare';
import Dashboard from './pages/Dashboard';
import SkinAnalysis from './pages/SkinAnalysis';
import UserInfoPage from './pages/UserInfoPage';
import RedirectPage from './pages/RedirectPage';
import DiagnosisDetailPage from './pages/DiagnosisDetailPage';

  

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/main" element={<MainPage />} />

          <Route
            path="/disease-analysis-step1"
            element={<SkinAnalysisStep1 />}
          />
          <Route
            path="/disease-analysis-step2"
            element={<DiseaseAnalysisStep2Page />}
          />
          <Route
            path="/disease-analysis-step3"
            element={<AnalysisResultPage />}
          />
          <Route
            path="/loading"
            element={<LoadingPage />}
          />
          <Route
            path="/todays-care"
            element={<TodaysCare />}
          />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
          <Route
            path="/diagnoses/:id"
            element={<DiagnosisDetailPage />}
          />
          <Route
            path="/skin-analysis"
            element={<SkinAnalysis />}
          />
        </Route>

        {/* 단독으로 표시되는 페이지 그룹 */}
        <Route path="/user-info" element={<UserInfoPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
      </Routes>
    </>
  );
}

export default App;
