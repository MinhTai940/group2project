// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Khởi tạo ứng dụng Express
const app = express();

// Đọc biến môi trường từ file server.env
dotenv.config({ path: './server.env' });

// Middleware
app.use(cors()); // Cho phép CORS cho frontend
app.use(express.json()); // Đọc JSON từ body request

// Route test kết nối
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API is running!', 
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Import route user
const userRouter = require('./routes/user');
app.use('/users', userRouter);

// Kết nối MongoDB Atlas
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1); // Thoát process nếu không kết nối được
  }
};

// Khởi tạo kết nối database
connectDB();

// Chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}`);
});
