// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Dependencies and Modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// [SECTION] Initialize app
const app = express();

// [SECTION] Middleware
app.use(cors());
app.use(express.json());

// [SECTION] Routes
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const cartRoutes = require('./routes/cart'); // Added cart routes

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes); // Mount cart routes

// [SECTION] Database Setup
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// [SECTION] Server Gateway Response
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, mongoose };
