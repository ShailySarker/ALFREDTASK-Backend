const express = require('express');
const router = express.Router();

// Import all the route files
const authRoutes = require('./authRoute');
const flashcardRoutes = require('./flashcardRoute');

// Define the routes under their respective paths
router.use('/auth', authRoutes);
router.use('/flashcards', flashcardRoutes);

module.exports = router;