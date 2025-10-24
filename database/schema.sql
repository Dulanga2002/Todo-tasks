-- Create database
CREATE DATABASE IF NOT EXISTS todo_db;
USE todo_db;

-- Create task table
CREATE TABLE IF NOT EXISTS task (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_completed_created (completed, created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data (optional - for testing)
-- INSERT INTO task (title, description, completed) VALUES
-- ('Setup development environment', 'Install Node.js, Docker, and MySQL', false),
-- ('Create database schema', 'Design and implement the task table', false),
-- ('Build REST API', 'Implement CRUD operations for tasks', false);
