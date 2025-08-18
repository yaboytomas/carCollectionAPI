const express = require('express');
const router = express.Router();
const CarController = require('../controllers/CarController');

router.get('/cars', CarController.getAllCars); // Get all cars
router.get('/cars/:id', CarController.getCarById); // Get car by ID
router.post('/cars', CarController.createCar); // Create a new car
router.patch('/cars/:id', CarController.updateCar); // Update car by ID
router.delete('/cars/:id', CarController.deleteCar); // Delete car by ID

module.exports = router;