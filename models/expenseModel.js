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

const deleteExpenseById = (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM expenses WHERE id = ?';
    db.query(query, [id], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

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

module.exports = { addExpense, getAllExpenses, deleteExpenseById, getLeaderboard };
