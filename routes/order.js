const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders
} = require('../controllers/order');

const authenticate = require('../authenticate');
const authorizeAdmin = require('../authorizeAdmin');

router.use(authenticate);

router.post('/', createOrder);
router.get('/myorders', getUserOrders);
router.get('/', authorizeAdmin, getAllOrders);

module.exports = router;
