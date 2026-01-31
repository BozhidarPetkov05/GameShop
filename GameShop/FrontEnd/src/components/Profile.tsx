import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { UserResponse, UserRequest } from '../entities';
import styles from './Profile.module.css';

export const Profile: React.FC = () => {
    const { userClaims, logout } = useAuth();
    const [user, setUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState<Partial<UserRequest>>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
    });

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        if (!userClaims?.loggedUserId) return;

        try {
            setLoading(true);
            setError('');
            const data = await userService.getUserById(userClaims.loggedUserId);
            setUser(data);
            setFormData({
                username: data.username,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async () => {
        if (!userClaims?.loggedUserId) return;

        try {
            setError('');
            setSuccess('');
            const updateData: Partial<UserRequest> = {
                username: formData.username,
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                isAdmin: user.isAdmin,
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            await userService.updateUser(userClaims.loggedUserId, updateData);
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
            setFormData((prev) => ({ ...prev, password: '' }));
            loadProfile();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        }
    };

    const handleDelete = async () => {
        if (!userClaims?.loggedUserId) return;

        try {
            setError('');
            await userService.deleteUser(userClaims.loggedUserId);
            setSuccess('Account deleted successfully!');
            setTimeout(() => {
                logout();
            }, 2000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete account');
            setShowDeleteConfirm(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    if (!user) {
        return <div className="error">Failed to load profile</div>;
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileCard}>
                <h1>My Profile</h1>

                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}

                {!isEditing ? (
                    <>
                        <div className={styles.profileInfo}>
                            <div className={styles.infoRow}>
                                <label>Username:</label>
                                <span>{user.username}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <label>Email:</label>
                                <span>{user.email ?? formData.email ?? 'No email'}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <label>First Name:</label>
                                <span>{user.firstName}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <label>Last Name:</label>
                                <span>{user.lastName}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <label>Admin:</label>
                                <span>{user.isAdmin ? 'Yes' : 'No'}</span>
                            </div>

                        </div>

                        <div className="button-group" style={{ marginTop: '30px' }}>
                            <button
                                className="btn-primary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                            <button
                                className="btn-danger"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.editForm}>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    value={formData.username || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    id="firstName"
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    id="lastName"
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password (leave empty to keep current)</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password || ''}
                                    onChange={handleInputChange}
                                    placeholder="New password (optional)"
                                />
                            </div>

                            <div className="button-group">
                                <button
                                    className="btn-success"
                                    onClick={handleUpdate}
                                >
                                    Save Changes
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            username: user.username,
                                            email: user.email,
                                            firstName: user.firstName,
                                            lastName: user.lastName,
                                            password: '',
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {showDeleteConfirm && (
                    <div className="modal active" onClick={() => setShowDeleteConfirm(false)}>
                        <div
                            className="modal-content"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="modal-header">
                                <h2>Confirm Delete</h2>
                            </div>
                            <p>
                                Are you sure you want to delete your account? This action cannot
                                be undone.
                            </p>
                            <div className="button-group">
                                <button
                                    className="btn-danger"
                                    onClick={handleDelete}
                                >
                                    Delete Account
                                </button>
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
