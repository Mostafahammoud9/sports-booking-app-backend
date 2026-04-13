const express = require('express');
const authRoutes = require('./routes/AuthRoutes');

const app = express();

// Middleware
app.use(express.json());

// Test route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Auth routes
app.use('/api/auth', authRoutes);

module.exports = app;