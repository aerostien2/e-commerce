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
router.put('/:id/set-as-admin', setAdmin);
router.get('/:details', getUserDetails);
router.put('/update-password', updatePassword);

module.exports = router;
