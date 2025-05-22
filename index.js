// [SECTION] Dependencies and Modules
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// [SECTION] App Initialization
const app = express();
app.use(express.json());
app.use(cors());

// [SECTION] Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Now connected to MongoDB Atlas.'))
  .catch(err => console.error('MongoDB connection error:', err));

// [SECTION] Routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

const productRoutes = require('./routes/product');
app.use('/products', productRoutes);

// [SECTION] Server Listener
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, mongoose };