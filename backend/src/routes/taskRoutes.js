const express = require('express');
const router = express.Router();
const { createTask, getTasks, completeTask } = require('../controllers/taskController');

// POST /api/tasks - Create a new task
router.post('/', createTask);

// GET /api/tasks - Get recent incomplete tasks (limit 5)
router.get('/', getTasks);

// PATCH /api/tasks/:id/complete - Mark task as completed
router.patch('/:id/complete', completeTask);

module.exports = router;
