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
      localStorage.setItem('user_ID', data.userID);
      localStorage.setItem('token', data.token);
      console.log('Login successful, redirecting...');
      window.location.href = '/expenses.html';
    }
  } catch (error) {
    console.error('Error during login:', error);
    document.getElementById('login-response-message').textContent = 'An error occurred';
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

// Fetch expenses on page load
window.onload = () => {
  if (document.getElementById('expense-table')) {
    fetchExpenses();
  }
};
