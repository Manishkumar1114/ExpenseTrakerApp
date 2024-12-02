const {
  startTransaction,
  commitTransaction,
  rollbackTransaction,
  addExpense,
  getAllExpenses,
  getExpenseById,
  deleteExpenseById,
  getLeaderboard,
} = require('../models/expenseModel');
const { generateCSV } = require('../utils/csvGenerator');
const path = require('path');

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userID = req.userId;

  if (!userID || !amount || !description || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await startTransaction(); // Begin transaction
    await addExpense({ userID, amount, description, category });
    await commitTransaction(); // Commit transaction
    res.status(201).json({ message: 'Expense added successfully!' });
  } catch (error) {
    console.error('Error adding expense:', error);
    await rollbackTransaction(); // Rollback on failure
    res.status(500).json({ message: 'Database error' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await getAllExpenses(req.userId);
    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await getAllExpenses(req.userId);
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found to download' });
    }

    const csvData = generateCSV(expenses);
    const fileName = `expenses_${req.userId}_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../downloads', fileName);

    require('fs').writeFileSync(filePath, csvData);

    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({ message: 'Error downloading file' });
      }

      // Clean up file after download
      require('fs').unlinkSync(filePath);
    });
  } catch (error) {
    console.error('Error downloading expenses:', error);
    res.status(500).json({ message: 'Failed to download expenses' });
  }
};


exports.deleteExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await getExpenseById(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user_id !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await startTransaction(); // Begin transaction
    await deleteExpenseById(id);
    await commitTransaction(); // Commit transaction
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    await rollbackTransaction(); // Rollback on failure
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboardData = await getLeaderboard();
    res.status(200).json({ leaderboard: leaderboardData });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard data' });
  }
};
