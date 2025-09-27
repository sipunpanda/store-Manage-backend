const express = require('express');
const router = express.Router();
const Sale = require('../models/Sale');
const Product = require('../models/Product');

router.post('/', async (req,res)=> {
  const { items } = req.body; // [{ productId, qty }]
  let total = 0, cost = 0;
  const updates = [];
  for (const it of items) {
    const p = await Product.findById(it.productId);
    if (!p) return res.status(400).json({ message: 'Product missing' });
    if (p.stockQuantity < it.qty) return res.status(400).json({ message: `Insufficient stock ${p.name}` });
    total += p.sellingPrice * it.qty;
    cost += p.costPrice * it.qty;
    p.stockQuantity -= it.qty;
    await p.save();
    updates.push({ product: p._id, qty: it.qty, sellingPrice: p.sellingPrice, costPrice: p.costPrice });
  }
  const profit = total - cost;
  const sale = await Sale.create({ products: updates, totalAmount: total, profit });
  res.json(sale);
});

module.exports = router;
