const db = require('../utils/database');

// Check if a user exists by email
const userExists = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) reject(err);
      else resolve(results.length > 0);
    });
  });
};

// Create a new user
const createUser = ({ name, email, password }) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Get a user by email
const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

// Get a user by ID
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

// Set a user's premium status
const setUserPremium = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET is_premium = TRUE WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = { userExists, createUser, getUserByEmail, getUserById, setUserPremium };
