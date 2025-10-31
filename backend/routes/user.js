// backend/routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize, allowSelfOrAdmin } = require('../middleware/auth');

// Admin-only: list users
router.get('/', protect, authorize('admin'), userController.getUsers);

// Optional: creation stays open for the existing feature (can be restricted if needed)
router.post('/', userController.createUser);

router.put('/:id', userController.updateUser);

// Admin or self can delete
router.delete('/:id', protect, allowSelfOrAdmin, userController.deleteUser);

module.exports = router;
