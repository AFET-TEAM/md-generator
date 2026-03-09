import React, { useState, useMemo } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfigFileManager from './ConfigFileManager';

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
  // Need to memoize props, otherwise creating a new object on each render
  // will cause React.memo to always fail
  const configs = useMemo(() => ({
    'test': {
      filename: 'test.md',
      content: '# Test',
      format: 'markdown'
    }
  }), []);

  // Use stable reference for onReset to match what we did in App.js
  const handleReset = React.useCallback(() => {}, []);

  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <ConfigFileManager configs={configs} onReset={handleReset} />
    </div>
  );
};

describe('ConfigFileManager Performance', () => {
  beforeEach(() => {
    MockMarkdown.mockClear();
  });

  test('ConfigFileManager does not re-render when parent state changes', () => {
    render(<TestApp />);

    // Initial render
    expect(MockMarkdown).toHaveBeenCalledTimes(1);

    // Trigger state change in parent
    const button = screen.getByText('Increment');
    fireEvent.click(button);
    fireEvent.click(button);

    // ConfigFileManager should not have re-rendered because of React.memo
    // and stable props (configs object is the exact same reference, onReset is stable)
    expect(MockMarkdown).toHaveBeenCalledTimes(1);
  });
});
