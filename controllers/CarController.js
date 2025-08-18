const Car = require('../models/Car');

//Get All GET
exports.getAllCars = async (req, res) => {
    console.log("🚗 getAllCars endpoint hit!");
    try {
        const cars = await Car.find();
        if (!cars || cars.length === 0) {
            return res.status(200).json({message: 'No cars found'});
        }
        res.status(200).json(cars);
    } catch (error) {
        console.error("Error fetching cars:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}

//Get By ID GET
exports.getCarById = async (req, res) => {
    console.log("🚗 getCarById endpoint hit!");
    try {
        const { id } = req.params;
        const car = await Car.findById(id);
        if (!car) {
            return res.status(404).json({message: 'Car not found'});
        }
        res.status(200).json({message: 'Car fetched successfully', car});
    } catch (error) {
        console.error("Error fetching car:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}

//Create POST
exports.createCar = async(req, res) => {
    console.log("🚗 createCar endpoint hit!");
    try {
        const newCar = new Car(req.body);
        await newCar.save();
        res.status(201).json({message: 'Car created successfully', car: newCar});
    } catch (error) {
        console.error("Error creating car:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}

//Update PATCH
exports.updateCar = async (req, res) => {
    console.log("🚗 updateCar endpoint hit!");
    try {
        const { id } = req.params;
        const updates = req.body;
        const options = { new: true, runValidators: true };
        const car = await Car.findByIdAndUpdate(id, updates, options);
        if (!car) {
            return res.status(404).json({message: 'Car not found'});
        }
        res.status(200).json({message: 'The car was updated successfully', car});
    } catch (error) {
        console.error("Error updating car:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}


//Delete DELETE
exports.deleteCar = async (req, res) => {
    console.log("🚗 deleteCar endpoint hit!");
    try {
        const {id} = req.params;
        const car = await Car.findByIdAndDelete(id);
        if (!car) {
            return res.status(404).json({message: 'Car not found'});
        }
        res.status(200).json({message: 'The car was deleted successfully'});
    } catch (error) {
        console.error("Error deleting car:", error);
        res.status(500).json({message: 'Internal server error'});
    }
}