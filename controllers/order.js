const Order = require('../models/order');
const Cart = require('../models/cart');
const { errorHandler } = require('../auth');


// Create a new order
exports.createOrder = async (req, res) => {
  try {

  	const userId = req.user.id;
    const cart = await Cart.findOne({ userId: userId });

    if (!cart.cartItems || cart.cartItems.length === 0) {
      return res.status(400).json({ error: 'No items to checkout' });
    }

    res.status(201).json({ message: 'Order Successfully'});

  } catch (err) {
    errorHandler(err, req, res);
  }
};


//Retrieve logged in user's order
exports.myOrders = async (req, res) => {
  try {

  	const userId = req.user.id;
    const orders = await Order.find({ userId: userId });

    res.status(200).json({ orders: orders });

  } catch (err) {
    errorHandler(err, req, res);
  }
};


//Retrieve all orders

module.exports.getAllOrders = (req, res) => {
  return Order.find()
  .then (result => {
    if(result.length > 0){
      return res.status(200).send(result);
    }
    else{
      return res.status(404).send({message: "No Orders Found"});
    }
  })
  .catch(error => errorHandler(error, req, res));
};