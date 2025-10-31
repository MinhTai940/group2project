const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserManagement = require('../models/UserManagement');

// Verify JWT and attach user document to req.user
async function protect(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const isBearer = authHeader.startsWith('Bearer ');
    if (!isBearer) {
      return res.status(401).json({ success: false, message: 'Access token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    const userId = decoded.userId || decoded.id;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid token user' });
    }

    req.user = user; // { _id, name, email, role, ... }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}

// Require one of the roles
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    next();
  };
}

// Allow admin, or the owner of the target resource in UserManagement by id
async function allowSelfOrAdmin(req, res, next) {
  try {
    if (req.user && req.user.role === 'admin') return next();

    const { id } = req.params;
    const target = await UserManagement.findById(id).lean();
    if (!target) return res.status(404).json({ success: false, message: 'User not found' });

    if (req.user && req.user.email === target.email) return next();

    return res.status(403).json({ success: false, message: 'Forbidden' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { protect, authorize, allowSelfOrAdmin };



