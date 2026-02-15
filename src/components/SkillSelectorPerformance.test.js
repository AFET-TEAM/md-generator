import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import SkillSelector from './SkillSelector';

// Generate a large dataset function
const generateLargeDataset = () => {
  const categories = [];
  for (let i = 0; i < 50; i++) {
    const skills = [];
    for (let j = 0; j < 100; j++) {
      skills.push({
        id: `cat-${i}-skill-${j}`,
        name: `Category ${i} Skill ${j}`,
        description: `Description for skill ${j} in category ${i}`
      });
    }
    categories.push({
      id: `cat-${i}`,
      name: `Category ${i}`,
      skills: skills
    });
  }
  return categories;
};

// Use doMock to avoid hoisting issues
jest.mock('../data/skills', () => ({
  SKILL_CATEGORIES: generateLargeDataset()
}));

describe('SkillSelector Benchmark', () => {
  test('measures render performance with large dataset', () => {
    const selectedSkills = [];
    // Select LAST 500 skills to force deep search in unoptimized version
    for(let i=45; i<50; i++) {
      for(let j=0; j<100; j++) {
        selectedSkills.push(`cat-${i}-skill-${j}`);
      }
    }

    const onSkillsChange = jest.fn();

    const start = performance.now();

    // Render repeatedly to get a measurable time
    for (let i = 0; i < 10; i++) {
      render(
        <SkillSelector
          selectedSkills={selectedSkills}
          onSkillsChange={onSkillsChange}
        />
      );
    }

    const end = performance.now();
    const duration = end - start;

    console.log(`[BENCHMARK] Total render time for 10 iterations: ${duration.toFixed(2)}ms`);
    console.log(`[BENCHMARK] Average render time: ${(duration / 10).toFixed(2)}ms`);

    expect(true).toBe(true);
  });

  test('measures re-render performance on interaction with MANY selected skills (worst case)', async () => {
    const selectedSkills = [];
    // Select LAST 500 skills to force deep search in unoptimized version
    for(let i=45; i<50; i++) {
      for(let j=0; j<100; j++) {
        selectedSkills.push(`cat-${i}-skill-${j}`);
      }
    }

    const onSkillsChange = jest.fn();

    const { getByPlaceholderText } = render(
      <SkillSelector
        selectedSkills={selectedSkills}
        onSkillsChange={onSkillsChange}
      />
    );

    const start = performance.now();

    // Trigger re-renders by typing
    const input = getByPlaceholderText('Skill ara...');

    await act(async () => {
        fireEvent.change(input, { target: { value: 'Skill 50' } });
    });

    const end = performance.now();
    const duration = end - start;

    console.log(`[BENCHMARK] Interaction (search) time with 500 selected skills (worst case): ${duration.toFixed(2)}ms`);
    expect(true).toBe(true);
  });
});
