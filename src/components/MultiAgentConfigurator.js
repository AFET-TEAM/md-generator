import React, { useState, useCallback } from 'react';
import AgentCard from './AgentCard';
import ConfigFileManager from './ConfigFileManager';
import { AGENT_TEMPLATES, CONFIG_FILE_TYPES } from '../data/skills';

const createEmptyAgent = () => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  name: '',
  description: '',
  role: '',
  skills: [],
  instructions: '',
});

const MultiAgentConfigurator = ({ projectData, onBack }) => {
  const [agents, setAgents] = useState([createEmptyAgent()]);
  const [selectedConfigFiles, setSelectedConfigFiles] = useState(['copilot-instructions', 'copilot-agents']);
  const [generatedConfigs, setGeneratedConfigs] = useState(null);
  const [globalInstructions, setGlobalInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const addAgent = () => {
    setAgents([...agents, createEmptyAgent()]);
  };

  const addAgentFromTemplate = (templateId) => {
    const template = AGENT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setAgents([...agents, {
        ...createEmptyAgent(),
        name: template.name,
        description: template.description,
        role: templateId,
        skills: [...template.defaultSkills],
      }]);
    }
  };

  // Performance Optimization: Use useCallback to ensure stable function reference
  // This allows AgentCard (memoized) to skip re-renders unless its own props change
  const updateAgent = useCallback((index, updatedAgent) => {
    setAgents(prevAgents => {
      const newAgents = [...prevAgents];
      newAgents[index] = updatedAgent;
      return newAgents;
    });
  }, []);

  const removeAgent = useCallback((index) => {
    setAgents(prevAgents => {
      if (prevAgents.length <= 1) return prevAgents;
      return prevAgents.filter((_, i) => i !== index);
    });
  }, []);

  const toggleConfigFile = (configId) => {
    if (selectedConfigFiles.includes(configId)) {
      setSelectedConfigFiles(selectedConfigFiles.filter(id => id !== configId));
    } else {
      setSelectedConfigFiles([...selectedConfigFiles, configId]);
    }
  };

  const validateAgents = () => {
    for (let i = 0; i < agents.length; i++) {
      if (!agents[i].name.trim()) {
        return `Ajan #${i + 1} icin isim gereklidir.`;
      }
      if (!agents[i].skills || agents[i].skills.length === 0) {
        return `Ajan #${i + 1} (${agents[i].name}) icin en az bir skill secmelisiniz.`;
      }
    }
    if (selectedConfigFiles.length === 0) {
      return 'En az bir yapilandirma dosyasi secmelisiniz.';
    }
    return null;
  };

  const generateConfigs = async () => {
    const validationError = validateAgents();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Build the payload for the API
      const payload = {
        project_data: projectData,
        agents: agents.map(agent => ({
          name: agent.name,
          description: agent.description,
          role: agent.role,
          skills: agent.skills,
          instructions: agent.instructions,
        })),
        global_instructions: globalInstructions,
        config_files: selectedConfigFiles,
      };

      // Try API call first, fall back to local generation
      let configs;
      try {
        const API_BASE_URL = (await import('../config/api')).default;
        const axios = (await import('axios')).default;
        const response = await axios.post(`${API_BASE_URL}/generate-multi-agent-config`, payload);
        configs = response.data.configs;
      } catch (apiErr) {
        console.warn('API call failed, generating configs locally:', apiErr.message);
        configs = generateConfigsLocally(payload);
      }

      setGeneratedConfigs(configs);
    } catch (err) {
      setError('Yapilandirma dosyalari olusturulurken bir hata olustu: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateConfigsLocally = (payload) => {
    const configs = {};

    selectedConfigFiles.forEach(configId => {
      const configType = CONFIG_FILE_TYPES.find(c => c.id === configId);
      if (!configType) return;

      switch (configId) {
        case 'copilot-instructions':
          configs[configId] = {
            filename: configType.name,
            content: generateCopilotInstructions(payload),
            format: configType.format,
          };
          break;
        case 'copilot-agents':
          configs[configId] = {
            filename: configType.name,
            content: generateCopilotAgentsYaml(payload),
            format: configType.format,
          };
          break;
        case 'instructions-md':
          configs[configId] = {
            filename: configType.name,
            content: generateInstructionsMd(payload),
            format: configType.format,
          };
          break;
        case 'cursorrules':
          configs[configId] = {
            filename: configType.name,
            content: generateCursorRules(payload),
            format: configType.format,
          };
          break;
        case 'claude-instructions':
          configs[configId] = {
            filename: configType.name,
            content: generateClaudeInstructions(payload),
            format: configType.format,
          };
          break;
        case 'windsurf-rules':
          configs[configId] = {
            filename: configType.name,
            content: generateWindsurfRules(payload),
            format: configType.format,
          };
          break;
        default:
          break;
      }
    });

    return configs;
  };

  const generateCopilotInstructions = (payload) => {
    const { project_data, agents, global_instructions } = payload;
    let md = `# GitHub Copilot Instructions\n\n`;

    if (global_instructions) {
      md += `## Genel Talimatlar\n\n${global_instructions}\n\n`;
    }

    if (project_data) {
      md += `## Proje Bilgileri\n\n`;
      if (project_data.project_category) md += `- **Kategori:** ${project_data.project_category}\n`;
      if (project_data.project_type) md += `- **Tur:** ${project_data.project_type}\n`;
      if (project_data.frontend_framework) md += `- **Frontend Framework:** ${project_data.frontend_framework}\n`;
      if (project_data.backend_language) md += `- **Backend Dili:** ${project_data.backend_language}\n`;
      if (project_data.backend_framework) md += `- **Backend Framework:** ${project_data.backend_framework}\n`;
      if (project_data.database_type) md += `- **Veritabani:** ${project_data.database_type}\n`;
      if (project_data.code_style) md += `- **Kod Stili:** ${project_data.code_style}\n`;
      md += `\n`;
    }

    md += `## Ajanlar\n\n`;
    md += `Bu projede ${agents.length} adet AI ajan tanimlanmistir:\n\n`;

    agents.forEach((agent, i) => {
      md += `### ${i + 1}. ${agent.name}\n\n`;
      md += `**Aciklama:** ${agent.description}\n\n`;
      if (agent.skills.length > 0) {
        md += `**Yetenekler:**\n`;
        agent.skills.forEach(skill => {
          md += `- ${skill.replace(/-/g, ' ')}\n`;
        });
        md += `\n`;
      }
      if (agent.instructions) {
        md += `**Ozel Talimatlar:**\n${agent.instructions}\n\n`;
      }
    });

    return md;
  };

  const generateCopilotAgentsYaml = (payload) => {
    const { agents } = payload;
    let yaml = `# GitHub Copilot Multi-Agent Configuration\n`;
    yaml += `# Bu dosya projedeki AI ajanlarin yapilandirmasini icerir\n\n`;
    yaml += `version: "1.0"\n\n`;
    yaml += `agents:\n`;

    agents.forEach(agent => {
      const safeName = agent.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
      yaml += `  - name: "${safeName}"\n`;
      yaml += `    display_name: "${agent.name}"\n`;
      yaml += `    description: "${agent.description}"\n`;
      if (agent.role) {
        yaml += `    role: "${agent.role}"\n`;
      }
      if (agent.skills.length > 0) {
        yaml += `    skills:\n`;
        agent.skills.forEach(skill => {
          yaml += `      - "${skill}"\n`;
        });
      }
      if (agent.instructions) {
        yaml += `    instructions: |\n`;
        agent.instructions.split('\n').forEach(line => {
          yaml += `      ${line}\n`;
        });
      }
      yaml += `\n`;
    });

    return yaml;
  };

  const generateInstructionsMd = (payload) => {
    const { project_data, agents, global_instructions } = payload;
    let md = `# Project Instructions\n\n`;
    md += `> Bu dosya AI asistanlari icin proje talimatlarini icerir.\n\n`;

    if (global_instructions) {
      md += `## Genel Kurallar\n\n${global_instructions}\n\n`;
    }

    if (project_data) {
      md += `## Teknoloji Yigini\n\n`;
      if (project_data.project_category) md += `- Kategori: ${project_data.project_category}\n`;
      if (project_data.frontend_framework) md += `- Frontend: ${project_data.frontend_framework}\n`;
      if (project_data.styling_approach) md += `- Styling: ${project_data.styling_approach}\n`;
      if (project_data.state_management) md += `- State Management: ${project_data.state_management}\n`;
      if (project_data.backend_language) md += `- Backend: ${project_data.backend_language}\n`;
      if (project_data.backend_framework) md += `- Framework: ${project_data.backend_framework}\n`;
      if (project_data.database_type) md += `- Database: ${project_data.database_type}\n`;
      if (project_data.deployment_platform) md += `- Deployment: ${project_data.deployment_platform}\n`;
      md += `\n`;
    }

    md += `## Tanimli Ajanlar\n\n`;
    agents.forEach((agent, i) => {
      md += `### ${agent.name}\n\n`;
      md += `${agent.description}\n\n`;
      if (agent.skills.length > 0) {
        md += `**Yetenekler:** ${agent.skills.map(s => s.replace(/-/g, ' ')).join(', ')}\n\n`;
      }
      if (agent.instructions) {
        md += `**Talimatlar:**\n\n${agent.instructions}\n\n`;
      }
      if (i < agents.length - 1) md += `---\n\n`;
    });

    return md;
  };

  const generateCursorRules = (payload) => {
    const { project_data, agents, global_instructions } = payload;
    let content = `# Cursor Rules\n\n`;

    if (global_instructions) {
      content += `${global_instructions}\n\n`;
    }

    if (project_data) {
      content += `## Project Stack\n\n`;
      const fields = [
        ['project_category', 'Category'],
        ['frontend_framework', 'Frontend'],
        ['backend_language', 'Backend Language'],
        ['backend_framework', 'Backend Framework'],
        ['database_type', 'Database'],
        ['code_style', 'Code Style'],
      ];
      fields.forEach(([key, label]) => {
        if (project_data[key]) content += `- ${label}: ${project_data[key]}\n`;
      });
      content += `\n`;
    }

    content += `## Agent Roles\n\n`;
    agents.forEach(agent => {
      content += `### ${agent.name}\n`;
      content += `${agent.description}\n`;
      if (agent.skills.length > 0) {
        content += `Skills: ${agent.skills.map(s => s.replace(/-/g, ' ')).join(', ')}\n`;
      }
      if (agent.instructions) {
        content += `\n${agent.instructions}\n`;
      }
      content += `\n`;
    });

    return content;
  };

  const generateClaudeInstructions = (payload) => {
    const { project_data, agents, global_instructions } = payload;
    let md = `# CLAUDE.md - Project Instructions for Claude\n\n`;

    if (global_instructions) {
      md += `## General Guidelines\n\n${global_instructions}\n\n`;
    }

    if (project_data) {
      md += `## Project Context\n\n`;
      if (project_data.project_category) md += `This is a **${project_data.project_category}** project.\n\n`;
      const techStack = [];
      if (project_data.frontend_framework) techStack.push(`Frontend: ${project_data.frontend_framework}`);
      if (project_data.backend_language) techStack.push(`Backend: ${project_data.backend_language} (${project_data.backend_framework || 'N/A'})`);
      if (project_data.database_type) techStack.push(`Database: ${project_data.database_type}`);
      if (techStack.length > 0) {
        md += `### Tech Stack\n\n`;
        techStack.forEach(t => { md += `- ${t}\n`; });
        md += `\n`;
      }
    }

    md += `## Multi-Agent Configuration\n\n`;
    agents.forEach(agent => {
      md += `### ${agent.name}\n\n`;
      md += `> ${agent.description}\n\n`;
      if (agent.skills.length > 0) {
        md += `**Capabilities:** ${agent.skills.map(s => s.replace(/-/g, ' ')).join(', ')}\n\n`;
      }
      if (agent.instructions) {
        md += `**Instructions:**\n\n${agent.instructions}\n\n`;
      }
    });

    return md;
  };

  const generateWindsurfRules = (payload) => {
    const { project_data, agents, global_instructions } = payload;
    let content = `# Windsurf Rules\n\n`;

    if (global_instructions) {
      content += `${global_instructions}\n\n`;
    }

    if (project_data) {
      content += `## Project Configuration\n\n`;
      if (project_data.project_category) content += `- Type: ${project_data.project_category}\n`;
      if (project_data.frontend_framework) content += `- Frontend: ${project_data.frontend_framework}\n`;
      if (project_data.backend_language) content += `- Backend: ${project_data.backend_language}\n`;
      if (project_data.code_style) content += `- Style: ${project_data.code_style}\n`;
      content += `\n`;
    }

    content += `## Agents\n\n`;
    agents.forEach(agent => {
      content += `### ${agent.name}\n\n`;
      content += `${agent.description}\n\n`;
      if (agent.skills.length > 0) {
        content += `Skills: ${agent.skills.map(s => s.replace(/-/g, ' ')).join(', ')}\n\n`;
      }
      if (agent.instructions) {
        content += `${agent.instructions}\n\n`;
      }
    });

    return content;
  };

  return (
    <div className="multi-agent-configurator">
      <div className="configurator-header">
        <h2>Multi-Agent Yapilandirma</h2>
        <p>Projeniz icin birden fazla AI ajan tanimlayip, her birine ozel yetenekler atayin.</p>
      </div>

      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Kapat</button>
        </div>
      )}

      {/* Global Instructions */}
      <div className="form-section">
        <h3>Genel Talimatlar</h3>
        <div className="form-group">
          <label>Tum ajanlar icin gecerli genel talimatlar</label>
          <textarea
            value={globalInstructions}
            onChange={(e) => setGlobalInstructions(e.target.value)}
            placeholder="Ornegin: Her zaman Turkce yorum yaz, SOLID prensiplerine uy, kodlama standartlarina dikkat et..."
            rows="4"
          />
        </div>
      </div>

      {/* Agent List */}
      <div className="agents-section">
        <div className="agents-section-header">
          <h3>Ajanlar ({agents.length})</h3>
          <div className="agent-add-actions">
            <button type="button" className="action-btn primary" onClick={addAgent}>
              + Bos Ajan Ekle
            </button>
            <div className="template-dropdown">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addAgentFromTemplate(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="">Sablondan Ekle...</option>
                {AGENT_TEMPLATES.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="agents-list">
          {agents.map((agent, index) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={index}
              onUpdate={updateAgent}
              onRemove={removeAgent}
            />
          ))}
        </div>
      </div>

      {/* Config File Selection */}
      <div className="form-section">
        <h3>Yapilandirma Dosyalari</h3>
        <p style={{ marginBottom: '1rem', opacity: 0.8, fontSize: '0.9rem' }}>
          Hangi AI araci icin yapilandirma dosyasi olusturmak istediginizi secin:
        </p>
        <div className="config-file-grid">
          {CONFIG_FILE_TYPES.map(config => (
            <label
              key={config.id}
              className={`config-file-option ${selectedConfigFiles.includes(config.id) ? 'selected' : ''}`}
            >
              <input
                type="checkbox"
                checked={selectedConfigFiles.includes(config.id)}
                onChange={() => toggleConfigFile(config.id)}
              />
              <div className="config-file-info">
                <span className="config-file-name">{config.name}</span>
                <span className="config-file-desc">{config.description}</span>
                <span className="config-file-tool">{config.targetTool}</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <div className="generate-actions">
        {onBack && (
          <button type="button" className="action-btn" onClick={onBack}>
            Geri Don
          </button>
        )}
        <button
          type="button"
          className="submit-btn"
          onClick={generateConfigs}
          disabled={isGenerating}
        >
          {isGenerating ? 'Olusturuluyor...' : 'Yapilandirma Dosyalarini Olustur'}
        </button>
      </div>

      {/* Generated Configs Display */}
      {generatedConfigs && (
        <ConfigFileManager
          configs={generatedConfigs}
          onReset={() => setGeneratedConfigs(null)}
        />
      )}
    </div>
  );
};

export default MultiAgentConfigurator;
