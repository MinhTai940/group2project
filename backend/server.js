// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

// Khởi tạo ứng dụng Express
const app = express();

// Đọc biến môi trường từ file server.env
dotenv.config({ path: './server.env' });

// Middleware
// Cấu hình CORS
app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://group2project-pi2c.vercel.app',
    'https://group2project.vercel.app',
    /\.vercel\.app$/ // Cho phép tất cả subdomain của vercel.app
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Đọc JSON từ body request

// Serve static files for uploaded avatars
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route test kết nối
app.get('/', (req, res) => {
  const dbStatus = {
    0: 'Disconnected',
    1: 'Connected',
    2: 'Connecting',
    3: 'Disconnecting'
  };

  res.json({ 
    message: 'Backend API is running!', 
    database: {
      status: dbStatus[mongoose.connection.readyState],
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      readyState: mongoose.connection.readyState
    },
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Import routes
const userRouter = require('./routes/user');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const uploadRouter = require('./routes/upload');

// Use routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', profileRouter);
app.use('/api/upload', uploadRouter);

// Kết nối MongoDB Atlas
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout sau 5 giây nếu không kết nối được
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`MongoDB Host: ${conn.connection.host}`);
    
    // Xử lý sự kiện mất kết nối
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected! Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    // Tự động thử kết nối lại khi mất kết nối
    mongoose.connection.on('disconnected', () => {
      console.log('Lost MongoDB connection. Retrying...');
      setTimeout(connectDB, 5000); // Thử kết nối lại sau 5 giây
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('Full error:', error);
    // Không thoát process ngay, thử kết nối lại
    setTimeout(connectDB, 5000);
  }
};

// Khởi tạo kết nối database
connectDB();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // MongoDB Connection Error
  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    return res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }

  // ValidationError từ Mongoose
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Chạy server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
});

// Xử lý lỗi không bắt được
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error('Error:', err);
  
  // Đóng server một cách graceful
  server.close(() => {
    console.log('Server closed. Attempting to reconnect to database...');
    // Thử kết nối lại database
    connectDB();
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error('Error:', err);
  
  // Đóng server một cách graceful
  server.close(() => {
    console.log('Server closed. Attempting to reconnect to database...');
    // Thử kết nối lại database
    connectDB();
  });
});
