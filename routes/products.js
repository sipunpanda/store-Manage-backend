const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// ✅ Multer Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  }
});
const upload = multer({ storage });

/**
 * 📌 Create Product
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.imageUrl = req.file.path;       // Cloudinary secure URL
      data.cloudinaryId = req.file.filename; // public_id
    }

    const product = await Product.create(data);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 Get All Products
 */
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('vendor').sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 Get Product by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor');
    res.json(product || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 Update Product (with image replace + old image cleanup)
 */
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const data = req.body;

    if (req.file) {
      // delete old image if exists
      if (product.cloudinaryId) {
        await cloudinary.uploader.destroy(product.cloudinaryId);
      }

      data.imageUrl = req.file.path;
      data.cloudinaryId = req.file.filename;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 📌 Delete Product (remove Cloudinary image too)
 */
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.cloudinaryId) {
      await cloudinary.uploader.destroy(product.cloudinaryId);
    }

    await product.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
