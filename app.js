const express = require('express');
const bodyParser = require('body-parser');
const userController = require('./controllers/userController');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Route to handle signup
app.post('/signup', userController.signup);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
