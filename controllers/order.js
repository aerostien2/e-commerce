const Order = require('../models/order');
const Cart = require('../models/cart');

// Create Order (Non-admin User checkout)
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Prepare productsOrdered array from cartItems
    const productsOrdered = cart.cartItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      subtotal: item.subtotal
    }));

    // Create new order
    const order = new Order({
      userId,
      productsOrdered,
      totalPrice: cart.totalPrice,
      orderedOn: new Date(),
      status: 'Pending'
    });

    // Save order and clear cart
    await order.save();

    cart.cartItems = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve authenticated user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ userId }).sort({ orderedOn: -1 });
    res.json(orders);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    // You need to verify admin status in middleware or here
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const orders = await Order.find().sort({ orderedOn: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
