const { addExpense, getAllExpenses } = require('../models/expenseModel');

// Add an expense
exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  if (!amount || !description || !category) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    await addExpense({ amount, description, category });
    res.status(201).json({ message: 'Expense added successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Fetch all expenses for a user 
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await getAllExpenses();
    res.status(200).json({ expenses });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};
