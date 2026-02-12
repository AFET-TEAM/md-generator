import React from 'react';
import { render, fireEvent, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiAgentConfigurator from './MultiAgentConfigurator';

// Mock dependencies
jest.mock('react-markdown', () => ({ children }) => <div>{children}</div>);
jest.mock('prismjs', () => ({}));
jest.mock('react-syntax-highlighter', () => ({ Prism: ({ children }) => <div>{children}</div> }));
jest.mock('lucide-react', () => ({}));

describe('MultiAgentConfigurator', () => {
  test('renders with one initial agent', () => {
    render(<MultiAgentConfigurator />);
    expect(screen.getByText('Ajan #1')).toBeInTheDocument();
  });

  test('adds a new agent when "Bos Ajan Ekle" is clicked', () => {
    render(<MultiAgentConfigurator />);
    const addButton = screen.getByText('+ Bos Ajan Ekle');
    fireEvent.click(addButton);
    expect(screen.getByText('Ajan #2')).toBeInTheDocument();
  });

  test('updates agent name', async () => {
    render(<MultiAgentConfigurator />);
    const nameInput = screen.getByPlaceholderText('Ornegin: Kod Asistani');

    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'Test Agent' } });
    });

    expect(nameInput.value).toBe('Test Agent');
    expect(screen.getByText('Test Agent')).toBeInTheDocument();
  });

  test('removes an agent', () => {
    render(<MultiAgentConfigurator />);

    // Add a second agent first
    const addButton = screen.getByText('+ Bos Ajan Ekle');
    fireEvent.click(addButton);

    expect(screen.getByText('Ajan #2')).toBeInTheDocument();

    // Find remove buttons. There should be 2.
    const removeButtons = screen.getAllByText('Kaldir');
    expect(removeButtons).toHaveLength(2);

    // Remove the second agent
    fireEvent.click(removeButtons[1]);

    // Agent #2 should be gone. Agent #1 should remain.
    // Note: If we remove agent 2, agent 1 is still there.
    // If we remove agent 1, agent 2 becomes agent 1 (index shift).
    expect(screen.queryByText('Ajan #2')).not.toBeInTheDocument();
    expect(screen.getByText('Ajan #1')).toBeInTheDocument();
  });
});
