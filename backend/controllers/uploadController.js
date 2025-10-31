const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

// Đảm bảo thư mục lưu file tồn tại
const uploadsDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Cấu hình multer lưu trực tiếp xuống ổ đĩa (bỏ Cloudinary để đơn giản hoá)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const userId = (req.user && (req.user._id || req.user.id)) || 'unknown';
    const ext = (file.originalname.split('.').pop() || 'jpg').toLowerCase();
    cb(null, `avatar-${userId}-${Date.now()}.${ext}`);
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Chỉ cho phép upload file ảnh'), false);
    }
  }
});

// Middleware upload single file
const uploadSingle = upload.single('avatar');

// Upload avatar
const uploadAvatar = async (req, res) => {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Kiểm tra file được upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh để upload'
      });
    }

    // Public URL tuyệt đối qua static route /uploads
    const baseUrl = `${req.protocol}://${req.get('host')}`; // ví dụ http://localhost:3000
    const fileName = path.basename(req.file.filename);
    const avatarUrl = `${baseUrl}/uploads/avatars/${fileName}`;

    // Cập nhật avatar URL vào database
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.json({
      success: true,
      message: 'Upload avatar thành công',
      data: {
        avatar: avatarUrl,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi upload avatar',
      error: error.message
    });
  }
};

// Xóa avatar
const deleteAvatar = async (req, res) => {
  try {
    const userId = (req.user && (req.user._id || req.user.id)) || null;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Lấy thông tin user hiện tại
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    // Xoá file local nếu là URL /uploads; bỏ qua Cloudinary
    if (user.avatar) {
      // Lấy pathname nếu là absolute URL
      let localPath = user.avatar;
      try {
        if (/^https?:\/\//i.test(user.avatar)) {
          const u = new URL(user.avatar);
          localPath = u.pathname; // /uploads/avatars/xxx.jpg
        }
      } catch (_) {}

      if (localPath.startsWith('/uploads/')) {
        const filePath = path.join(__dirname, '..', localPath);
        try { fs.unlinkSync(filePath); } catch (_) {}
      }
    }

    // Xóa avatar URL khỏi database
    user.avatar = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Xóa avatar thành công',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar
        }
      }
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa avatar',
      error: error.message
    });
  }
};

module.exports = {
  uploadAvatar,
  deleteAvatar,
  uploadSingle
};


