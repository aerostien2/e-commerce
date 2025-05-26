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
const { body, validationResult } = require('express-validator');

// Register route with validation
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Invalid email format'),
    body('mobileNo').isMobilePhone('any').withMessage('Invalid mobile number'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Pass to controller if validation passed
    registerUser(req, res);
  }
);

router.post('/login', loginUser);

// Protected routes with PATCH
router.get('/details', authenticate, getUserDetails);
router.patch('/:id/set-as-admin', authenticate, setAdmin);
router.patch('/update-password', authenticate, updatePassword);

module.exports = router;

