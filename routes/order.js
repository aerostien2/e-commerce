const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");

const auth = require("../auth");

const { verify, verifyAdmin} = require("../auth");

//Create order
router.post("/checkout", verify, orderController.createOrder);

//Retrieve logged in user's orders
router.get("/my-orders", verify, orderController.myOrders);

//Retrieve all user's orders
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

module.exports = router;
