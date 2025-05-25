const Product = require('../models/Product');

// Create a new product (Admin only)
exports.createProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all products (Admin only)
exports.getAllProducts = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve all active products (Public)
exports.getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a single product by ID (Public)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product info (Admin only)
exports.updateProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

  try {
    const updated = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Archive product (Admin only)
exports.archiveProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

  try {
    const product = await Product.findByIdAndUpdate(req.params.productId, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product archived successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Activate product (Admin only)
exports.activateProduct = async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied' });

  try {
    const product = await Product.findByIdAndUpdate(req.params.productId, { isActive: true }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product activated successfully', product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};