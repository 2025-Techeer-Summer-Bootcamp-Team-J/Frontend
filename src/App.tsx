import { Routes, Route } from 'react-router-dom';

// 페이지 컴포넌트 임포트
import SkinAnalysisStep1 from './pages/DiseaseAnalysisStep1'; 
import DiseaseAnalysisStep2Page from './pages/DiseaseAnalysisStep2';
import AnalysisResultPage from './pages/DiseaseAnalysisStep3';
import { GlobalStyle } from './styles/GlobalStyle';
import Layout from './components/Layout';
import MainPage from './pages/MainPage';
import TodaysCare from './pages/TodaysCare';
import Dashboard from './pages/Dashboard';
import SkinAnalysis from './pages/SkinAnalysis';
import LoadingPage from './pages/LoadingPage';
import { ProtectedRoute } from './components/ProtectedRoute';

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
            element={<ProtectedRoute><SkinAnalysisStep1 /></ProtectedRoute>}
          />
          <Route 
            path="/disease-analysis-step2" 
            element={<ProtectedRoute><DiseaseAnalysisStep2Page /></ProtectedRoute>}
          />
          <Route 
            path="/disease-analysis-step3" 
            element={<ProtectedRoute><AnalysisResultPage /></ProtectedRoute>}
          />
          <Route 
            path="/todays-care" 
            element={<ProtectedRoute><TodaysCare /></ProtectedRoute>}
          />
          <Route 
            path="/dashboard" 
            element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
          />
          <Route 
            path="/skin-analysis" 
            element={<ProtectedRoute><SkinAnalysis /></ProtectedRoute>}
          />
          <Route 
            path="/loading" 
            element={<ProtectedRoute><LoadingPage /></ProtectedRoute>}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
