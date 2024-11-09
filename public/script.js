async function submitSignup() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Tells the backend this is JSON data
      body: JSON.stringify({ name, email, password }) // Convert data to JSON format
    });

    const data = await response.json();

    document.getElementById('response-message').textContent = data.message; //Handle response from thebackend
    if (response.ok) {
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('password').value = '';
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('response-message').textContent = 'An error occurred';
  }
}
// Login page
async function submitLogin() {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById('login-response-message').textContent = data.message;

    if (response.ok) {
      // Clear fields if login is successful
      document.getElementById('login-email').value = '';
      document.getElementById('login-password').value = '';

      // Redirect to the expense dashboard page after successful login
      window.location.href = '/expenses.html'; // Ensure this path matches your file location
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('login-response-message').textContent = 'An error occurred';
  }
}

async function submitExpense() {
  const amount = document.getElementById('expense-amount').value;
  const description = document.getElementById('expense-description').value;
  const category = document.getElementById('expense-category').value;

  try {
    const response = await fetch('/add-expense', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description, category })
    });

    const data = await response.json();
    document.getElementById('expense-message').textContent = data.message;

    if (response.ok) {
      document.getElementById('expense-form').reset(); // Clear the form
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('expense-message').textContent = 'Error adding expense';
  }
}


async function fetchExpenses() {
  try {
    const response = await fetch('/get-expenses'); // API endpoint to fetch expenses
    const data = await response.json();

    if (response.ok) {
      const expenses = data.expenses;
      const expenseTable = document.getElementById('expense-table');
      
      // Clear the table before adding new rows
      expenseTable.innerHTML = '';

      // Populate the table with expenses
      expenses.forEach(expense => {
        const row = expenseTable.insertRow();
        row.insertCell(0).textContent = expense.amount;
        row.insertCell(1).textContent = expense.description;
        row.insertCell(2).textContent = expense.category;
        row.insertCell(3).textContent = new Date(expense.date).toLocaleString();
      });
    } else {
      console.error('Error fetching expenses');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call fetchExpenses on page load
window.onload = fetchExpenses;
