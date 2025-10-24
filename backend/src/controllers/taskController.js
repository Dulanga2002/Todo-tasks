const { pool } = require('../config/database');

/**
 * Create a new task
 * POST /api/tasks
 */
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({ 
        error: 'Title is required' 
      });
    }

    const [result] = await pool.query(
      'INSERT INTO task (title, description, completed, created_at) VALUES (?, ?, false, NOW())',
      [title.trim(), description?.trim() || '']
    );

    const [rows] = await pool.query(
      'SELECT * FROM task WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: rows[0]
    });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ 
      error: 'Failed to create task',
      details: error.message 
    });
  }
};

/**
 * Get recent tasks (5 most recent, excluding completed)
 * GET /api/tasks
 */
const getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM task WHERE completed = false ORDER BY created_at DESC LIMIT 5'
    );

    res.status(200).json({
      tasks: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ 
      error: 'Failed to fetch tasks',
      details: error.message 
    });
  }
};

/**
 * Mark task as completed
 * PATCH /api/tasks/:id/complete
 */
const completeTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    const [existing] = await pool.query(
      'SELECT * FROM task WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ 
        error: 'Task not found' 
      });
    }

    if (existing[0].completed) {
      return res.status(400).json({ 
        error: 'Task is already completed' 
      });
    }

    await pool.query(
      'UPDATE task SET completed = true WHERE id = ?',
      [id]
    );

    res.status(200).json({
      message: 'Task marked as completed',
      taskId: id
    });
  } catch (error) {
    console.error('Error completing task:', error);
    res.status(500).json({ 
      error: 'Failed to complete task',
      details: error.message 
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  completeTask
};
