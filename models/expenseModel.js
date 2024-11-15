const db = require('../utils/database');

const addExpense = ({ userID, amount, description, category }) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)';
    db.query(query, [userID, amount, description, category], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getAllExpenses = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM expenses WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getExpenseById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM expenses WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);
    });
  });
};

const deleteExpenseById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

module.exports = { addExpense, getAllExpenses, getExpenseById, deleteExpenseById };
