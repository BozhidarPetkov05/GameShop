import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { decodeToken } from '../utils/tokenUtils';
import styles from './Login.module.css';

export const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = await authService.login({ username, password });
            // Token is already saved in authService
            const claims = decodeToken(token);
            console.log('Decoded claims:', claims);
            if (claims) {
                login(token);
            } else {
                setError('Failed to decode token');
            }
        } catch (err) {
            console.error('Login error:', err);
            // Map authentication failures to a user-friendly message
            const msg = err instanceof Error ? err.message : 'Login failed';
            if (msg.toLowerCase().includes('authentication failed') || msg.toLowerCase().includes('no access token')) {
                setError('Invalid username or password');
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginBox}>
                <h1>GameShop</h1>
                <p>Sign in to your account</p>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', marginTop: '20px' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};
