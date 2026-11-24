import React, { useState } from 'react';
import API from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await API.post('/auth/register', {
                name: formData.name,
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });
            setMessage("Registration Successful! ✅ Login page par bhej rahe hain...");
            
            // Turant Login page par redirect karein aur email saath bhejein
            setTimeout(() => {
                navigate('/login', { state: { registeredEmail: formData.email.trim().toLowerCase() } });
            }, 800);
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration Failed! ❌ Server check karein.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{ width: '100%', padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {loading ? 'Creating Account...' : 'Register'}
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', textAlign: 'center', fontWeight: 'bold' }}>{message}</p>}
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Pehle se account hai? <Link to="/login">Login karein</Link>
            </p>
        </div>
    );
};

export default Register;
