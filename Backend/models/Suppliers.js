const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {           
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  leadTime: {
    type: String, 
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Purchased', 'Cancelled'], 
    default: 'Pending',
  },
}, { timestamps: true });

const Supplier = mongoose.model('Supplier', supplierSchema);

module.exports = Supplier;
