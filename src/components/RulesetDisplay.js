import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';

const RulesetDisplay = ({ ruleset, onReset }) => {
  const [viewMode, setViewMode] = useState('markdown'); // 'markdown' or 'json'

  // Performance Optimization: Memoize JSON stringification
  // This prevents expensive serialization on every render when viewMode changes
  // or when parent re-renders but ruleset data is the same.
  const formattedJson = useMemo(() => {
    return JSON.stringify(ruleset.json_data, null, 2);
  }, [ruleset.json_data]);

  const downloadFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    
    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();
    
    URL.revokeObjectURL(a.href);
  };

  const handleDownloadMarkdown = () => {
    downloadFile(ruleset.markdown, 'project-ruleset.md', 'text/markdown');
  };

  const handleDownloadJSON = () => {
    downloadFile(
      formattedJson,
      'project-ruleset.json', 
      'application/json'
    );
  };

  const copyToClipboard = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      alert('İçerik panoya kopyalandı!');
    } catch (err) {
      console.error('Kopyalama hatası:', err);
      alert('Kopyalama sırasında bir hata oluştu.');
    }
  };

  return (
    <div className="ruleset-display">
      <div className="ruleset-actions">
        <button 
          className={`action-btn ${viewMode === 'markdown' ? 'primary' : ''}`}
          onClick={() => setViewMode('markdown')}
        >
          📝 Markdown Görünümü
        </button>
        
        <button 
          className={`action-btn ${viewMode === 'json' ? 'primary' : ''}`}
          onClick={() => setViewMode('json')}
        >
          🔧 JSON Görünümü
        </button>
        
        <button 
          className="action-btn secondary"
          onClick={handleDownloadMarkdown}
        >
          📥 Markdown İndir
        </button>
        
        <button 
          className="action-btn secondary"
          onClick={handleDownloadJSON}
        >
          📥 JSON İndir
        </button>
        
        <button 
          className="action-btn"
          onClick={() => copyToClipboard(viewMode === 'markdown' ? ruleset.markdown : formattedJson)}
        >
          📋 Kopyala
        </button>
        
        <button 
          className="action-btn danger"
          onClick={onReset}
        >
          🔄 Yeni Ruleset
        </button>
      </div>

      <div className="ruleset-content">
        {viewMode === 'markdown' ? (
          <div className="markdown-content">
            <ReactMarkdown>{ruleset.markdown}</ReactMarkdown>
          </div>
        ) : (
          <div className="json-content">
            <pre style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'auto',
              textAlign: 'left',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {formattedJson}
            </pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '8px' }}>
        <h3>🎯 Nasıl Kullanılır?</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li><strong>GitHub Copilot:</strong> Bu ruleset'i proje dosyanızın kök dizinine <code>.copilot-rules.md</code> olarak kaydedin</li>
          <li><strong>Cursor IDE:</strong> Ruleset'i <code>.cursorrules</code> dosyası olarak proje kök dizininize kaydedin</li>
          <li><strong>ChatGPT/Claude:</strong> Kod geliştirme isteklerinizin başında bu ruleset'i context olarak verin</li>
          <li><strong>VS Code:</strong> Workspace ayarlarınızda bu kuralları belirtin veya proje README'nize ekleyin</li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(RulesetDisplay);
// Performance Optimization: Wrapped in React.memo to prevent unnecessary
// re-renders of expensive ReactMarkdown and JSON views when parent re-renders
