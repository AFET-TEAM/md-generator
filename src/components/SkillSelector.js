import React, { useState, useMemo, useCallback } from 'react';
import { SKILL_CATEGORIES } from '../data/skills';

// Performance Optimization: Pre-compute skill name lookup map
// This avoids O(N*M) nested loop searches during render
const SKILL_NAME_MAP = {};
const SKILL_ID_TO_CATEGORY_ID_MAP = {};
// Performance Optimization: Pre-compute search terms to avoid
// O(N*M) toLowerCase() calls during render for each keystroke
const SKILL_SEARCH_TERMS_MAP = {};
// Performance Optimization: Pre-compute category lookup map to avoid O(N) finds
const CATEGORY_MAP = {};
// Performance Optimization: Pre-compute initial counts object to clone via Object.assign
// instead of dynamically initializing in a loop during every render inside useMemo.
const INITIAL_CATEGORY_COUNTS = {};

SKILL_CATEGORIES.forEach(cat => {
  TEMPLATE_COUNTS[cat.id] = 0;
  CATEGORY_MAP[cat.id] = cat;
  INITIAL_CATEGORY_COUNTS[cat.id] = 0;
  cat.skills.forEach(skill => {
    SKILL_NAME_MAP[skill.id] = skill.name;
    SKILL_ID_TO_CATEGORY_ID_MAP[skill.id] = cat.id;
    SKILL_SEARCH_TERMS_MAP[skill.id] = {
      nameLower: skill.name.toLowerCase(),
      descLower: skill.description.toLowerCase(),
    };
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
    const category = CATEGORY_MAP[categoryId];
    if (!category) return;

    // Performance Optimization: Use for loop instead of map().every()
    // This avoids intermediate array allocation and stops early if a skill is not selected.
    let allSelected = true;
    for (let i = 0; i < category.skills.length; i++) {
      if (!selectedSkillsSet.has(category.skills[i].id)) {
        allSelected = false;
        break;
      }
    }

    if (allSelected) {
      // Performance Optimization: Use Set for O(1) lookups during filter instead of .includes() O(N)
      // This changes removal from O(Selected * CategorySkills) to O(Selected + CategorySkills)
      const categorySkillIdsSet = new Set();
      for (let i = 0; i < category.skills.length; i++) {
        categorySkillIdsSet.add(category.skills[i].id);
      }
      onSkillsChange(selectedSkills.filter(id => !categorySkillIdsSet.has(id)));
    } else {
      // Performance Optimization: Append only unselected skills to avoid large Set allocation
      const newSkills = [...selectedSkills];
      for (let i = 0; i < category.skills.length; i++) {
        const skillId = category.skills[i].id;
        if (!selectedSkillsSet.has(skillId)) {
          newSkills.push(skillId);
        }
      }
      onSkillsChange(newSkills);
    }
  }, [selectedSkills, onSkillsChange, selectedSkillsSet]);

  // Performance Optimization: Memoize filtered results
  // Only recalculate when searchTerm changes, not when expanding/collapsing categories
  const filteredCategories = useMemo(() => {
    if (!searchTerm) {
      return SKILL_CATEGORIES;
    }

    // Performance Optimization: Hoist searchTerm.toLowerCase() outside the nested loops
    // This prevents recalculating the same string transformation O(N*M) times during render
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Performance Optimization: Replace map/filter with traditional for loops
    // Eliminates intermediate array allocations and reduces function call overhead
    const result = [];
    for (let i = 0; i < SKILL_CATEGORIES.length; i++) {
      const cat = SKILL_CATEGORIES[i];
      const matchedSkills = [];
      for (let j = 0; j < cat.skills.length; j++) {
        const skill = cat.skills[j];
        const searchTerms = SKILL_SEARCH_TERMS_MAP[skill.id];
        if (searchTerms.nameLower.includes(lowerSearchTerm) ||
            searchTerms.descLower.includes(lowerSearchTerm)) {
          matchedSkills.push(skill);
        }
      }
      if (matchedSkills.length > 0) {
        result.push({ ...cat, skills: matchedSkills });
      }
    }
    return result;
  }, [searchTerm]);

  // Performance Optimization: Pre-calculate category counts
  // When no search is active, this is O(SelectedSkills) instead of O(TotalSkills)
  const categoryCounts = useMemo(() => {
    // Performance Optimization: Clone pre-computed template instead of dynamic for-loop initialization
    // This provides a measurable speedup during frequent re-renders (like typing in search).
    const counts = Object.assign({}, INITIAL_CATEGORY_COUNTS);

    if (searchTerm) {
      // Fallback for search: count only visible skills
      // Performance Optimization: Replace forEach/reduce with traditional for loops
      for (let i = 0; i < filteredCategories.length; i++) {
        const cat = filteredCategories[i];
        let count = 0;
        for (let j = 0; j < cat.skills.length; j++) {
          if (selectedSkillsSet.has(cat.skills[j].id)) {
            count++;
          }
        }
        counts[cat.id] = count;
      }
    } else {
      // Optimized path: iterate only selected skills
      // This is O(M) where M is selected skills count, vs O(N) total skills
      for (let i = 0; i < selectedSkills.length; i++) {
        const skillId = selectedSkills[i];
        const catId = SKILL_ID_TO_CATEGORY_ID_MAP[skillId];
        if (catId && counts[catId] !== undefined) {
          counts[catId]++;
        }
      }
    }
    return counts;
  }, [selectedSkills, searchTerm, filteredCategories, selectedSkillsSet]);

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
            {selectedSkills.slice(0, 20).map(skillId => (
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
            {selectedSkills.length > 20 && (
              <span className="skill-tag-more">+{selectedSkills.length - 20} daha...</span>
            )}
          </div>
        </div>
      )}

      <div className="skill-categories">
        {filteredCategories.map(category => {
          const selectedInCategory = categoryCounts[category.id] || 0;
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
