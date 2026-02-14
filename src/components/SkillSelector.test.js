import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentCard from './AgentCard';
import SkillSelector from './SkillSelector';

// Mock SkillSelector to spy on props passed by AgentCard
jest.mock('./SkillSelector', () => {
  return jest.fn(() => <div data-testid="skill-selector">Mock SkillSelector</div>);
});

describe('SkillSelector Performance Optimization', () => {
  const mockUpdate = jest.fn();
  const mockRemove = jest.fn();
  const agent = {
    id: '1',
    name: 'Agent 1',
    description: 'Desc',
    role: 'role',
    skills: ['skill1'],
    instructions: ''
  };

  beforeEach(() => {
    SkillSelector.mockClear();
    mockUpdate.mockClear();
  });

  test('AgentCard passes stable onSkillsChange callback to SkillSelector', () => {
    // 1. Initial Render
    const { rerender } = render(
      <AgentCard
        agent={agent}
        index={0}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
      />
    );

    // 2. Open Skill Selector
    const skillButton = screen.getByText('Yetenek Sec');
    fireEvent.click(skillButton);

    const firstRenderProps = SkillSelector.mock.calls[0][0];

    // 3. Update Agent Name (Parent Re-render)
    const updatedAgent = { ...agent, name: 'Agent 1 Updated' };

    rerender(
      <AgentCard
        agent={updatedAgent}
        index={0}
        onUpdate={mockUpdate}
        onRemove={mockRemove}
      />
    );

    // Get props from second render (Mock was called again because it's not memoized itself)
    const secondRenderProps = SkillSelector.mock.calls[1][0];

    // Verification 1: Callback must be stable (Reference Equality)
    expect(secondRenderProps.onSkillsChange).toBe(firstRenderProps.onSkillsChange);

    // Verification 2: Skills array must be stable (Reference Equality)
    expect(secondRenderProps.selectedSkills).toBe(firstRenderProps.selectedSkills);
  });

  test('SkillSelector component is wrapped in React.memo', () => {
    // Import the actual component to check if it's memoized
    const RealSkillSelector = jest.requireActual('./SkillSelector').default;

    // React.memo returns an object with $$typeof property equal to Symbol(react.memo)
    expect(typeof RealSkillSelector).toBe('object');
    expect(RealSkillSelector.$$typeof).toBeDefined();
    expect(String(RealSkillSelector.$$typeof)).toContain('react.memo');
  });
});
