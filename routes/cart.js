const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cart');

// Middleware to check if user is authenticated - you need to implement this

module.exports = router;
