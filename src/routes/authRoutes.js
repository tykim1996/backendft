const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController');

router.post('/sign-in', userController.signIn);
router.post('/sign-up', userController.signUp);
router.get('/confirm-email/:token', userController.confirmEmail);

module.exports = router;