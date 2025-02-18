const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Usuarios hardcodeados
const users = [
    { id: 1, username: 'admin', password: '123' },
    { id: 2, username: 'ariadna', password: '123456789' }
];

// Middleware para validar campos
const validateFields = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ statusCode: 400, message: 'Username and password are required' });
    }
    next();
};

// Ruta de login
app.post('/login', validateFields, (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1m' });
        res.status(200).json({ statusCode: 200, intDataMessage: [{ credentials: token }] });
    } else {
        res.status(401).json({ statusCode: 401, message: 'Invalid credentials' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});