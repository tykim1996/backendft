const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const authMiddleware = require('../middlewares/auth')

router.post('/set-profile', userProfileController.setMyProfile);
router.get('/get-profile', authMiddleware.isAuthenticated, userProfileController.getMyProfile);



module.exports = router;