const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '7d' });

router.post('/register', async (req, res) => {
  const { name, email, password, role, vendorRef } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email exists' });
  const u = await User.create({ name, email, password, role, vendorRef });
  res.json({ token: signToken(u._id), user: u });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u || !(await u.matchPassword(password))) return res.status(401).json({ message: 'Invalid creds' });
  res.json({ token: signToken(u._id), user: u });
});

module.exports = router;
