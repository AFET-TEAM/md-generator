import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectForm from './components/ProjectForm';
import RulesetDisplay from './components/RulesetDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import API_BASE_URL from './config/api';
import './App.css';

function App() {
  const [ruleset, setRuleset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  // Check API status on component mount
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/health`);
        setApiStatus(response.data);
      } catch (err) {
        console.error('API status check failed:', err);
      }
    };
    
    checkApiStatus();
  }, []);


  console.log('API Status:', apiStatus);
  
  const handleFormSubmit = async (projectData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/generate-ruleset`, projectData);
      setRuleset(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Bir hata oluştu');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRuleset(null);
    setError(null);
  };

  return (
    <div className="App">      <header className="App-header">
        <h1>🤖 AI Ruleset Generator</h1>
        <p>Proje tercihlerinizi AI asistanları için kurallar setine dönüştürün</p>
        
        {apiStatus && (
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}>
            🔧 AI Provider: <strong>{apiStatus.ai_provider}</strong> 
            {apiStatus.ai_provider === 'ollama' && (
              <span> - {apiStatus.ai_status === 'connected' ? '✅ Bağlı' : '❌ Bağlantı Yok'}</span>
            )}
            {apiStatus.ai_provider === 'openai' && (
              <span> - {apiStatus.ai_status === 'configured' ? '✅ Yapılandırılmış' : '❌ API Key Gerekli'}</span>
            )}
            {apiStatus.ai_provider === 'huggingface' && (
              <span> - {apiStatus.ai_status === 'configured' ? '✅ Yapılandırılmış' : '❌ Token Gerekli'}</span>
            )}
          </div>
        )}
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            <h3>❌ Hata</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Kapat</button>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {!ruleset && !loading && (
          <ProjectForm onSubmit={handleFormSubmit} />
        )}

        {ruleset && !loading && (
          <RulesetDisplay 
            ruleset={ruleset} 
            onReset={handleReset}
          />
        )}
      </main>

      <footer className="App-footer">
     
        <h3>Tüm Hakları Saklıdır - Atmosware</h3>
      </footer>
    </div>
  );
}

export default App;
