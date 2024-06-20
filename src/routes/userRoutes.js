const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const otpController = require('../controllers/otpController')

router.get('/checkemail-confirmation/:token', userController.checkEmailConfirmation);
router.get('/sign-out', userController.signOut);
router.get('/check-auth', userController.checkauth);
router.post('/get-otp', otpController.getOtp);
router.post('/verify-otp', otpController.verifyOtp);

module.exports = router;