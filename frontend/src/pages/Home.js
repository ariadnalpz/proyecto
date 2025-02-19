import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Home = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    setMessage('Su sesión ha expirado');
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        navigate('/login');
                    }, 2000);
                }
            } catch (error) {
                console.error('Error decoding token:', error);
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Bienvenido a mi Inicio!</h1>
            <h2 style={styles.subtitle}>Práctica 1 - Ariadna López</h2> {message && <p style={styles.message}>{message}</p>}
            <button onClick={handleLogout} style={styles.button}>
                Logout
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f5f5f5',
    },
    title: {
        fontSize: '2.5rem',
        color: '#333',
        marginBottom: '20px',
    },
    message: {
        color: 'red',
        fontSize: '1.2rem',
        marginBottom: '20px',
    },
    button: {
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        backgroundColor: '#6a11cb',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default Home;