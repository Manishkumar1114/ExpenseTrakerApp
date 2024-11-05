async function submitSignup() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    document.getElementById('response-message').textContent = data.message;
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
