// Retrieve token and user ID from localStorage
const token = localStorage.getItem('token');
const user_ID = localStorage.getItem('user_ID');

// Function to handle signup
async function submitSignup() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    document.getElementById('response-message').textContent = data.message;

    if (response.ok) {
      document.getElementById('signup-form').reset(); // Clear form after successful signup
    }
  } catch (error) {
    console.error('Error during signup:', error);
    document.getElementById('response-message').textContent = 'An error occurred';
  }
}

// Function to handle login
async function submitLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    document.getElementById('login-response-message').textContent = data.message;

    if (response.ok && data.token) {
      // Store token and user details
      localStorage.setItem('user_ID', data.userID);
      localStorage.setItem('token', data.token);
      localStorage.setItem('isPremium', data.isPremium); // Store premium status
      // Redirect to the dashboard
      window.location.href = '/expenses.html';
    }
  } catch (error) {
    console.error('Error during login:', error);
    document.getElementById('login-response-message').textContent = 'An error occurred';
  }
}

// Function to handle premium membership purchase
async function buyPremium() {
  if (confirm('Do you want to buy a premium membership?')) {
    try {
      const response = await fetch('/buy-premium', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('isPremium', 'true'); // Update premium status in local storage
        const premiumButton = document.getElementById("buy-premium-btn");
        premiumButton.textContent = "Now You Are a Premium User";
        premiumButton.disabled = true;
        premiumButton.style.backgroundColor = "#28a745";
        premiumButton.style.cursor = "not-allowed";
        alert(data.message);
      } else {
        alert('Failed to upgrade to premium: ' + data.message);
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error);
      alert('An error occurred while upgrading to premium.');
    }
  }
}

// Function to submit an expense
async function submitExpense() {
  const amount = document.getElementById('expense-amount').value.trim();
  const description = document.getElementById('expense-description').value.trim();
  const category = document.getElementById('expense-category').value;

  if (!user_ID) {
    document.getElementById('expense-message').textContent = 'User is not logged in.';
    return;
  }

  if (!amount || !description || !category) {
    document.getElementById('expense-message').textContent = 'All fields are required!';
    return;
  }

  try {
    const response = await fetch('/add-expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ user_ID, amount, description, category }),
    });

    const data = await response.json();
    document.getElementById('expense-message').textContent = data.message;

    if (response.ok) {
      document.getElementById('expense-form').reset();
      fetchExpenses();
    }
  } catch (error) {
    console.error('Error adding expense:', error);
    document.getElementById('expense-message').textContent = 'Error adding expense';
  }
}

// Function to fetch expenses
async function fetchExpenses() {
  try {
    const response = await fetch('/get-expenses', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch expenses');
    }

    const data = await response.json();
    displayExpenses(data.expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    document.getElementById('expense-message').textContent = 'Error fetching expenses';
  }
}

// Function to delete an expense
async function deleteExpense(id) {
  try {
    const response = await fetch(`/expense/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
      fetchExpenses();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    alert('An error occurred while deleting the expense');
  }
}

// Function to display expenses on the page
function displayExpenses(expenses) {
  const expenseTable = document.getElementById('expense-table');
  expenseTable.innerHTML = ''; // Clear the table before populating

  expenses.forEach((expense) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${expense.amount}</td>
      <td>${expense.description}</td>
      <td>${expense.category}</td>
      <td><button onclick="deleteExpense('${expense.id}')">Delete</button></td>
    `;
    expenseTable.appendChild(row);
  });
}

// Function to fetch leaderboard data without a time frame
async function fetchLeaderboard() {
  try {
    const response = await fetch('http://localhost:3000/leaderboard', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Include token if required
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard data');
    }

    const data = await response.json();
    displayLeaderboard(data.leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
  }
}

// Function to display leaderboard data
function displayLeaderboard(leaderboard) {
  const leaderboardTableBody = document.getElementById('leaderboard-table').querySelector('tbody');
  leaderboardTableBody.innerHTML = ''; // Clear any existing rows

  if (!leaderboard || leaderboard.length === 0) {
    leaderboardTableBody.innerHTML = '<tr><td colspan="3">No data available</td></tr>';
    return;
  }

  leaderboard.forEach((entry, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${entry.user}</td>
      <td>${entry.totalExpenses}</td>
    `;
    leaderboardTableBody.appendChild(row);
  });
}

// Function to check premium status on page load
function checkPremiumStatus() {
  const isPremium = localStorage.getItem('isPremium') === 'true';
  const premiumButton = document.getElementById('buy-premium-btn');
  if (isPremium) {
    premiumButton.textContent = "Now You Are a Premium User";
    premiumButton.disabled = true;
    premiumButton.style.backgroundColor = "#28a745";
    premiumButton.style.cursor = "not-allowed";
  } else {
    premiumButton.textContent = "Buy Premium Membership";
    premiumButton.disabled = false;
    premiumButton.style.backgroundColor = ""; // Reset styles
    premiumButton.style.cursor = "";
  }
}


// Fetch expenses and leaderboard on page load
window.onload = () => {
  if (document.getElementById('expense-table')) {
    fetchExpenses();
  }
  if (document.getElementById('leaderboard-table')) {
    fetchLeaderboard();
  }
  checkPremiumStatus(); // Check premium status on every load
};

