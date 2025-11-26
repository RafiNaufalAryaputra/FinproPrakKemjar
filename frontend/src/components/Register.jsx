import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await API.post('/register', { username, password });
            alert('Registration successful');
            navigate('/');
        } catch (error) {
            alert('Registration failed!' + error);
        }
    };

    return (
        <div className="app-shell">
            <div className="container">
                <div className="sidebar">
                    <div className="logo">To Do List Mpruyyy</div>
                    <div className="subtitle">Buat akun untuk mengelola tugas izin</div>
                </div>
                <div className="main">
                    <h2 className="header">Create account</h2>
                    <input
                        className="input"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="button" onClick={handleRegister}>REGISTER</button>
                    <br />
                    <p>
                        Already have an account?{' '}
                        <Link to="/" className="link">Login Here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
