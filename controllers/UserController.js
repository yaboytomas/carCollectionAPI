const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
/* exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({message: "User created successfully", newUser})
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(400).json({message: error.message});
    }
}
*/

// POST register user with auth (JWT and HASH)
exports.register = async (req, res) => {
    try {
        const { name, email, passoword} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        } 
        const hashedPassword = await bcrypt.hash(passoword, 12);
        const newUser = new User({ name, email, password: hashedPassword});
        await newUser.save();
        const token = jwt.sign(
            {userId: newUser._id, name: newUser.name, email: newUser.email},
            process.env.JWT_SECRET,
            { expiresIn: '15m'}
        );
        res.status(201).json({message: "User registered successfully", token, newUser});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: error.message});
    }
}

// POST login registered user 
exports.login = async (req, res) => {
    try {
        const {email, passoword} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(400).json({message: "Invalid email"});
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({message: "Invalid password"});
        }
        const token = jwt.sign(
            {userId: user._id, email: user.email},
            process.env.JWT_SECRET,
            { expiresIn: '15m'}
        );
        res.status(200).json({message: "Login successful", token});
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({message: error.message});
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