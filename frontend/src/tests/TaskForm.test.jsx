import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskForm from '../components/TaskForm';

describe('TaskForm Component', () => {
  it('renders the form with title and description fields', () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);
    
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('shows error when submitting without title', async () => {
    render(<TaskForm onTaskCreated={vi.fn()} />);
    
    const submitButton = screen.getByRole('button', { name: /create task/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });

  it('calls onTaskCreated with form data when submitted', async () => {
    const mockOnTaskCreated = vi.fn().mockResolvedValue({});
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnTaskCreated).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description'
      });
    });
  });

  it('clears form after successful submission', async () => {
    const mockOnTaskCreated = vi.fn().mockResolvedValue({});
    render(<TaskForm onTaskCreated={mockOnTaskCreated} />);
    
    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    const submitButton = screen.getByRole('button', { name: /create task/i });
    
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(titleInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });
  });
});
