const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Cấu hình email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Đăng ký
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email đã tồn tại'
      });
    }

    // Tạo user mới (hash sẽ xử lý ở pre-save middleware)
    const user = new User({
      name,
      email,
      password,
      role: role || 'user'
    });

    await user.save();

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

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
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Đăng nhập
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
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
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra user tồn tại
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Email không tồn tại trong hệ thống'
      });
    }

    // Tạo reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 phút

    // Lưu reset token vào database
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetTokenExpiry;
    await user.save();

    const resetUrl = `http://localhost:3001/reset-password?token=${resetToken}`;

    // Nếu chưa cấu hình SMTP, trả về resetUrl để test
    const hasEmailConfig = !!(process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS);
    // Nếu chưa cấu hình SMTP → trả về URL; nếu đã cấu hình thì luôn gửi email (kể cả dev)
    if (!hasEmailConfig) {
      console.log('[DEV] Reset password URL:', resetUrl);
      return res.json({
        success: true,
        message: 'Chế độ DEV: trả về URL reset trực tiếp (chưa cấu hình SMTP).',
        data: { resetUrl, token: resetToken }
      });
    }

    // Đã cấu hình SMTP: gửi email thực (bất kể NODE_ENV)
    try {
      const transporter = createTransporter();
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Password - Group 2 Project',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Reset Password</h2>
            <p>Xin chào ${user.name},</p>
            <p>Bạn đã yêu cầu reset mật khẩu. Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
            <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>Link này sẽ hết hạn sau 10 phút.</p>
            <p>Nếu bạn không yêu cầu reset mật khẩu, vui lòng bỏ qua email này.</p>
            <br>
            <p>Trân trọng,<br>Team Group 2</p>
          </div>
        `
      };
      await transporter.sendMail(mailOptions);
      return res.json({
        success: true,
        message: 'Email reset password đã được gửi. Vui lòng kiểm tra hộp thư của bạn.'
      });
    } catch (mailErr) {
      console.error('Send mail failed, fallback returning resetUrl:', mailErr);
      return res.json({
        success: true,
        message: 'Không gửi được email trong môi trường hiện tại. Trả về URL reset để test.',
        data: { resetUrl, token: resetToken }
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi gửi email',
      error: error.message
    });
  }
};

// Reset mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Tìm user với token hợp lệ
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Token không hợp lệ hoặc đã hết hạn'
      });
    }

    // Cập nhật password dạng plain, pre-save middleware sẽ hash 1 lần
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
};

// Đăng xuất
const logout = async (req, res) => {
  res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logout
};