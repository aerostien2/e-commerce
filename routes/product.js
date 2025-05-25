const express = require('express');
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getActiveProducts,
  getProductById,
  updateProduct,
  archiveProduct,
  activateProduct
} = require('../controllers/product');

const authenticate = require('../middleware/authenticate');

router.post('/', authenticate, createProduct); // Admin
router.get('/all', authenticate, getAllProducts); // Admin
router.get('/active', getActiveProducts); // Public
router.get('/:productId', getProductById); // Public
router.patch('/:productId/update', authenticate, updateProduct); // Admin
router.patch('/:productId/archive', authenticate, archiveProduct); // Admin
router.patch('/:productId/activate', authenticate, activateProduct); // Admin


module.exports = router;
