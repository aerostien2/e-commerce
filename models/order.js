const mongoose = require('mongoose');

const productOrderedSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1
  },
  subtotal: { 
    type: Number, 
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  productsOrdered: [productOrderedSchema],
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  orderedOn: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: 'Pending'
  }
});

module.exports = mongoose.model('Order', orderSchema);
