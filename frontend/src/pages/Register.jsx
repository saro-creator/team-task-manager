import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [message, setMessage] = useState('');

    // Aapka live backend URL
    const BACKEND_URL = "https://team-task-manager-nmwu.onrender.com/api/auth/register";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(BACKEND_URL, formData);
            setMessage("Registration Successful! ✅");
            console.log(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || "Registration Failed! ❌");
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name:</label><br />
                    <input type="text" name="name" onChange={handleChange} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label><br />
                    <input type="email" name="email" onChange={handleChange} required style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Password:</label><br />
                    <input type="password" name="password" onChange={handleChange} required style={{ width: '100%' }} />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', background: '#007bff', color: '#white', border: 'none', cursor: 'pointer' }}>
                    Register
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', textAlign: 'center' }}>{message}</p>}
        </div>
    );
};

export default Register;