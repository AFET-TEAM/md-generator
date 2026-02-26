import React, { useState, useEffect, lazy, Suspense } from 'react';
import axios from 'axios';
import ProjectForm from './components/ProjectForm';
import RulesetDisplay from './components/RulesetDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import API_BASE_URL from './config/api';
import './App.css';

// Lazy load MultiAgentConfigurator
const MultiAgentConfigurator = lazy(() => import('./components/MultiAgentConfigurator'));

function App() {
  const [ruleset, setRuleset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);
  const [activeMode, setActiveMode] = useState('single'); // 'single' or 'multi-agent'
  const [projectDataForAgents, setProjectDataForAgents] = useState(null);

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

  const handleFormSubmit = async (projectData) => {
    if (activeMode === 'multi-agent') {
      // In multi-agent mode, pass project data to the configurator
      setProjectDataForAgents(projectData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/generate-ruleset`, projectData);
      setRuleset(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Bir hata olustu');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRuleset(null);
    setError(null);
    setProjectDataForAgents(null);
  };

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setRuleset(null);
    setError(null);
    setProjectDataForAgents(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Ruleset Generator</h1>
        <p>Proje tercihlerinizi AI asistanlari icin kurallar setine donusturun</p>

        {apiStatus && (
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginTop: '0.5rem'
          }}>
            AI Provider: <strong>{apiStatus.ai_provider}</strong>
            {apiStatus.ai_provider === 'ollama' && (
              <span> - {apiStatus.ai_status === 'connected' ? 'Bagli' : 'Baglanti Yok'}</span>
            )}
            {apiStatus.ai_provider === 'openai' && (
              <span> - {apiStatus.ai_status === 'configured' ? 'Yapilandirilmis' : 'API Key Gerekli'}</span>
            )}
            {apiStatus.ai_provider === 'huggingface' && (
              <span> - {apiStatus.ai_status === 'configured' ? 'Yapilandirilmis' : 'Token Gerekli'}</span>
            )}
          </div>
        )}

        {/* Mode Tabs */}
        <div className="mode-tabs">
          <button
            className={`mode-tab ${activeMode === 'single' ? 'active' : ''}`}
            onClick={() => handleModeChange('single')}
          >
            Tekli Ruleset
          </button>
          <button
            className={`mode-tab ${activeMode === 'multi-agent' ? 'active' : ''}`}
            onClick={() => handleModeChange('multi-agent')}
          >
            Multi-Agent Yapilandirma
          </button>
        </div>
      </header>

      <main className="App-main">
        {error && (
          <div className="error-message">
            <h3>Hata</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Kapat</button>
          </div>
        )}

        {loading && <LoadingSpinner />}

        {activeMode === 'single' && (
          <>
            {!ruleset && !loading && (
              <ProjectForm onSubmit={handleFormSubmit} />
            )}

            {ruleset && !loading && (
              <RulesetDisplay
                ruleset={ruleset}
                onReset={handleReset}
              />
            )}
          </>
        )}

        {activeMode === 'multi-agent' && (
          <>
            {!projectDataForAgents && !loading && (
              <div className="multi-agent-intro">
                <div className="intro-card">
                  <h3>Multi-Agent Modu</h3>
                  <p>
                    Bu modda projeniz icin birden fazla AI ajan tanimlayabilir,
                    her birine ozel yetenekler atayabilir ve farkli AI araclari icin
                    yapilandirma dosyalari olusturabilirsiniz.
                  </p>
                  <div className="intro-features">
                    <div className="intro-feature">
                      <strong>Ajan Tanimlama</strong>
                      <span>Kod asistani, test muhendisi, guvenlik analisti gibi farkli roller</span>
                    </div>
                    <div className="intro-feature">
                      <strong>Yetenek Secimi</strong>
                      <span>Her ajana ozel yetenekler atayin (kod uretimi, test, dokumantasyon...)</span>
                    </div>
                    <div className="intro-feature">
                      <strong>Coklu Dosya Ciktisi</strong>
                      <span>GitHub Copilot, Cursor, Claude, Windsurf icin config dosyalari</span>
                    </div>
                  </div>
                </div>

                <ProjectForm onSubmit={(data) => setProjectDataForAgents(data)} />
              </div>
            )}

            {projectDataForAgents && !loading && (
              <Suspense fallback={
                <LoadingSpinner
                  title="Multi-Agent Modu Yukleniyor..."
                  message="Gerekli bilesenler hazirlaniyor."
                  subMessage="Lutfen bekleyiniz."
                />
              }>
                <MultiAgentConfigurator
                  projectData={projectDataForAgents}
                  onBack={() => setProjectDataForAgents(null)}
                />
              </Suspense>
            )}
          </>
        )}
      </main>

      <footer className="App-footer">
        <h3>Tum Haklari Saklidir - Atmosware</h3>
      </footer>
    </div>
  );
}

export default App;
