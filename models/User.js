const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','vendor'], default: 'vendor' },
  vendorRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  createdAt: { type: Date, default: Date.now }
});
UserSchema.pre('save', async function(next){
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
UserSchema.methods.matchPassword = async function(entered){
  return await bcrypt.compare(entered, this.password);
};
module.exports = require('mongoose').model('User', UserSchema);
