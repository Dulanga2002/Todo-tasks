import { useState, useEffect, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskAPI } from './services/api';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await taskAPI.getTasks();
      setTasks(data.tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreated = async (taskData) => {
    await taskAPI.createTask(taskData);
    // Refresh the task list
    await fetchTasks();
  };

  const handleTaskComplete = async (taskId) => {
    await taskAPI.completeTask(taskId);
    // Remove completed task from UI
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📝 Todo Task Manager</h1>
        <p>Manage your tasks efficiently</p>
      </header>

      <main className="app-main">
        <TaskForm onTaskCreated={handleTaskCreated} />
        <TaskList 
          tasks={tasks}
          onTaskComplete={handleTaskComplete}
          isLoading={isLoading}
          error={error}
        />
      </main>

      <footer className="app-footer">
        <p>Built with React + Express + MySQL</p>
      </footer>
    </div>
  );
}

export default App;
