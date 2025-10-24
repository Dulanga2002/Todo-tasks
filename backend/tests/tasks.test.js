const request = require('supertest');
const app = require('../src/server');
const { pool } = require('../src/config/database');

describe('Task API Integration Tests', () => {
  
  // Setup: Clean database before each test
  beforeEach(async () => {
    await pool.query('DELETE FROM task');
  });

  // Cleanup: Close pool after all tests
  afterAll(async () => {
    await pool.end();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with title and description', async () => {
      const newTask = {
        title: 'Test Task',
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Task created successfully');
      expect(response.body.task).toHaveProperty('id');
      expect(response.body.task.title).toBe(newTask.title);
      expect(response.body.task.description).toBe(newTask.description);
      expect(response.body.task.completed).toBe(0); // MySQL returns 0 for false
    });

    it('should create a task with title only (no description)', async () => {
      const newTask = {
        title: 'Task without description'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.task.title).toBe(newTask.title);
      expect(response.body.task.description).toBe('');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Title is required');
    });

    it('should return 400 if title is empty string', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: '   ' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Title is required');
    });
  });

  describe('GET /api/tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.tasks).toEqual([]);
      expect(response.body.count).toBe(0);
    });

    it('should return only incomplete tasks', async () => {
      // Create 3 tasks
      await request(app).post('/api/tasks').send({ title: 'Task 1' });
      await request(app).post('/api/tasks').send({ title: 'Task 2' });
      const task3Response = await request(app).post('/api/tasks').send({ title: 'Task 3' });

      // Mark one as completed
      await request(app).patch(`/api/tasks/${task3Response.body.task.id}/complete`);

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.count).toBe(2);
      expect(response.body.tasks.every(task => task.completed === 0)).toBe(true);
    });

    it('should return maximum 5 most recent tasks', async () => {
      // Create 7 tasks
      for (let i = 1; i <= 7; i++) {
        await request(app).post('/api/tasks').send({ title: `Task ${i}` });
        // Small delay to ensure different timestamps
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      const response = await request(app)
        .get('/api/tasks')
        .expect(200);

      expect(response.body.count).toBe(5);
      // Check that tasks are ordered by most recent first
      expect(response.body.tasks[0].title).toBe('Task 7');
      expect(response.body.tasks[4].title).toBe('Task 3');
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should mark a task as completed', async () => {
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to complete' });

      const taskId = createResponse.body.task.id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Task marked as completed');
      expect(response.body.taskId).toBe(String(taskId));

      // Verify task is no longer in GET /tasks
      const getResponse = await request(app).get('/api/tasks');
      expect(getResponse.body.tasks.find(t => t.id === taskId)).toBeUndefined();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/99999/complete')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Task not found');
    });

    it('should return 400 if task is already completed', async () => {
      const createResponse = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task' });

      const taskId = createResponse.body.task.id;

      // Complete it once
      await request(app).patch(`/api/tasks/${taskId}/complete`).expect(200);

      // Try to complete again
      const response = await request(app)
        .patch(`/api/tasks/${taskId}/complete`)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Task is already completed');
    });
  });

  describe('Health and Root Endpoints', () => {
    it('should return API info on root endpoint', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Todo Task API');
    });

    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
});
