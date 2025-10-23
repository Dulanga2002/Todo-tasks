import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// API methods
export const taskAPI = {
  // Get all tasks (5 most recent, incomplete)
  getTasks: async () => {
    const response = await api.get('/tasks');
    return response.data;
  },

  // Create a new task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // Mark task as completed
  completeTask: async (taskId) => {
    const response = await api.patch(`/tasks/${taskId}/complete`);
    return response.data;
  },
};

export default api;
