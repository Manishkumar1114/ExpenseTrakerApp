const db = require('../utils/database');

const userExists = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) reject(err);
      else resolve(results.length > 0);
    });
  });
};

const createUser = ({ name, email, password }) => {
  return new Promise((resolve, reject) => {
    // Only specifying columns that will be inserted: name, email, password
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(query, [name, email, password], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};


const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

const setUserPremium = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE users SET is_premium = TRUE WHERE id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = { userExists, createUser , getUserByEmail , setUserPremium};
