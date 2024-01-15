const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors'); // Import the cors middleware

app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Mock user data (replace this with your database)
const users = [{ username: 'bj', password: 'pass424' }];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/account/login', (req, res) => {
    const { userid, password } = req.body;

    // Check user credentials (mock data, replace with database query)
    const user = users.find(u => u.username === userid && u.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
