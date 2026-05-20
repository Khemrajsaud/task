import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-8">Create Account</h2>
                {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-100/10 rounded border border-red-500/50">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Username</label>
                        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                            className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                            className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                            className="w-full px-4 py-2 mt-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"/>
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none transition-all shadow-md hover:shadow-blue-500/25">
                        Sign Up
                    </button>
                </form>
                <p className="mt-6 text-sm text-center text-gray-400">
                    Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
