import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://team-task-manager-nmwu.onrender.com/api/auth/login', {
                email,
                password
            });
            
            // Token ko localStorage mein save karein
            localStorage.setItem('token', res.data.token);
            setMessage('Login Successful! ✅');
            
            // Login ke baad Dashboard par bhej dein
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login Failed! ❌');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }}
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', margin: '10px 0', padding: '8px' }}
                />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>
                    Login
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;