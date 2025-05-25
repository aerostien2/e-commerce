const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders
} = require('../controllers/order');

const authenticate = require('../middleware/authenticate');
const authorizeAdmin = require('../middleware/authorizeAdmin');

router.use(authenticate);

router.post('/', createOrder);
router.get('/myorders', getUserOrders);
router.get('/', authorizeAdmin, getAllOrders);

module.exports = router;


