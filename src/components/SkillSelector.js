import React, { useState, useMemo, useCallback } from 'react';
import { SKILL_CATEGORIES } from '../data/skills';

// Performance Optimization: Pre-compute skill name lookup map
// This avoids O(N*M) nested loop searches during render
const SKILL_NAME_MAP = {};
SKILL_CATEGORIES.forEach(cat => {
  cat.skills.forEach(skill => {
    SKILL_NAME_MAP[skill.id] = skill.name;
  });
});

const SkillSelector = ({ selectedSkills, onSkillsChange }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Performance Optimization: Use Set for O(1) lookup of selected skills
  // This reduces complexity from O(N*M) to O(N + M) during render
  const selectedSkillsSet = useMemo(() => new Set(selectedSkills), [selectedSkills]);

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategory(prev => prev === categoryId ? null : categoryId);
  }, []);

  const toggleSkill = useCallback((skillId) => {
    if (selectedSkillsSet.has(skillId)) {
      onSkillsChange(selectedSkills.filter(id => id !== skillId));
    } else {
      onSkillsChange([...selectedSkills, skillId]);
    }
  }, [selectedSkills, selectedSkillsSet, onSkillsChange]);

  const selectAllInCategory = useCallback((categoryId) => {
    const category = SKILL_CATEGORIES.find(c => c.id === categoryId);
    if (!category) return;
    const categorySkillIds = category.skills.map(s => s.id);
    const allSelected = categorySkillIds.every(id => selectedSkillsSet.has(id));

    if (allSelected) {
      onSkillsChange(selectedSkills.filter(id => !categorySkillIds.includes(id)));
    } else {
      const newSkills = [...new Set([...selectedSkills, ...categorySkillIds])];
      onSkillsChange(newSkills);
    }
  }, [selectedSkills, onSkillsChange]);

  // Performance Optimization: Use Set for O(1) lookups instead of Array.includes O(N)
  const selectedSkillsSet = useMemo(() => new Set(selectedSkills), [selectedSkills]);

  // Performance Optimization: Memoize filtered results
  // Only recalculate when searchTerm changes, not when expanding/collapsing categories
  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return SKILL_CATEGORIES;
    }

    return SKILL_CATEGORIES.map(cat => ({
      ...cat,
      skills: cat.skills.filter(skill =>
        skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(cat => cat.skills.length > 0);
  }, [searchTerm]);

  const getSkillName = (skillId) => {
    return SKILL_NAME_MAP[skillId] || skillId;
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
          const selectedInCategory = categorySkillIds.filter(id => selectedSkillsSet.has(id)).length;
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
                      className={`skill-item ${selectedSkillsSet.has(skill.id) ? 'selected' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkillsSet.has(skill.id)}
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
