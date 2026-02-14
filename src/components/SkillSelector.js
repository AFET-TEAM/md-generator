import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/skills';

const SkillSelector = ({ selectedSkills, onSkillsChange }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleSkill = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      onSkillsChange(selectedSkills.filter(id => id !== skillId));
    } else {
      onSkillsChange([...selectedSkills, skillId]);
    }
  };

  const selectAllInCategory = (categoryId) => {
    const category = SKILL_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;
    const categorySkillIds = category.skills.map(s => s.id);
    const allSelected = categorySkillIds.every(id => selectedSkills.includes(id));

    if (allSelected) {
      onSkillsChange(selectedSkills.filter(id => !categorySkillIds.includes(id)));
    } else {
      const newSkills = [...new Set([...selectedSkills, ...categorySkillIds])];
      onSkillsChange(newSkills);
    }
  };

  const filteredCategories = searchTerm
    ? SKILL_CATEGORIES.map(cat => ({
        ...cat,
        skills: cat.skills.filter(skill =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          skill.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(cat => cat.skills.length > 0)
    : SKILL_CATEGORIES;

  const getSkillName = (skillId) => {
    for (const cat of SKILL_CATEGORIES) {
      const skill = cat.skills.find(s => s.id === skillId);
      if (skill) return skill.name;
    }
    return skillId;
  };

  return (
    <div className="skill-selector">
      <div className="skill-search">
        <input
          type="text"
          placeholder="Skill ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="skill-search-input"
        />
      </div>

      {selectedSkills.length > 0 && (
        <div className="selected-skills-summary">
          <span className="selected-count">{selectedSkills.length} skill secili</span>
          <div className="selected-skill-tags">
            {selectedSkills.map(skillId => (
              <span key={skillId} className="skill-tag">
                {getSkillName(skillId)}
                <button
                  type="button"
                  onClick={() => toggleSkill(skillId)}
                  className="skill-tag-remove"
                >
                  x
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="skill-categories">
        {filteredCategories.map(category => {
          const categorySkillIds = category.skills.map(s => s.id);
          const selectedInCategory = categorySkillIds.filter(id => selectedSkills.includes(id)).length;
          const isExpanded = expandedCategory === category.id || searchTerm.length > 0;

          return (
            <div key={category.id} className="skill-category">
              <div
                className="skill-category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="category-header-left">
                  <span className={`category-arrow ${isExpanded ? 'expanded' : ''}`}>
                    &#9654;
                  </span>
                  <span className="category-name">{category.name}</span>
                  {selectedInCategory > 0 && (
                    <span className="category-badge">{selectedInCategory}</span>
                  )}
                </div>
                <button
                  type="button"
                  className="category-select-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    selectAllInCategory(category.id);
                  }}
                >
                  {selectedInCategory === category.skills.length ? 'Hepsini Kaldir' : 'Tumunu Sec'}
                </button>
              </div>

              {isExpanded && (
                <div className="skill-category-items">
                  {category.skills.map(skill => (
                    <label
                      key={skill.id}
                      className={`skill-item ${selectedSkills.includes(skill.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill.id)}
                        onChange={() => toggleSkill(skill.id)}
                      />
                      <div className="skill-item-content">
                        <span className="skill-item-name">{skill.name}</span>
                        <span className="skill-item-desc">{skill.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(SkillSelector);
