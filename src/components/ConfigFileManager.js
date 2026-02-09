import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ConfigFileManager = ({ configs, onReset }) => {
  const configEntries = Object.entries(configs);
  const [activeTab, setActiveTab] = useState(configEntries.length > 0 ? configEntries[0][0] : null);
  const [copyStatus, setCopyStatus] = useState({});

  const downloadFile = (content, filename) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    a.href = URL.createObjectURL(file);
    a.download = filename.split('/').pop(); // Get just the filename part
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadAll = () => {
    configEntries.forEach(([, config]) => {
      downloadFile(config.content, config.filename);
    });
  };

  const copyToClipboard = async (configId, content) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyStatus({ ...copyStatus, [configId]: true });
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [configId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Kopyalama hatasi:', err);
    }
  };

  if (configEntries.length === 0) {
    return (
      <div className="config-file-manager">
        <p>Yapilandirma dosyasi bulunamadi.</p>
      </div>
    );
  }

  const activeConfig = configs[activeTab];

  return (
    <div className="config-file-manager">
      <div className="config-manager-header">
        <h3>Olusturulan Yapilandirma Dosyalari</h3>
        <div className="config-manager-actions">
          <button type="button" className="action-btn secondary" onClick={downloadAll}>
            Tumunu Indir
          </button>
          <button type="button" className="action-btn danger" onClick={onReset}>
            Sifirla
          </button>
        </div>
      </div>

      {/* File Tabs */}
      <div className="config-tabs">
        {configEntries.map(([configId, config]) => (
          <button
            key={configId}
            type="button"
            className={`config-tab ${activeTab === configId ? 'active' : ''}`}
            onClick={() => setActiveTab(configId)}
          >
            {config.filename.split('/').pop()}
          </button>
        ))}
      </div>

      {/* Active File Content */}
      {activeConfig && (
        <div className="config-file-content">
          <div className="config-file-toolbar">
            <span className="config-filename">{activeConfig.filename}</span>
            <span className="config-format-badge">{activeConfig.format}</span>
            <div className="config-file-actions">
              <button
                type="button"
                className="action-btn"
                onClick={() => copyToClipboard(activeTab, activeConfig.content)}
              >
                {copyStatus[activeTab] ? 'Kopyalandi!' : 'Kopyala'}
              </button>
              <button
                type="button"
                className="action-btn secondary"
                onClick={() => downloadFile(activeConfig.content, activeConfig.filename)}
              >
                Indir
              </button>
            </div>
          </div>

          <div className="config-preview">
            {activeConfig.format === 'markdown' ? (
              <div className="markdown-content">
                <ReactMarkdown>{activeConfig.content}</ReactMarkdown>
              </div>
            ) : (
              <pre className="config-raw-content">
                {activeConfig.content}
              </pre>
            )}
          </div>

          {/* Raw View Toggle */}
          <details className="raw-view-toggle">
            <summary>Ham icerik goruntule</summary>
            <pre className="config-raw-content">
              {activeConfig.content}
            </pre>
          </details>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="config-usage-instructions">
        <h4>Kullanim Talimatlari</h4>
        <ul>
          <li>
            <strong>.github/copilot-instructions.md:</strong> Bu dosyayi projenizin
            .github klasorune kopyalayin. GitHub Copilot otomatik olarak bu talimatlari kullanacaktir.
          </li>
          <li>
            <strong>.github/copilot/agents.yml:</strong> Multi-agent yapilandirmasi icin
            .github/copilot/ klasorune kopyalayin.
          </li>
          <li>
            <strong>.cursorrules:</strong> Cursor IDE icin proje kok dizininize kopyalayin.
          </li>
          <li>
            <strong>CLAUDE.md:</strong> Claude Code icin proje kok dizininize kopyalayin.
          </li>
          <li>
            <strong>.windsurfrules:</strong> Windsurf IDE icin proje kok dizininize kopyalayin.
          </li>
          <li>
            <strong>instructions.md:</strong> Genel amacli talimat dosyasi, herhangi bir AI aracinda kullanilabilir.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ConfigFileManager;
