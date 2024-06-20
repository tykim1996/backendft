const UserProfile = require("../models/UserProfile")


async function getMyProfile(req, res) {
    try {
      const userEmail = req.user.email;
  
      const profile = await UserProfile.findOne({ email: userEmail });
  
      if (!profile) {
        return res.status(404).json({ success: false, msg: 'Profile not found' });
      }
  
      res.status(200).json(profile);
    } catch (error) {
      console.error('Error getting profile:', error);
      res.status(500).json({ success: false, msg: 'An error occurred while processing the request' });
    }
  }
  
async function setMyProfile(req, res) {
    try {
      console.log(req.user.email);
       console.log(req.body);
      const dataProfile = req.body
      dataProfile.email = req.user.email
  
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { email: req.user.email },
        { $set: dataProfile },
        { upsert: true, new: true }
      );
      console.log("updatedProfile",updatedProfile);
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error('Error updating/creating profile:', error);
      res.status(500).json({ success: false, msg: 'An error occurred while processing the request' });
    }
  }
  




module.exports = {
    getMyProfile,
    setMyProfile,
}