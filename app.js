const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Sample endpoint to handle signup
app.post('/signup' , (req , res) => {
  const {name , email , password} = req.body; 

  if(name && email && password) {
    res.json({message: 'Signup Successfull'});
  } else {
    res.status(400).json({ message: 'Please fill all fields' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
