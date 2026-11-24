import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Login = () => {
    const location = useLocation();
    // Agar Register page se aaye hain toh email automatic fill ho jayega
    const [email, setEmail] = useState(location.state?.registeredEmail || '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(
        location.state?.registeredEmail ? 'Account ban gaya! ✅ Ab apna password daalkar Login karein.' : ''
    );
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const res = await API.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            setMessage('Login Successful! ✅');
            navigate('/dashboard');
        } catch (err) {
            // Exact error reason dikhayega (e.g. Invalid credentials, User not found, ya Network Error)
            const errorReason = err.response?.data?.message || err.message || 'Server se connect nahi ho paya';
            setMessage(`Login Failed: ${errorReason} ❌`);
        } finally {
            setLoading(false);
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
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {message && <p style={{ marginTop: '12px', fontWeight: 'bold' }}>{message}</p>}

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
