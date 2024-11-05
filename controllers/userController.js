const User = require('../models/userModel');

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const userAlreadyExists = await User.userExists(email);
    if (userAlreadyExists) {
      return res.status(409).json({ message: 'User already exists' });
    }

    await User.createUser(name, email, password);
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

module.exports = { signup };
