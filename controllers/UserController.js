const User = require('../models/User')

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: error.message });
    }
}

// GET by id
exports.getUserByID = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User doesnt exist"})
        }
        res.json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({message: error.message});
    }
}

// POST create a user
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const options = { new: true, runValidators: true };
        await newUser.save();
        res.status(201).json({message: "User created successfully", newUser})
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({message: error.message});
    }
}

// PATCH update a user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const options = { new: true, runValidators: true };
        const user = await User.findByIdAndUpdate(id, updates, options);
        if (!user) {
            return res.status(404).json({message: "User doesnt exist"})
        } 
        res.status(200).json({message: "User updated successfully", user});
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(404).json({message: error.message}); 
    }
}

// DELETE user
exports.deleteUser = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({message: " User not found"});
        }
        res.status(200).json({message: "User deleted successfully", user});
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({message: error.message});
    }
}