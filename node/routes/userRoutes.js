const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');
const {
  getMe,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  blockUser,
  reactivateUser
} = require('../controllers/userController');

// ✅ Current user profile
router.get('/me', protect, getMe);

// ✅ Admin / Superadmin routes
router.get('/', protect, authorizeRoles('superadmin', 'admin'), getAllUsers);
router.get('/:id', protect, authorizeRoles('superadmin', 'admin'), getUserById);
router.put('/:id', protect, authorizeRoles('superadmin', 'admin'), updateUser);
router.delete('/:id', protect, authorizeRoles('superadmin', 'admin'), deleteUser);
router.patch('/:id/block', protect, authorizeRoles('superadmin', 'admin'), blockUser);
router.patch('/:id/reactivate', protect, authorizeRoles('superadmin', 'admin'), reactivateUser);

module.exports = router;
