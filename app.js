require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const expenseController = require('./controllers/expenseController');
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

// Expense routes
app.post('/add-expense', authMiddleware, expenseController.addExpense);
app.get('/get-expenses', authMiddleware, expenseController.getExpenses);
app.delete('/expense/:id', authMiddleware, expenseController.deleteExpenseById);

// Premium routes
app.post('/buy-premium', authMiddleware, userController.setUserPremium);
app.get('/profile', authMiddleware, userController.getUserProfile);

// Leaderboard route
app.get('/leaderboard', authMiddleware, expenseController.getLeaderboard);

// Default route for undefined paths
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
