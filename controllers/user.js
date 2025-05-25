const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNo } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ firstName, lastName, email, password: hashedPassword, mobileNo });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// User authentication
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, userId: user._id, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Set user as admin (Admin only)
exports.setAdmin = async (req, res) => {
  try {
    const adminId = req.user.userId;  // requester
    const isAdmin = req.user.isAdmin; // check if requester is admin

    if (!isAdmin) {
      return res.status(403).json({ message: 'Only admins can set admin rights' });
    }

    const { id } = req.params; // user to be set as admin

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = true;
    await user.save();

    res.json({ message: `User ${user.email} is now an admin.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Retrieve user details
exports.getUserDetails = async (req, res) => {
  try {
    // Use authenticated user's id instead of param
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    // Use authenticated user's id instead of param
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Old and new passwords are required' });
    }

    const validOldPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validOldPassword) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
