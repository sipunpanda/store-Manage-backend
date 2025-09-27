const mongoose = require('mongoose');
const VendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: String,
  address: String,
  gstin: String,
  email: String,
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Vendor', VendorSchema);
