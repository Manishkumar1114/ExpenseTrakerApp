const db = require('../utils/database');
const { v4: uuidv4 } = require('uuid');

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

// Save reset request in `ForgotPasswordRequests`
const saveResetRequest = (userId, requestId) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO ForgotPasswordRequests (id, userId, isActive) 
      VALUES (?, ?, 1)`; // Use 1 for isActive
    db.query(query, [requestId, userId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Verify reset request in `ForgotPasswordRequests`
const verifyResetRequest = (requestId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM ForgotPasswordRequests 
      WHERE id = ? AND isActive = 1`; // Check if request is active
    db.query(query, [requestId], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]); // Return the request if found
    });
  });
};  


// Deactivate reset request after use
const deactivateResetRequest = (requestId) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE ForgotPasswordRequests 
      SET isActive = 0 
      WHERE id = ?`;
    db.query(query, [requestId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const updatePasswordById = (userId, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE users 
      SET password = ? 
      WHERE id = ?`;
    db.query(query, [hashedPassword, userId], (err, results) => {
      if (err) {
        console.error('Error updating password:', err); // Add error logging
        reject(err);
      } else {
        console.log('Password updated successfully:', results); // Add logging for successful update
        resolve(results);
      }
    });
  });
};


module.exports = {
  userExists,
  createUser,
  getUserByEmail,
  getUserById,
  setUserPremium,
  updatePasswordById,
  saveResetRequest,
  verifyResetRequest,
  deactivateResetRequest,
};
