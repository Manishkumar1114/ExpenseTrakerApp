const db = require('../utils/database');


const addExpense = ({ amount, description, category }) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO expenses (amount, description, category) VALUES (?, ?, ?)';
    db.query(query, [amount, description, category], (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

const getAllExpenses = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM expenses ORDER BY date DESC'; // Order by date, most recent first
    db.query(query, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};


module.exports = { addExpense , getAllExpenses };
