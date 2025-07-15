import React, { useState, useEffect } from 'react';
import { 
  api,
  type SkinType,
  type Disease,
  type Diagnosis,
  type DiagnosisRequest,
  type SkinTypeAnalysisRequest
} from '../services';

const ApiExample: React.FC = () => {
  const [userId] = useState<number>(1);
  
  // State for data
  const [skinTypes, setSkinTypes] = useState<SkinType[]>([]);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [userDiagnoses, setUserDiagnoses] = useState<Diagnosis[]>([]);
  
  // Loading states
  const [loadingStates, setLoadingStates] = useState({
    skinTypes: false,
    diseases: false,
    diagnoses: false,
    analyzingSkin: false,
    creatingDiagnosis: false,
  });

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load initial data
  useEffect(() => {
    loadSkinTypes();
    loadDiseases();
    loadUserDiagnoses();
  }, [userId]);

  const loadSkinTypes = async () => {
    setLoadingStates(prev => ({ ...prev, skinTypes: true }));
    try {
      const data = await api.skintype.getAll();
      setSkinTypes(data);
      setErrors(prev => ({ ...prev, skinTypes: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, skinTypes: '피부 타입 로딩 실패' }));
      console.error('Failed to load skin types:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, skinTypes: false }));
    }
  };

  const loadDiseases = async () => {
    setLoadingStates(prev => ({ ...prev, diseases: true }));
    try {
      const data = await api.diseases.getAll();
      setDiseases(data);
      setErrors(prev => ({ ...prev, diseases: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, diseases: '질병 목록 로딩 실패' }));
      console.error('Failed to load diseases:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, diseases: false }));
    }
  };

  const loadUserDiagnoses = async () => {
    setLoadingStates(prev => ({ ...prev, diagnoses: true }));
    try {
      const data = await api.diagnoses.getByUserId(userId);
      setUserDiagnoses(data);
      setErrors(prev => ({ ...prev, diagnoses: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, diagnoses: '진단 기록 로딩 실패' }));
      console.error('Failed to load user diagnoses:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, diagnoses: false }));
    }
  };

  const handleCreateDiagnosis = async () => {
    setLoadingStates(prev => ({ ...prev, creatingDiagnosis: true }));
    try {
      const diagnosisData: DiagnosisRequest = {
        user_id: userId,
        symptoms: ['redness', 'itching', 'dry_skin'],
        affected_areas: ['face', 'hands'],
        duration: '2_weeks',
        severity: 3,
        additional_info: '평소보다 건조한 날씨에 증상이 심해짐'
      };
      
      const result = await api.diagnoses.create(diagnosisData);
      console.log('진단 생성 성공:', result);
      
      // 진단 목록 새로고침
      await loadUserDiagnoses();
      setErrors(prev => ({ ...prev, createDiagnosis: '' }));
      alert('진단 요청이 성공적으로 전송되었습니다!');
    } catch (error) {
      setErrors(prev => ({ ...prev, createDiagnosis: '진단 요청 실패' }));
      console.error('Failed to create diagnosis:', error);
      alert('진단 요청에 실패했습니다.');
    } finally {
      setLoadingStates(prev => ({ ...prev, creatingDiagnosis: false }));
    }
  };

  const handleAnalyzeSkinType = async () => {
    setLoadingStates(prev => ({ ...prev, analyzingSkin: true }));
    try {
      const analysisData: SkinTypeAnalysisRequest = {
        answers: {
          oily: true,
          sensitive: false,
          acne_prone: true,
          dry_patches: false,
          easy_tanning: true
        }
      };
      
      const result = await api.skintype.analyze(userId, analysisData);
      console.log('피부 타입 분석 성공:', result);
      setErrors(prev => ({ ...prev, analyzeSkin: '' }));
      alert(`피부 타입 분석 완료! 결과: ${result.data.skin_type_name}`);
    } catch (error) {
      setErrors(prev => ({ ...prev, analyzeSkin: '피부 타입 분석 실패' }));
      console.error('Failed to analyze skin type:', error);
      alert('피부 타입 분석에 실패했습니다.');
    } finally {
      setLoadingStates(prev => ({ ...prev, analyzingSkin: false }));
    }
  };

  const handleGetSkinTypeDetail = async (skintypeId: number) => {
    try {
      const skinType = await api.skintype.getById(skintypeId);
      alert(`피부 타입: ${skinType.name}\n설명: ${skinType.description}`);
    } catch (error) {
      console.error('Failed to get skin type detail:', error);
      alert('피부 타입 상세 정보를 가져오는데 실패했습니다.');
    }
  };

  const handleGetDiseaseDetail = async (diseaseId: number) => {
    try {
      const disease = await api.diseases.getById(diseaseId);
      alert(`질병명: ${disease.name}\n설명: ${disease.description}\n심각도: ${disease.severity}`);
    } catch (error) {
      console.error('Failed to get disease detail:', error);
      alert('질병 상세 정보를 가져오는데 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>API 연동 테스트</h1>
      
      {/* 진단 섹션 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>진단 (Diagnosis)</h2>
        <p>
          상태: {loadingStates.diagnoses ? '로딩 중...' : `진단 기록 ${userDiagnoses.length}개`}
          {errors.diagnoses && <span style={{ color: 'red' }}> - {errors.diagnoses}</span>}
        </p>
        
        <button 
          onClick={handleCreateDiagnosis}
          disabled={loadingStates.creatingDiagnosis}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loadingStates.creatingDiagnosis ? '진단 요청 중...' : '진단 요청'}
        </button>
        
        <button 
          onClick={loadUserDiagnoses}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          진단 기록 새로고침
        </button>

        {errors.createDiagnosis && (
          <p style={{ color: 'red', marginTop: '0.5rem' }}>❌ {errors.createDiagnosis}</p>
        )}

        {userDiagnoses.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>최근 진단 기록:</h4>
            {userDiagnoses.slice(0, 3).map((diagnosis) => (
              <div key={diagnosis.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
                <strong>진단 ID: {diagnosis.id}</strong> - 상태: {diagnosis.status}
                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>
                  증상: {diagnosis.symptoms.join(', ')} | 심각도: {diagnosis.severity}/10
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 질병 섹션 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>질병 목록 (Diseases)</h2>
        <p>
          상태: {loadingStates.diseases ? '로딩 중...' : `질병 ${diseases.length}개`}
          {errors.diseases && <span style={{ color: 'red' }}> - {errors.diseases}</span>}
        </p>
        
        <button 
          onClick={loadDiseases}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          질병 목록 새로고침
        </button>

        {diseases.length > 0 && diseases.slice(0, 3).map((disease) => (
          <div key={disease.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>{disease.name}</strong> - {disease.severity}
            <button 
              onClick={() => handleGetDiseaseDetail(disease.id)}
              style={{ 
                marginLeft: '1rem', 
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              상세보기
            </button>
            <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>{disease.description}</p>
          </div>
        ))}
      </section>

      {/* 피부 타입 섹션 */}
      <section style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>피부 타입 (Skin Types)</h2>
        <p>
          상태: {loadingStates.skinTypes ? '로딩 중...' : `피부 타입 ${skinTypes.length}개`}
          {errors.skinTypes && <span style={{ color: 'red' }}> - {errors.skinTypes}</span>}
        </p>
        
        <button 
          onClick={handleAnalyzeSkinType}
          disabled={loadingStates.analyzingSkin}
          style={{ 
            padding: '0.5rem 1rem', 
            marginRight: '1rem',
            backgroundColor: '#fd7e14',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {loadingStates.analyzingSkin ? '분석 중...' : '피부 타입 분석'}
        </button>
        
        <button 
          onClick={loadSkinTypes}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          피부 타입 새로고침
        </button>

        {errors.analyzeSkin && (
          <p style={{ color: 'red', marginTop: '0.5rem' }}>❌ {errors.analyzeSkin}</p>
        )}

        {skinTypes.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            {skinTypes.slice(0, 3).map((skinType) => (
              <div key={skinType.id} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f5f5f5', borderRadius: '4px' }}>
                <strong>{skinType.name}</strong>
                <button 
                  onClick={() => handleGetSkinTypeDetail(skinType.id)}
                  style={{ 
                    marginLeft: '1rem', 
                    padding: '0.25rem 0.5rem',
                    fontSize: '0.8rem',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                  }}
                >
                  상세보기
                </button>
                <p style={{ fontSize: '0.9rem', margin: '0.25rem 0' }}>{skinType.description}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* API 서버 연결 상태 */}
      <section style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9f9' }}>
        <h3>API 서버 연결 상태</h3>
        <p>베이스 URL: {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}</p>
        <p>현재 환경: {import.meta.env.MODE}</p>
        <p>사용자 ID: {userId}</p>
      </section>
    </div>
  );
};

export default ApiExample; 