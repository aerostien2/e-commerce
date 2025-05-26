const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = require('../controllers/cart');

const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateQuantity);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;

