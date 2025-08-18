const Car = require('../models/Car');

//Get All GET
exports.getAllCars = async (req, res) => {
    const cars = await Car.find();
    if (!cars || cars.length === 0) {
        return res.status(200).json({message: 'No cars found'});
    }
    res.status(200).json(cars);
}

//Get By ID GET
exports.getCarById = async (req, res) => {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
        return res.status(404).json({message: 'Car not found'});
    }
    res.status(200).json(car);
}

//Create POST
exports.createCar = async(req, res) => {
    const newCar = new Car(req.body);
    await newCar.save();
    res.status(201).json({message: 'Car created successfully', car: newCar});
}

//Update PATCH
exports.updateCar = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const options = { new: true, runValidators: true };
    const car = await Car.findByIdAndUpdate(id, updates, options);
    if (!car) {
        return res.status(404).json({message: 'Car not found'});
    }
    res.status(200).json({message: 'The car was updated successfully', car});
}


//Delete DELETE
exports.deleteCar = async (req, res) => {
    const {id} = req.params;
    const car = await Car.findByIdAndDelete(id);
    if (!car) {
        return res.status(404).json({message: 'Car not found'});
    }
    res.status(200).json({message: 'The car was deleted successfully'});
}