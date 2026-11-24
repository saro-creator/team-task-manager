import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setMessage('Login Successful! ✅');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            setMessage(err.response?.data?.message || 'Login Failed! ❌');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px', boxSizing: 'border-box' }} 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    style={{ display: 'block', width: '100%', margin: '10px 0', padding: '10px', boxSizing: 'border-box' }} 
                />
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Login
                </button>
            </form>

            {message && <p style={{ marginTop: '10px' }}>{message}</p>}

            {/* Naye user ke liye Signup Link */}
            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                <p style={{ margin: 0 }}>
                    Naya account banana hai?{' '}
                    <Link to="/register" style={{ color: '#28a745', fontWeight: 'bold', textDecoration: 'none' }}>
                        Register / Signup karein
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
