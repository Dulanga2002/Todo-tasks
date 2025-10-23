const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { testConnection } = require('./config/database');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Todo Task API',
    version: '1.0.0',
    endpoints: {
      tasks: '/api/tasks',
      health: '/api/health'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection first
    const dbConnected = await testConnection();
    
    if (!dbConnected && process.env.NODE_ENV !== 'test') {
      console.error('Failed to connect to database. Please check your configuration.');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 API available at http://localhost:${PORT}/api/tasks`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  startServer();
}

module.exports = app;
