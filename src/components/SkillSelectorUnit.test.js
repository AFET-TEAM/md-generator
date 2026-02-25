import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkillSelector from './SkillSelector';
import { SKILL_CATEGORIES } from '../data/skills';

describe('SkillSelector Logic', () => {
  const mockOnSkillsChange = jest.fn();

  test('displays correct selected count for a category', () => {
    // Select 2 skills from the first category
    const category = SKILL_CATEGORIES[0];
    const skill1 = category.skills[0].id;
    const skill2 = category.skills[1].id;
    const selectedSkills = [skill1, skill2];

    render(
      <SkillSelector
        selectedSkills={selectedSkills}
        onSkillsChange={mockOnSkillsChange}
      />
    );

    // Find the category header. It contains the name and the badge.
    // We look for the category name first
    const categoryHeader = screen.getByText(category.name).closest('.skill-category-header');

    // Within header, find the badge with text "2"
    // Since badge is a span with class "category-badge", we can query by text within the header
    // Or just query by text "2" globally if unique enough, but better be specific.

    // Let's use a more robust way:
    // The component structure:
    // <div className="category-header-left">
    //   <span className="category-name">{category.name}</span>
    //   <span className="category-badge">{selectedInCategory}</span>
    // </div>

    // We can find the element with text "2" and check class.
    const badge = screen.getByText('2');
    expect(badge).toHaveClass('category-badge');

    // Ensure it's inside the correct category block is harder without test-ids,
    // but assuming "Kod" is unique category name.
  });

  test('displays "Tumunu Sec" when not all skills selected', () => {
    const category = SKILL_CATEGORIES[0];
    const skill1 = category.skills[0].id;
    // Only 1 selected, not all
    const selectedSkills = [skill1];

    render(
      <SkillSelector
        selectedSkills={selectedSkills}
        onSkillsChange={mockOnSkillsChange}
      />
    );

    // Find the button inside the category header
    // The button text is "Tumunu Sec"
    // We might have multiple "Tumunu Sec" buttons (one for each category).
    // We need the one for our category.

    // Find category name element
    const categoryName = screen.getByText(category.name);
    // Go up to header
    const header = categoryName.closest('.skill-category-header');
    // Find button within header
    // Since we can't easily query "within" using screen, we use `within` utility or DOM traversal.
    // Simple way:
    // The button is a sibling of the left part.

    // Let's rely on getAllByText if needed, but since we render all categories, there will be many buttons.
    // However, if we only check that *at least one* exists in the DOM correctly associated.

    // Better: Filter categories via props? No, component renders all.
    // Let's just find the specific button.

    // We can use `within` from testing-library
    const { within } = require('@testing-library/react');
    const toggleButton = within(header).getByText('Tumunu Sec');
    expect(toggleButton).toBeInTheDocument();
  });

  test('displays "Hepsini Kaldir" when all skills selected', () => {
    const category = SKILL_CATEGORIES[0];
    // Select all skills in this category
    const selectedSkills = category.skills.map(s => s.id);

    render(
      <SkillSelector
        selectedSkills={selectedSkills}
        onSkillsChange={mockOnSkillsChange}
      />
    );

    const { within } = require('@testing-library/react');
    const categoryName = screen.getByText(category.name);
    const header = categoryName.closest('.skill-category-header');

    const removeButton = within(header).getByText('Hepsini Kaldir');
    expect(removeButton).toBeInTheDocument();
  });
});
