const bcrypt = require('bcrypt');
const User = require('../models/userModel');

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
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
      await User.createUser({ name, email, password: hashedPassword });
    
    await User.createUser({ name, email, password });
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
};



// Login page logic
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    //  Check if user exists in the database
    const user = await User.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Compare the plain text password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
   // Password matches
    res.status(200).json({ message: 'Login successful!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
};


module.exports = { signup, login };



