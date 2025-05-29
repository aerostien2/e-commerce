const Cart = require('../models/cart'); 
const Product = require('../models/product');
const { errorHandler } = require('../auth');


//Retrieve user's cart
module.exports.getCart = (req, res) => {
  Cart.findOne({ userId: req.user.id })
    .then(cart => {
      if (!cart) {
        return res.status(404).send({ message: "Cart not found" });
      }
      return res.status(200).send({ cart }); 
    })
    .catch(error => errorHandler(error, req, res));

};




// Add to Cart Controller
module.exports.addCart = async (req, res) => {
  try {
    const { productId, quantity, subtotal } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        cartItems: [
          { productId, quantity, subtotal }
        ],
        totalPrice: subtotal,
        orderedOn: new Date()
      });
    } else {
      const existingItem = cart.cartItems.find(item => item.productId.toString() === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.subtotal += subtotal;
      } else {
        cart.cartItems.push({ productId, quantity, subtotal });
      }
      cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
      cart.orderedOn = new Date();
    }

    await cart.save();

    res.status(200).json({
      message: "Item added to cart successfully",
      cart
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};


// Change Product Quantity in Cart

module.exports.changeCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, newQuantity } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.cartItems.find(
      item => item.productId.toString() === productId
    );
    if (!cartItem) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Get product price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update quantity and subtotal
    cartItem.quantity = newQuantity;
    cartItem.subtotal = newQuantity * product.price;

    // Recalculate totalPrice
    cart.totalPrice = cart.cartItems.reduce((acc, item) => acc + item.subtotal, 0);
    cart.orderedOn = new Date();

    await cart.save();

    res.status(200).json({
      message: "Item quantity updated successfully",
      updatedCart: cart
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};

// Remove item from cart controller
module.exports.removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) {
      // Item not in cart
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.cartItems.splice(itemIndex, 1);
    cart.totalPrice = cart.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);


    // Save the updated cart
    await cart.save();

    res.json({
      message: 'Item removed from cart successfully',
      updatedCart: cart
       
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};


//Clear Cart

module.exports.clearCart = async (req, res) => {
  try {
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for user' });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({
      message: 'Cart cleared successfully',
      cart: cart
    });
  } catch (err) {
    errorHandler(err, req, res);
  }
};;