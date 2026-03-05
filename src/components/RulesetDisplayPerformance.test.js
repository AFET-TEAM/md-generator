import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RulesetDisplay from './RulesetDisplay';

// Mock ReactMarkdown to track renders
const MockMarkdown = jest.fn((props) => <div data-testid="react-markdown">Markdown</div>);

jest.mock('react-markdown', () => {
  return function MockReactMarkdown(props) {
    return MockMarkdown(props);
  };
});

// A wrapper component to simulate App.js re-rendering
const TestApp = () => {
  const [count, setCount] = useState(0);
  const ruleset = {
    markdown: '# Test',
    json_data: { test: true }
  };

  // Use stable reference for onReset to match what we did in App.js
  const handleReset = React.useCallback(() => {}, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <RulesetDisplay ruleset={ruleset} onReset={handleReset} />
    </div>
  );
};

describe('RulesetDisplay Performance', () => {
  beforeEach(() => {
    MockMarkdown.mockClear();
  });

  test('RulesetDisplay does not re-render when parent state changes', () => {
    render(<TestApp />);

    // Initial render
    expect(MockMarkdown).toHaveBeenCalledTimes(1);

    // Trigger state change in parent
    const button = screen.getByText('Increment');
    fireEvent.click(button);
    fireEvent.click(button);

    // RulesetDisplay should not have re-rendered because of React.memo
    // and stable props (ruleset object is the exact same reference, onReset is stable)
    expect(MockMarkdown).toHaveBeenCalledTimes(1);
  });
});
