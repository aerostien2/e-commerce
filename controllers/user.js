const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User registration
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobileNo } = req.body;

  // Manual validation
  if (!firstName || !lastName || !email || !password || !mobileNo) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  }

  if (!phoneRegex.test(mobileNo)) {
    return res.status(400).json({ message: 'Invalid mobile number format.' });
  }

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid Email' });
    }

    console.log("Email entered:", email);
    console.log("Password entered:", password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: 'No Email Found' });
    }

    console.log("User found:", user.email);
    console.log("Stored hash:", user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);

    if (!isMatch) {
      console.log("Password did not match");
      return res.status(400).json({ message: 'Email and password do not match' });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    console.log("Token created:", token);

    return res.status(200).json({ access: token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Set user as admin (Admin only)
exports.setAdmin = async (req, res) => {
  const userId = req.params.id;

  // 1. Validate ObjectId *before* any DB call
if (!userId || !mongoose.Types.ObjectId.isValid(userId.trim())) {
    return res.status(400).json({
      error: "Failed in Find",
      details: {
        stringValue: `"${userId}"`,
        valueType: typeof userId,
        kind: "ObjectId",
        value: userId,
        path: "_id",
        reason: {},
        name: "CastError",
        message: `Cast to ObjectId failed for value "${userId}" (type ${typeof userId}) at path "_id" for model "User"`
      }
    });
  }
console.log("Valid ObjectId:", mongoose.Types.ObjectId.isValid(userId));

  try {
    // 2. Now safe to query the DB
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.isAdmin = true;
    await user.save();

    const { _id, firstName, lastName, email, isAdmin, mobileNo, createdAt, updatedAt } = user;

    res.status(200).json({
      updatedUser: {
        _id,
        firstName,
        lastName,
        email,
        isAdmin,
        mobileNo,
        createdAt,
        updatedAt
      }
    });

  } catch (err) {
    // 3. Catch unexpected errors
    return res.status(500).json({
      error: "Internal Server Error",
      details: err.message
    });
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
