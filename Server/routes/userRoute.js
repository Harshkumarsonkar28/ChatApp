const express = require('express');
const userController = require('../controllers/userController');
const route = express.Router();

// Existing routes
route.post('/register', userController.Userregister);
route.post('/login', userController.userLogin);

// NEW: Get all users (for private chat)
route.get('/all/:userId',userController.getAll);

// avatar

module.exports = route;
