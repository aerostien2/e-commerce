console.log(require('path').resolve(__dirname, '../middleware/authenticate.js'));


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
const authenticate = require('../authenticate');

router.use(authenticate);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateQuantity);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;

