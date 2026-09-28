import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 2. Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'guest' // Default to guest if frontend didn't send a role
    });

    // 3. Send response
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    // THIS IS THE FIX: Log the real error to your VS Code terminal
    console.error(' Registration Error Details:', error);
    
    // Send the specific Mongoose validation error back to the frontend
    let errorMessage = 'Server error during registration';
    if (error.name === 'ValidationError') {
      errorMessage = Object.values(error.errors).map(val => val.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({ message: errorMessage });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('❌ Login Error Details:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
};