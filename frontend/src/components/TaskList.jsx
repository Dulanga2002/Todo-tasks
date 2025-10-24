import { useState } from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onTaskComplete, isLoading, error }) => {
  const [completingIds, setCompletingIds] = useState(new Set());

  const handleComplete = async (taskId) => {
    setCompletingIds(prev => new Set(prev).add(taskId));
    try {
      await onTaskComplete(taskId);
    } catch (err) {
      console.error('Failed to complete task:', err);
    } finally {
      setCompletingIds(prev => {
        const next = new Set(prev);
        next.delete(taskId);
        return next;
      });
    }
  };

  if (error) {
    return (
      <div className="task-list-container">
        <h2>Recent Tasks</h2>
        <div className="error-message" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="task-list-container">
        <h2>Recent Tasks</h2>
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <h2>Recent Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="empty-state">
          <p>No tasks yet. Create your first task above!</p>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-content">
                <h3 className="task-title">{task.title}</h3>
                {task.description && (
                  <p className="task-description">{task.description}</p>
                )}
                <p className="task-date">
                  Created: {new Date(task.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => handleComplete(task.id)}
                disabled={completingIds.has(task.id)}
                className="done-button"
                aria-label={`Mark "${task.title}" as completed`}
              >
                {completingIds.has(task.id) ? 'Completing...' : 'Done'}
              </button>
            </div>
          ))}
        </div>
      )}
      
      {tasks.length > 0 && (
        <p className="task-count">
          Showing {tasks.length} of your most recent incomplete tasks
        </p>
      )}
    </div>
  );
};

export default TaskList;
