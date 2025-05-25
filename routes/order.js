const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getAllOrders
} = require('../controllers/order');



module.exports = router;
