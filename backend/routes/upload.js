const express = require('express');
const router = express.Router();
const { uploadAvatar, deleteAvatar, uploadSingle } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Upload avatar (POST /api/upload/avatar)
router.post('/avatar', protect, uploadSingle, uploadAvatar);

// Delete avatar (DELETE /api/upload/avatar)
router.delete('/avatar', protect, deleteAvatar);

module.exports = router;


