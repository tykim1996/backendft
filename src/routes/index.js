const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const userProfileRouter = require("./userProfileRoutes")
const authMiddleware = require('../middlewares/auth')
const authRoutes = require("../routes/authRoutes")

router.use('/auth', authRoutes);
router.use('/user', authMiddleware.isAuthenticated, userRoutes);
router.use('/user-profile', authMiddleware.isAuthenticated, userProfileRouter);

module.exports = router;
