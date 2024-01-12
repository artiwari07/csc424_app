const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 8000;

app.use(bodyParser.json());

const users = [
  { id: 1, username: 'bj', password: 'pass424' }
];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/account/login', (req, res) => {
  const { username, password } = req.body;

/* To check if user and password match */
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = generateToken(); // Replace with your token generation logic
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Function to generate a dummy token (replace this with a proper token generation logic)
function generateToken() {
  return 'dummy_token';
}
