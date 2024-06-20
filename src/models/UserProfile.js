const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema(
  {
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
        
      },
      phoneNumber: {
        type: String,
      },
      address: {
        type: String,
      },
      email: {
        type: String,
        required: true,
        unique: true, 
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
  
module.exports = mongoose.model('UserProfile', userProfileSchema);
