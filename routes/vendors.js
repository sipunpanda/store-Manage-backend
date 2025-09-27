const express = require('express');
const router = express.Router();
const Vendor = require('../models/Vendor');

router.post('/', async (req,res)=> { const v = await Vendor.create(req.body); res.json(v); });
router.get('/', async (req,res)=> { const vs = await Vendor.find().sort({name:1}); res.json(vs); });
router.get('/:id', async (req,res)=> { const v = await Vendor.findById(req.params.id); res.json(v||{}); });
router.put('/:id', async (req,res)=> { const v = await Vendor.findByIdAndUpdate(req.params.id, req.body, {new:true}); res.json(v); });
router.delete('/:id', async (req,res)=> { await Vendor.findByIdAndDelete(req.params.id); res.json({success:true}); });

module.exports = router;
