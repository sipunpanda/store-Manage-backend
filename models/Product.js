const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true, trim: true },
    category: { type: String, index: true, trim: true },

    // Cloudinary fields
    imageUrl: { type: String, default: '' },   // secure URL
    cloudinaryId: { type: String, default: '' }, // public_id for deletion

    costPrice: { type: Number, default: 0, min: 0 },
    sellingPrice: { type: Number, default: 0, min: 0 },

    stockQuantity: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 5, min: 0 },
    unit: { type: String, default: 'pcs' },

    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },

    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
