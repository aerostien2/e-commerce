const express = require('express');
const router = express.Router();
const productController = require('../controllers/product');

// POST /products — Create product (admin only, temporary check)
router.post('/', productController.createProduct);

module.exports = router;
