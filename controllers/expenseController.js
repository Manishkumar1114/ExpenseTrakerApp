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
const AWS = require('aws-sdk');
const { generateCSV } = require('../utils/csvGenerator');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  endpoint: "https://s3.ap-south-1.amazonaws.com",
});

const uploadToS3 = async (data, fileName) => {
  const params = {
    Bucket: "expense-trackingapp", 
    Key: fileName, // File name in S3
    Body: data, 
    ContentType: "text/csv",
    ACL: 'public-read',
  };

  try {
    const result = await s3.upload(params).promise();
    console.log("File uploaded successfully:", result.Location);
    return result.Location;
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error("Failed to upload file to S3");
  }
};  

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

// Download Expenses and Upload to S3
exports.downloadExpenses = async (req, res) => {
  try {
    const expenses = await getAllExpenses(req.userId);
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found to download" });
    }

    const csvData = generateCSV(expenses);
    const fileName = `expenses_${req.userId}_${Date.now()}.csv`;

    // Upload CSV data directly to S3
    const s3FileUrl = await uploadToS3(csvData, fileName);

    console.log("File uploaded to S3:", s3FileUrl);

    // Respond with the S3 file URL (and optionally initiate download)
    res.status(200).json({
      message: "File uploaded successfully",
      s3Url: s3FileUrl,
    });
  } catch (error) {
    console.error("Error downloading expenses:", error);
    res.status(500).json({ message: "Failed to download expenses" });
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
