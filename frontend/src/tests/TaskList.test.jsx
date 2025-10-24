import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskList from '../components/TaskList';

describe('TaskList Component', () => {
  const mockTasks = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      created_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Description 2',
      completed: false,
      created_at: '2025-01-02T00:00:00Z'
    }
  ];

  it('renders tasks correctly', () => {
    render(<TaskList tasks={mockTasks} onTaskComplete={vi.fn()} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('shows empty state when no tasks', () => {
    render(<TaskList tasks={[]} onTaskComplete={vi.fn()} />);
    
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<TaskList tasks={[]} onTaskComplete={vi.fn()} isLoading={true} />);
    
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('shows error state', () => {
    render(
      <TaskList 
        tasks={[]} 
        onTaskComplete={vi.fn()} 
        error="Failed to load tasks"
      />
    );
    
    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
  });

  it('calls onTaskComplete when Done button is clicked', () => {
    const mockOnTaskComplete = vi.fn();
    render(<TaskList tasks={mockTasks} onTaskComplete={mockOnTaskComplete} />);
    
    const doneButtons = screen.getAllByRole('button', { name: /done/i });
    fireEvent.click(doneButtons[0]);
    
    expect(mockOnTaskComplete).toHaveBeenCalledWith(1);
  });

  it('displays task count', () => {
    render(<TaskList tasks={mockTasks} onTaskComplete={vi.fn()} />);
    
    expect(screen.getByText(/showing 2 of your most recent/i)).toBeInTheDocument();
  });
});
