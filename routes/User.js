const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  setAdmin,
  getUserDetails,
  updatePassword,
} = require('../controllers/user');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/:id/admin', setAdmin);
router.get('/:id', getUserDetails);
router.put('/:id/password', updatePassword);

module.exports = router;
