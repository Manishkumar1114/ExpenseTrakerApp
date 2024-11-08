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
    }
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('login-response-message').textContent = 'An error occurred';
  }
}

