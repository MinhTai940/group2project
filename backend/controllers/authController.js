const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Tạo JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// @desc    Đăng ký user mới
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Tạo user mới
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Tạo token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng ký',
      error: error.message
    });
  }
};

// @desc    Đăng nhập user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra email và password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và password'
      });
    }

    // Tìm user theo email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc password không đúng'
      });
    }

    // Tạo token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng nhập',
      error: error.message
    });
  }
};

// @desc    Đăng xuất user
// @route   POST /api/auth/logout
// @access  Public
const logout = async (req, res) => {
  try {
    // Với JWT, logout chỉ cần xóa token ở client side
    // Server không cần làm gì đặc biệt
    res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng xuất',
      error: error.message
    });
  }
};

module.exports = {
  signup,
  login,
  logout
};
