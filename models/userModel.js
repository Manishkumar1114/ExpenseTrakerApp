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
// Save reset token and expiration in the database
const saveResetToken = (email, token, expiration) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?';
    db.query(query, [token, expiration, email], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Verify reset token and expiration
const verifyResetToken = (token) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()';
    db.query(query, [token], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};


// Update user password
const updatePassword = (email, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE email = ?';
    db.query(query, [hashedPassword, email], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = {
  userExists,
  createUser,
  getUserByEmail,
  getUserById,
  setUserPremium,
  saveResetToken,
  verifyResetToken,
  updatePassword,
};


