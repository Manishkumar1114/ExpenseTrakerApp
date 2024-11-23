const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Import transaction utilities
const {
  startTransaction,
  commitTransaction,
  rollbackTransaction,
} = require('../models/expenseModel');


// Function to handle signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  try {
    const userExists = await User.getUserByEmail(email);
    if (userExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.createUser({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Function to handle login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }
  try {
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login successful!',
      token,
      userID: user.id,
      isPremium: !!user.is_premium,
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Function to get user profile with premium status
const getUserProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ isPremium: user.is_premium });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

const setUserPremium = async (req, res) => {
  const userId = req.userId;
  try {
    await startTransaction(); // Begin transaction
    await User.setUserPremium(userId);
    await commitTransaction(); // Commit transaction
    res.status(200).json({ message: 'You are now a premium member!' });
  } catch (error) {
    console.error('Error setting premium status:', error);
    await rollbackTransaction(); // Rollback on failure
    res.status(500).json({ message: 'Failed to update premium status' });
  }
};

module.exports = { signup, login, setUserPremium, getUserProfile };
