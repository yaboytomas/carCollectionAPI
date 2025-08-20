const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/email');
const { send } = require('process');

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
        const { name, email, password} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        } 
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ name, email, password: hashedPassword});
        await newUser.save();
        const token = jwt.sign(
            {userId: newUser._id, name: newUser.name, email: newUser.email},
            process.env.JWT_SECRET,
            { expiresIn: '15m'}
        );
        sendWelcomeEmail(newUser.email, newUser.name).catch(error => {
            console.error('Welcome email failed for:', newUser.email, error.message);
        });
        res.status(201).json({message: "User registered successfully", token, newUser});
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({message: error.message});
    }
}

// POST login registered user 
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
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

// POST request new password
exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({message: "Email is required"});
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(200).json({message: "If this email is registered, you will receive a password reset link."});
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes from now
        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetTokenExpiry;
        await user.save();
        await sendPasswordResetEmail(user.email, resetToken);
        res.status(200).json({message: "If an account with that email exists, a password reset link has been sent."});
    } catch (error) {
        console.error("Error requesting password reset:", error);
        res.status(500).json({message: error.message}); 
    }
};

// POST actual password reset after request
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({message: "Token and new password are required"});
        }
        if (newPassword.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"});
        }
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: {$gt: Date.now()}
        });
        
        const hasedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hasedPassword;
        user.passwordResetToken = null;
        user.passwordResetExpires = null;
        await user.save();
        res.status(200).json({message: "Password reset successfully"});
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({message: error.message});
    }
}