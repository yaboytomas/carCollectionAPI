const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

router.get('/users', UserController.getAllUsers); // Get all users
router.get('/user/:id', UserController.getUserByID); // Get user by ID
router.post('/user', UserController.createUser); // Create a new user
router.patch('/user/:id', UserController.updateUser); // Update user by ID
router.delete('/user/:id', UserController.deleteUser); // Delete user by ID

module.exports = router;