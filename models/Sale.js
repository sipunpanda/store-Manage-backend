const mongoose = require('mongoose');
const SaleSchema = new mongoose.Schema({
  products: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number, sellingPrice: Number, costPrice: Number }],
  totalAmount: Number,
  profit: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Sale', SaleSchema);
