import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AgentCard from './AgentCard';

// Mock SkillSelector module
jest.mock('./SkillSelector', () => {
  const React = require('react');

  // Create the mock implementation function
  const MockComponent = jest.fn((props) => <div data-testid="skill-selector">SkillSelector</div>);

  // Wrap it in React.memo
  const Memoized = React.memo(MockComponent);

  // Return an object that has default export (what AgentCard uses)
  // AND a named export (what we use to spy on calls)
  return {
    __esModule: true,
    default: Memoized,
    _MockComponent: MockComponent
  };
});

// Import the named export we created in the mock factory
// Note: This works because we mocked the module to export this named export
import { _MockComponent } from './SkillSelector';

describe('AgentCard Performance', () => {
  beforeEach(() => {
    _MockComponent.mockClear();
  });

  test('SkillSelector does not re-render when agent name changes', () => {
    const onUpdate = jest.fn();
    const agent = {
        id: '1',
        name: 'Agent 1',
        skills: ['skill-1'],
        description: 'Desc',
        role: 'role'
    };

    const { rerender } = render(
        <AgentCard
            agent={agent}
            index={0}
            onUpdate={onUpdate}
            onRemove={jest.fn()}
        />
    );

    // Open skill selector to mount it
    const toggleButton = screen.getByText('Yetenek Sec');
    fireEvent.click(toggleButton);

    // Check initial render count of SkillSelector
    expect(_MockComponent).toHaveBeenCalledTimes(1);

    // Update name. We create a NEW object for agent, but keep skills reference same.
    const newAgent = { ...agent, name: 'Agent 1 Updated' };

    // Rerender AgentCard with new props
    rerender(
        <AgentCard
            agent={newAgent}
            index={0}
            onUpdate={onUpdate}
            onRemove={jest.fn()}
        />
    );

    // SkillSelector should NOT have re-rendered because props are stable
    expect(_MockComponent).toHaveBeenCalledTimes(1);

    // Verify negative case: changing skills triggers render
    const agentWithNewSkills = { ...agent, skills: ['skill-2'] };
    rerender(
        <AgentCard
            agent={agentWithNewSkills}
            index={0}
            onUpdate={onUpdate}
            onRemove={jest.fn()}
        />
    );
    // Should render again (total 2)
    expect(_MockComponent).toHaveBeenCalledTimes(2);
  });
});
