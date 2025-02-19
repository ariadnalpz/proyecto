const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const db = require('./firebase'); // Importación de Firebase

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Middleware para validar campos
const validateFields = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ statusCode: 400, message: 'Se requieren nombre de usuario y contraseña' });
    }
    next();
};

// Ruta de login
app.post('/login', validateFields, async (req, res) => {
    const { username, password } = req.body;
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();

        if (snapshot.empty) {
            return res.status(401).json({ statusCode: 401, message: 'Credenciales no válidas' });
        }

        let user;
        snapshot.forEach(doc => {
            user = { id: doc.id, ...doc.data() };
        });

        // Comparar contraseñas encriptadas
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1m' });
            await usersRef.doc(user.id).update({ lastLogin: new Date() }); // Actualizar last-login
            res.status(200).json({ statusCode: 200, intDataMessage: [{ credentials: token }] });
        } else {
            res.status(401).json({ statusCode: 401, message: 'Credenciales no válidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Error Interno del Servidor' });
    }
});

// Ruta de registro
app.post('/register', validateFields, async (req, res) => {
    const { email, username, password, role } = req.body;
    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('username', '==', username).get();

        if (!snapshot.empty) {
            return res.status(400).json({ statusCode: 400, message: 'El nombre de usuario ya existe' });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            email,
            username,
            password: hashedPassword,
            role: role || 'common_user', // Rol por defecto
            dateRegister: new Date(),
            lastLogin: null,
        };

        await usersRef.add(newUser);
        res.status(201).json({ statusCode: 201, message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ statusCode: 500, message: 'Error Interno del Servidor' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});