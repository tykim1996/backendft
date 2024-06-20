// models/userSchema.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true, 
        unique: true, 
      },
      password: {
        type: String,
        required: true,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      verifiedOtp: {
        type: Boolean,
        default: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      },
      updatedAt: {
        type: Date,
        default: Date.now
      }
},
{ strict: true }
); 
  
module.exports = mongoose.model('User', userSchema);
