const Cart = require('../models/cart');
const Product = require('../models/Product');

// Helper function to calculate subtotal
const calculateSubtotal = (price, quantity) => price * quantity;

// Get User's Cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate('cartItems.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ userId: req.user._id });

    const subtotal = calculateSubtotal(product.price, quantity);

    if (!cart) {
      // Create new cart
      cart = new Cart({
        userId: req.user._id,
        cartItems: [{ productId, quantity, subtotal }],
        totalPrice: subtotal,
      });
    } else {
      // Check if product exists in cart
      const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

      if (itemIndex > -1) {
        // Update quantity & subtotal
        cart.cartItems[itemIndex].quantity += quantity;
        cart.cartItems[itemIndex].subtotal = calculateSubtotal(product.price, cart.cartItems[itemIndex].quantity);
      } else {
        // Add new product
        cart.cartItems.push({ productId, quantity, subtotal });
      }

      // Recalculate totalPrice
      cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
    }

    await cart.save();
    res.status(200).json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change product quantity
const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

    if (itemIndex === -1) return res.status(404).json({ message: 'Product not in cart' });

    cart.cartItems[itemIndex].quantity = quantity;
    cart.cartItems[itemIndex].subtotal = calculateSubtotal(product.price, quantity);

    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove product from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.cartItems = cart.cartItems.filter(item => item.productId.toString() !== productId);
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);

    await cart.save();
    res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Clear Cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();
    res.json({ message: 'Cart cleared' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart
};
