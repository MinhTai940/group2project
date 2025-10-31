// controllers/userController.js
const mongoose = require('mongoose');
const UserManagement = require('../models/UserManagement');

// GET /users
exports.getUsers = async (req, res) => {
  try {
    console.log('GET /users - Fetching users list');
    console.log('User requesting:', req.user); // From auth middleware
    
    // Kiểm tra kết nối database
    if (mongoose.connection.readyState !== 1) {
      console.error('Database not connected. Current state:', mongoose.connection.readyState);
      return res.status(500).json({ 
        success: false,
        message: 'Database connection error',
        detail: 'Could not connect to database'
      });
    }

    const users = await UserManagement.find().lean();
    console.log(`Found ${users.length} users`);
    
    const usersWithId = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email
    }));

    return res.json({
      success: true,
      data: usersWithId
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ 
      success: false,
      message: 'Lỗi lấy danh sách người dùng', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  try {
    let { name, email } = req.body;

    // validation cơ bản
    if (!name || !email) {
      return res.status(400).json({ message: 'Name và email là bắt buộc' });
    }
    name = String(name).trim();
    email = String(email).trim();

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    // kiểm tra trùng email
    const existed = await UserManagement.findOne({ email });
    if (existed) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    // tạo user trong MongoDB
    const user = await UserManagement.create({ 
      name, 
      email
    });
    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo người dùng', error: err.message });
  }
};

// PUT /users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { name, email } = req.body;

    // validation cơ bản
    if (!name || !email) {
      return res.status(400).json({ message: 'Name và email là bắt buộc' });
    }
    name = String(name).trim();
    email = String(email).trim();

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Email không hợp lệ' });
    }

    // kiểm tra user có tồn tại không
    const user = await UserManagement.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // kiểm tra trùng email (trừ user hiện tại)
    const existed = await UserManagement.findOne({ email, _id: { $ne: id } });
    if (existed) {
      return res.status(409).json({ message: 'Email đã tồn tại' });
    }

    // cập nhật user
    const updatedUser = await UserManagement.findByIdAndUpdate(id, { name, email }, { new: true });
    return res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật người dùng', error: err.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserManagement.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserManagement.findByIdAndDelete(id);
    return res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa người dùng', error: err.message });
  }
};