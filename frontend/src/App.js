import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register'; // Check karein ye path sahi hai
import Login from './pages/Login'; // Naya import

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        {/* Main page par login dikhayega */}
        <Route path="/" element={!isLoggedIn ? <div style={{textAlign: 'center', marginTop: '100px'}}><h2>Login Page</h2></div> : <Navigate to="/dashboard" />} />
        
        {/* Ye line sabse zaroori hai */}
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}
//loginss

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
