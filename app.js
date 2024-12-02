require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const expenseController = require('./controllers/expenseController');
const passwordController = require('./controllers/passwordController');
const authMiddleware = require('./middleware/authMiddleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Debugging Middleware
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.path}`);
  next();
});

// User routes
app.post('/signup', userController.signup);
app.post('/login', userController.login);

// Password routes
app.post('/password/forgotpassword', passwordController.forgotPassword);
app.post('/password/resetpassword', passwordController.resetPassword);
app.get('/password/resetpassword/:id', passwordController.getResetPasswordPage);

// Expense routes
app.post('/add-expense', authMiddleware, expenseController.addExpense);
app.get('/get-expenses', authMiddleware, expenseController.getExpenses);
app.delete('/expense/:id', authMiddleware, expenseController.deleteExpenseById);

// Premium routes
app.post('/buy-premium', authMiddleware, userController.setUserPremium);
app.get('/profile', authMiddleware, userController.getUserProfile);

// Download expenses route
app.get('/download-expenses', authMiddleware, expenseController.downloadExpenses);

// Leaderboard route
app.get('/leaderboard', authMiddleware, expenseController.getLeaderboard);

// Default route for undefined paths
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error-handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
