import React, { useState, useCallback } from 'react';
import SkillSelector from './SkillSelector';
import { AGENT_TEMPLATES } from '../data/skills';

const AgentCard = ({ agent, onUpdate, onRemove, index }) => {
// Performance Optimization: Wrapped in React.memo (at export) to prevent unnecessary re-renders
// when other agents are updated. Only re-renders if its own props change.
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSkillSelector, setShowSkillSelector] = useState(false);

  // Pass index to onUpdate to avoid creating a new function in the parent for each item
  const handleFieldChange = (field, value) => {
    onUpdate(index, { ...agent, [field]: value });
  };

  // Performance Optimization: Use stable callback for skills update
  // This prevents SkillSelector from re-rendering when other fields (like name) change
  const handleSkillsChange = useCallback((newSkills) => {
    onUpdate(index, (prevAgent) => ({ ...prevAgent, skills: newSkills }));
  }, [index, onUpdate]);

  const handleTemplateSelect = (templateId) => {
    const template = AGENT_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      onUpdate(index, {
        ...agent,
        name: template.name,
        description: template.description,
        role: templateId,
        skills: template.defaultSkills,
      });
    }
  };

  return (
    <div className="agent-card">
      <div className="agent-card-header">
        <div className="agent-card-title">
          <span className="agent-number">Ajan #{index + 1}</span>
          <span className="agent-name-display">{agent.name || 'Isimsiz Ajan'}</span>
        </div>
        <div className="agent-card-actions">
          <button
            type="button"
            className="agent-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Kucult' : 'Genislet'}
          </button>
          <button
            type="button"
            className="agent-remove-btn"
            onClick={() => onRemove(index)}
          >
            Kaldir
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="agent-card-body">
          {/* Template Selection */}
          <div className="form-group">
            <label>Sablon Sec</label>
            <select
              value={agent.role || ''}
              onChange={(e) => handleTemplateSelect(e.target.value)}
            >
              <option value="">Sablon seciniz...</option>
              {AGENT_TEMPLATES.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
          </div>

          {/* Agent Name */}
          <div className="form-group">
            <label>Ajan Adi *</label>
            <input
              type="text"
              value={agent.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Ornegin: Kod Asistani"
              required
            />
          </div>

          {/* Agent Description */}
          <div className="form-group">
            <label>Aciklama</label>
            <textarea
              value={agent.description}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              placeholder="Bu ajanin ne yaptigini aciklayin..."
              rows="2"
            />
          </div>

          {/* Custom Instructions */}
          <div className="form-group">
            <label>Ozel Talimatlar</label>
            <textarea
              value={agent.instructions || ''}
              onChange={(e) => handleFieldChange('instructions', e.target.value)}
              placeholder="Bu ajana ozel talimatlar yazin..."
              rows="4"
            />
          </div>

          {/* Skills Section */}
          <div className="agent-skills-section">
            <div className="skills-header">
              <label>Yetenekler ({agent.skills?.length || 0} secili)</label>
              <button
                type="button"
                className="action-btn"
                onClick={() => setShowSkillSelector(!showSkillSelector)}
              >
                {showSkillSelector ? 'Yetenekleri Gizle' : 'Yetenek Sec'}
              </button>
            </div>

            {agent.skills?.length > 0 && !showSkillSelector && (
              <div className="agent-skill-chips">
                {agent.skills.map(skillId => (
                  <span key={skillId} className="skill-chip">
                    {skillId.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            {showSkillSelector && (
              <SkillSelector
                selectedSkills={agent.skills || []}
                onSkillsChange={handleSkillsChange}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AgentCard);
