
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const authRouter = require('./routes/auth');
const memeRouter = require('./routes/memes');
const commentRouter = require('./routes/comments');
const profileRouter = require('./routes/profile');

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/memes', memeRouter);
app.use('/api/comments', commentRouter);
app.use('/api/profile', profileRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error'
  });
});

// Connect to MongoDB and start server
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
