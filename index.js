require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const userRoutes = require('./routes/user');
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Now connected to MongoDB Atlas.'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/users', userRoutes);

const productRoutes = require('./routes/product');
app.use('/products', productRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, mongoose };
