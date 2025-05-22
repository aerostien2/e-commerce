const product = require('../models/product');
const user = require('../models/user');

exports.createProduct = async (req, res) => {
  try {
    const { userId, name, description, price, stock } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User ID is required' });
    }

    // Find user and check admin status
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Only admins can create products' });
    }

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newProduct = new Product({ name, description, price, stock });
    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
