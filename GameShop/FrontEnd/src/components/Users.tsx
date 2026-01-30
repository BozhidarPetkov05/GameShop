import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { UserResponse } from '../entities';
import styles from './Users.module.css';

export const Users: React.FC = () => {
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleUserClick = async (user: UserResponse) => {
        try {
            const userData = await userService.getUserById(user.id);
            setSelectedUser(userData);
            setShowDetail(true);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to load user details');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className={styles.usersContainer}>
            <h1>User Management</h1>

            {error && <div className="error">{error}</div>}

            <div className={styles.usersTable}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Admin</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.isAdmin ? '✓' : '✗'}</td>
                                <td>
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '4px 8px', fontSize: '12px' }}
                                        onClick={() => handleUserClick(user)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal */}
            {showDetail && selectedUser && (
                <div className="modal active" onClick={() => setShowDetail(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>User Details</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowDetail(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.userDetail}>
                            <div className={styles.detailRow}>
                                <strong>ID:</strong>
                                <span>{selectedUser.id}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <strong>Username:</strong>
                                <span>{selectedUser.username}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <strong>Email:</strong>
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <strong>First Name:</strong>
                                <span>{selectedUser.firstName}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <strong>Last Name:</strong>
                                <span>{selectedUser.lastName}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <strong>Admin:</strong>
                                <span>{selectedUser.isAdmin ? 'Yes' : 'No'}</span>
                            </div>
                        </div>

                        <div className="button-group">
                            <button
                                className="btn-secondary"
                                onClick={() => setShowDetail(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
