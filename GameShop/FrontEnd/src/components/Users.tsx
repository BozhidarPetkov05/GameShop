import React, { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { UserResponse, UserRequest } from '../entities';
import { useAuth } from '../context/AuthContext';
import styles from './Users.module.css';

export const Users: React.FC = () => {
    const { isAdmin } = useAuth();
    const [users, setUsers] = useState<UserResponse[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [editError, setEditError] = useState('');
    const [createError, setCreateError] = useState('');
    const [editForm, setEditForm] = useState<any>({});
    const [createForm, setCreateForm] = useState<UserRequest>({
        username: '',
        email: '',
        firstName: '',
        lastName: '',
        password: '',
    });
    const [createFormIsAdmin, setCreateFormIsAdmin] = useState(false);

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
            setError(err instanceof Error ? err.message : 'Failed to load user details');
        }
    };

    const handleEditClick = (user: UserResponse) => {
        setSelectedUser(user);
        setEditForm({
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            password: (user as any).password || ''
        });
        setShowEdit(true);
    };

    const handleDeleteUser = async (userId: number) => {
        try {
            await userService.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            setShowDetail(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete user');
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;
        try {
            await userService.updateUser(selectedUser.id, editForm as UserRequest);
            // Reload users list
            await loadUsers();
            setShowEdit(false);
            setShowDetail(false);
        } catch (err) {
            setEditError(err instanceof Error ? err.message : 'Failed to update user');
        }
    };

    const handleCreateUser = async () => {
        if (!createForm.username || !createForm.email || !createForm.password) {
            setCreateError('Username, email, and password are required');
            return;
        }

        try {
            const userToCreate: UserRequest = {
                ...createForm,
                isAdmin: createFormIsAdmin,
            };
            await userService.createUser(userToCreate);
            setShowCreate(false);
            setCreateForm({
                username: '',
                email: '',
                firstName: '',
                lastName: '',
                password: '',
            });
            setCreateFormIsAdmin(false);
            await loadUsers();
        } catch (err) {
            setCreateError(err instanceof Error ? err.message : 'Failed to create user');
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>User Management</h1>
                {isAdmin && (
                    <button
                        className="btn-success"
                        onClick={() => setShowCreate(true)}
                        style={{ marginBottom: '20px' }}
                    >
                        + Add User
                    </button>
                )}
            </div>

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
                                        style={{ padding: '4px 8px', fontSize: '12px', marginRight: '5px' }}
                                        onClick={() => handleUserClick(user)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="btn-primary"
                                        style={{ padding: '4px 8px', fontSize: '12px', marginRight: '5px' }}
                                        onClick={() => handleEditClick(user)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-danger"
                                        style={{ padding: '4px 8px', fontSize: '12px' }}
                                        onClick={() => handleDeleteUser(user.id)}
                                    >
                                        Delete
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
                        {error && <div className="error">{error}</div>}
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
                            {isAdmin && (
                                <div className={styles.detailRow}>
                                    <strong>Password:</strong>
                                    <span>{selectedUser.password || '••••••••'}</span>
                                </div>
                            )}
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

            {/* User Edit Modal */}
            {showEdit && selectedUser && (
                <div className="modal active" onClick={() => setShowEdit(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {editError && <div className="error">{editError}</div>}
                        <div className="modal-header">
                            <h2>Edit User</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowEdit(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={editForm.username || ''}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={editForm.email || ''}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={editForm.firstName || ''}
                                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={editForm.password || ''}
                                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={editForm.lastName || ''}
                                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={editForm.isAdmin || false}
                                        onChange={(e) => setEditForm({ ...editForm, isAdmin: e.target.checked })}
                                    />
                                    Admin
                                </label>
                            </div>
                        </div>

                        <div className="button-group">
                            <button
                                className="btn-primary"
                                onClick={handleSaveEdit}
                            >
                                Save
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowEdit(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* User Create Modal */}
            {showCreate && (
                <div className="modal active" onClick={() => setShowCreate(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {createError && <div className="error">{createError}</div>}
                        <div className="modal-header">
                            <h2>Add New User</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowCreate(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={createForm.username || ''}
                                    onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={createForm.email || ''}
                                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={createForm.firstName || ''}
                                    onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={createForm.lastName || ''}
                                    onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={createForm.password || ''}
                                    onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={createFormIsAdmin}
                                        onChange={(e) => setCreateFormIsAdmin(e.target.checked)}
                                    />
                                    Admin
                                </label>
                            </div>
                        </div>

                        <div className="button-group">
                            <button
                                className="btn-success"
                                onClick={handleCreateUser}
                            >
                                Create
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowCreate(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
