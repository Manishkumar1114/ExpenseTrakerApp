const db = require('../utils/database');

// Function to add an expense
const addExpense = async ({ userID, amount, description, category }) => {
  const query = 'INSERT INTO expenses (user_id, amount, description, category) VALUES (?, ?, ?, ?)';
  const values = [userID, amount, description, category];
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Function to get all expenses for a specific user
const getAllExpenses = (userId) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM expenses WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Function to get an expense by its ID
const getExpenseById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM expenses WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results[0]);  // Ensure the function returns a single expense object
    });
  });
};


// Function to delete an expense by ID
const deleteExpenseById = async (id) => {
  const query = 'DELETE FROM expenses WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Function to get the leaderboard data
const getLeaderboard = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        users.name AS user, 
        SUM(expenses.amount) AS totalExpenses 
      FROM users 
      LEFT JOIN expenses ON users.id = expenses.user_id 
      WHERE users.is_premium = TRUE 
      GROUP BY users.id, users.name 
      ORDER BY totalExpenses DESC 
      LIMIT 10;
    `;

    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

// Function to start a transaction
const startTransaction = () => {
  return new Promise((resolve, reject) => {
    db.query('START TRANSACTION', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Function to commit a transaction
const commitTransaction = () => {
  return new Promise((resolve, reject) => {
    db.query('COMMIT', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};

// Function to rollback a transaction
const rollbackTransaction = () => {
  return new Promise((resolve, reject) => {
    db.query('ROLLBACK', (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
};
module.exports = {
  startTransaction,
  commitTransaction,
  rollbackTransaction,
  addExpense,
  deleteExpenseById,
  getAllExpenses,
  getExpenseById,
  getLeaderboard,
};
