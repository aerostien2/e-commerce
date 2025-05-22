const Product = require('../models/Product');

// Admin-only: Create a new product
exports.createProduct = async (req, res) => {
  try {
    // TEMPORARY ADMIN CHECK: Replace this with real auth later
    const isAdmin = req.body.isAdmin;

    if (!isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    const { name, description, price } = req.body;

    const newProduct = new Product({
      name,
      description,
      price
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
