import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta para el login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta para el home */}
          <Route path="/home" element={<Home />} />

          {/* Redirección automática a /login si se accede a la raíz */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;