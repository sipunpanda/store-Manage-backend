const mongoose = require('mongoose');
module.exports = async function connectDB(){
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  }catch(err){
    console.error('DB connect error',err);
    process.exit(1);
  }
};
