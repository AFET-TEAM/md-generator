import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MultiAgentConfigurator from './MultiAgentConfigurator';
import AgentCard from './AgentCard';

// Mock react-markdown to avoid ESM issues
jest.mock('react-markdown', () => (props) => {
  return <div data-testid="markdown">{props.children}</div>
});

// Mock AgentCard to spy on props
jest.mock('./AgentCard', () => {
  return jest.fn(() => <div data-testid="agent-card">Mock Agent</div>);
});

describe('MultiAgentConfigurator Performance Optimization', () => {
  beforeEach(() => {
    AgentCard.mockClear();
  });

  test('passes stable callbacks and props to AgentCard', async () => {
    render(<MultiAgentConfigurator />);

    // Initial render has 1 agent
    expect(AgentCard).toHaveBeenCalledTimes(1);

    // Add another agent to test stability of other items
    const addAgentButton = screen.getByText('+ Bos Ajan Ekle');
    fireEvent.click(addAgentButton);

    // Now we have 2 agents.
    // AgentCard called 1 (initial) + 2 (after add) = 3 times.
    // Last 2 calls are for index 0 and index 1.
    const callsAfterAdd = AgentCard.mock.calls.slice(-2);
    // Ensure we grabbed the right calls by checking index
    const propsAgent0_Before = callsAfterAdd.find(call => call[0].index === 0)[0];
    const propsAgent1_Before = callsAfterAdd.find(call => call[0].index === 1)[0];

    expect(propsAgent0_Before).toBeDefined();
    expect(propsAgent1_Before).toBeDefined();

    // Clear to isolate next update
    AgentCard.mockClear();

    // Trigger update on Agent 0
    // We invoke onUpdate directly from the captured props to simulate child interaction.
    // Signature: onUpdate(index, updatedAgent)
    const newName = 'Updated Name';
    act(() => {
        propsAgent0_Before.onUpdate(0, { ...propsAgent0_Before.agent, name: newName });
    });

    // Parent re-renders.
    // Since our mock is NOT memoized, it gets called for both agents.
    // This allows us to inspect what props are passed to them.
    expect(AgentCard).toHaveBeenCalledTimes(2);

    const callsAfterUpdate = AgentCard.mock.calls;
    const propsAgent0_After = callsAfterUpdate.find(call => call[0].index === 0)[0];
    const propsAgent1_After = callsAfterUpdate.find(call => call[0].index === 1)[0];

    // VERIFY AGENT 0 (Changed)
    // Agent object should be different
    expect(propsAgent0_After.agent).not.toBe(propsAgent0_Before.agent);
    expect(propsAgent0_After.agent.name).toBe(newName);

    // CRITICAL: Callbacks should be SAME (Stable)
    expect(propsAgent0_After.onUpdate).toBe(propsAgent0_Before.onUpdate);
    expect(propsAgent0_After.onRemove).toBe(propsAgent0_Before.onRemove);

    // VERIFY AGENT 1 (Unchanged)
    // Agent object should be SAME (Referential Equality)
    expect(propsAgent1_After.agent).toBe(propsAgent1_Before.agent);

    // CRITICAL: Callbacks should be SAME
    expect(propsAgent1_After.onUpdate).toBe(propsAgent1_Before.onUpdate);
    expect(propsAgent1_After.onRemove).toBe(propsAgent1_Before.onRemove);

    // CONCLUSION:
    // Since props for Agent 1 are identical (referentially),
    // the React.memo wrapped AgentCard (implemented in source) will SKIP this render.

  });
});
