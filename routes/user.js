const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  setAdmin,
  getUserDetails,
  updatePassword,
} = require('../controllers/user');

const authenticate = require('../middleware/authenticate');

// Register route (validation will be done in the controller)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes with PATCH
router.get('/details', authenticate, getUserDetails);
router.patch('/:id/set-as-admin', authenticate, setAdmin);
router.patch('/update-password', authenticate, updatePassword);

module.exports = router;

