import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RulesetDisplay from './RulesetDisplay';

// Mock dependencies
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
});

// Mock alert
global.alert = jest.fn();

// Mock react-markdown to avoid ESM issues in Jest
jest.mock('react-markdown', () => (props) => {
  return <div data-testid="react-markdown">{props.children}</div>;
});

const mockRuleset = {
  markdown: '# Test Markdown\n\nThis is a test.',
  json_data: {
    title: 'Test Ruleset',
    rules: [
      { id: 1, content: 'Rule 1' },
      { id: 2, content: 'Rule 2' },
    ]
  }
};

describe('RulesetDisplay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders markdown view by default', () => {
    render(<RulesetDisplay ruleset={mockRuleset} onReset={() => {}} />);

    // Check if markdown content is rendered
    // Since we mock ReactMarkdown, it renders the raw string
    expect(screen.getByText(/# Test Markdown/)).toBeInTheDocument();
    expect(screen.getByText(/This is a test/)).toBeInTheDocument();

    // Check if default view buttons are active correctly
    const markdownBtn = screen.getByText('📝 Markdown Görünümü');
    expect(markdownBtn).toHaveClass('primary');
  });

  test('switches to JSON view when button is clicked', () => {
    render(<RulesetDisplay ruleset={mockRuleset} onReset={() => {}} />);

    // Click JSON view button
    const jsonBtn = screen.getByText('🔧 JSON Görünümü');
    fireEvent.click(jsonBtn);

    // Check if JSON content is rendered
    // We look for a string that is part of the JSON structure
    expect(screen.getByText(/"title": "Test Ruleset"/)).toBeInTheDocument();

    // Check if button state updated
    expect(jsonBtn).toHaveClass('primary');
  });

  test('calls onReset when reset button is clicked', () => {
    const handleReset = jest.fn();
    render(<RulesetDisplay ruleset={mockRuleset} onReset={handleReset} />);

    const resetBtn = screen.getByText('🔄 Yeni Ruleset');
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
  });

  test('copies content to clipboard', async () => {
    render(<RulesetDisplay ruleset={mockRuleset} onReset={() => {}} />);

    const copyBtn = screen.getByText('📋 Kopyala');
    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockRuleset.markdown);

    // Switch to JSON view
    const jsonBtn = screen.getByText('🔧 JSON Görünümü');
    fireEvent.click(jsonBtn);

    fireEvent.click(copyBtn);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(JSON.stringify(mockRuleset.json_data, null, 2));
  });

  test('downloads markdown file', () => {
    render(<RulesetDisplay ruleset={mockRuleset} onReset={() => {}} />);

    const downloadMarkdownBtn = screen.getByText('📥 Markdown İndir');
    fireEvent.click(downloadMarkdownBtn);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });

  test('downloads JSON file', () => {
    render(<RulesetDisplay ruleset={mockRuleset} onReset={() => {}} />);

    const downloadJsonBtn = screen.getByText('📥 JSON İndir');
    fireEvent.click(downloadJsonBtn);

    expect(global.URL.createObjectURL).toHaveBeenCalled();
  });
});
