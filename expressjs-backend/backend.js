const express = require('express');
const app = express();
const port = 8000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

// Mock user data (replace this with your database)
const users = [{ username: 'bj', password: 'pass424' }];

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/account/login', (req, res) => {
    const { userid, password } = req.body;
    const user = users.find(u => u.username === userid && u.password === password);

    if (user) {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
});

app.post('/account/register', (req, res) => {
    const { username, password } = req.body;

    // Check if the username is unique
    const isUsernameTaken = users.some(u => u.username === username);
    if (isUsernameTaken) {
        res.status(400).json({ success: false, error: 'Username is already taken' });
        return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ success: false, error: 'Password does not meet the required strength criteria' });
        return;
    }

    // Mock registration (replace this with actual database insertion)
    users.push({ username, password });
    
    res.json({ success: true });
});

app.get('/account/users', (req, res) => {
    res.json({ success: true, users });
});

// New route to get an individual user by username
app.get('/account/users/:username', (req, res) => {
    const { username } = req.params;
    const user = users.find(u => u.username === username);

    if (user) {
        res.json({ success: true, user });
    } else {
        res.status(404).json({ success: false, error: 'User not found' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
