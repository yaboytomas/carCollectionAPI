const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticateToken = require('../middleware/auth');

// no auth required
router.post('/register', UserController.register); // Register a new user
router.post('/login', UserController.login); // Login user

// auth required
router.use(authenticateToken); // applies auth to all below
router.get('/users', UserController.getAllUsers); // Get all users
router.get('/user/:id', UserController.getUserByID); // Get user by ID
// router.post('/user', UserController.createUser); // Create a new user
router.patch('/user/:id', UserController.updateUser); // Update user by ID
router.delete('/user/:id', UserController.deleteUser); // Delete user by ID

module.exports = router;