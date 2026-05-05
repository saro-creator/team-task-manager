import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register'; 
import Login from './pages/Login'; 

function App() {
  // Yeh check karta hai ki user ne pehle se login kiya hai ya nahi
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Jab koi sirf website ka link khole, toh use Login par bhej do */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        {/* Registration Page ka Route */}
        <Route path="/register" element={<Register />} />
        
        {/* Login Page ka Route */}
        <Route path="/login" element={<Login />} />
        
        {/* Dashboard ka Route: Agar token hai toh dikhao, nahi toh Login par bhej do */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Dashboard Page</h1>
              <p>Welcome! Aap login ho chuke hain.</p>
              <button onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}>Logout</button>
            </div>
          ) : (
            <Navigate to="/login" />
          )} 
        />
        
        {/* Agar koi galat URL daale toh Login par bhej do */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;