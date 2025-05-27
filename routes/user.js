const express = require('express');
const userController = require('../controllers/user');

const { verify } = require("../auth");

const router = express.Router();


// Route for User Registration
router.post("/register", userController.registerUser);

// Route for User Login
router.post("/login", userController.loginUser);

// Route for retrieving user details
router.get("/details", verify, userController.getProfile);

//Update user as admin
router.patch('/:id/set-as-admin', verify, userController.setAdmin);

//Update password
router.patch('/update-password', verify, userController.updatePassword);

module.exports = router;


