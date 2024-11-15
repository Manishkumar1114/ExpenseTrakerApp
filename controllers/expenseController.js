const { addExpense, getAllExpenses, getExpenseById, deleteExpenseById } = require('../models/expenseModel');

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userID = req.userId;

  if (!userID || !amount || !description || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await addExpense({ userID, amount, description, category });
    res.status(201).json({ message: 'Expense added successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await getAllExpenses(req.userId); // Filter by user
    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
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

    await deleteExpenseById(id);
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'An error occurred while deleting the expense' });
  }
};
