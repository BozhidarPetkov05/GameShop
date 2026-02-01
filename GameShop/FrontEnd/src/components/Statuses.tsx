import React, { useState, useEffect } from 'react';
import { statusService } from '../services/statusService';
import { StatusResponse, StatusRequest } from '../entities';
import { useAuth } from '../context/AuthContext';
import styles from './Statuses.module.css';

export const Statuses: React.FC = () => {
    const [items, setItems] = useState<StatusResponse[]>([]);
    const [selectedItem, setSelectedItem] = useState<StatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formError, setFormError] = useState('');
    const { isAdmin } = useAuth();
    const [formData, setFormData] = useState<StatusRequest>({
        name: '',
        description: '',
    });

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await statusService.getAllStatuses();
            setItems(data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to load statuses';
            setError(`Unable to load statuses: ${msg}`);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (statusName: string): string => {
        switch (statusName.toLowerCase()) {
            case 'pending':
                return '#f59e0b';
            case 'completed':
                return '#10b981';
            case 'cancelled':
                return '#ef4444';
            default:
                return '#0066cc';
        }
    };

    const handleItemClick = async (item: StatusResponse) => {
        try {
            const data = await statusService.getStatusById(item.id);
            setSelectedItem(data);
            setFormData({ name: data.name, description: data.description });
            setIsEditing(false);
            setIsCreating(false);
            setShowDetail(true);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to load status details';
            setError(`Unable to load status details: ${msg}`);
        }
    };

    const handleCreateClick = () => {
        setSelectedItem(null);
        setFormData({ name: '', description: '' });
        setIsCreating(true);
        setIsEditing(true);
        setShowDetail(true);
    };

    const handleSave = async () => {
        if (!selectedItem) return;

        try {
            setFormError('');
            await statusService.updateStatus(selectedItem.id, formData);
            setShowDetail(false);
            loadItems();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to update status';
            setFormError(`Unable to update status: ${msg}`);
        }
    };

    const handleCreate = async () => {
        try {
            setFormError('');
            await statusService.createStatus(formData);
            closeModal();
            loadItems();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to create status';
            setFormError(`Unable to create status: ${msg}`);
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        try {
            setFormError('');
            await statusService.deleteStatus(selectedItem.id);
            closeModal();
            loadItems();
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Failed to delete status';
            setFormError(`Unable to delete status: ${msg}`);
        }
    };

    const closeModal = () => {
        setShowDetail(false);
        setIsCreating(false);
        setIsEditing(false);
        setSelectedItem(null);
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading statuses...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>Statuses</h1>
                <button className="btn-success" onClick={handleCreateClick} style={{ marginBottom: '20px' }}>+ Add Status</button>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="grid grid-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        onClick={() => handleItemClick(item)}
                        style={{
                            borderLeft: `4px solid ${getStatusColor(item.name)}`,
                        }}
                    >
                        <h3>{item.name}</h3>
                    </div>
                ))}
            </div>

            {showDetail && (selectedItem || isCreating) && (
                <div className="modal active" onClick={closeModal}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>{selectedItem ? selectedItem.name : (isCreating ? 'Add Status' : '')}</h2>
                            <button
                                className="close-btn"
                                onClick={closeModal}
                            >
                                ×
                            </button>
                        </div>

                        {formError && <div className="error" style={{ margin: '10px 20px' }}>{formError}</div>}

                        {!isEditing ? (
                            <>
                                <div className={styles.detail}>
                                    <div className={styles.row}>
                                        <strong>ID:</strong>
                                        <span>{selectedItem.id}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <strong>Name:</strong>
                                        <span className={styles.statusBadge}>
                                            {selectedItem.name}
                                            <span
                                                className={styles.colorDot}
                                                style={{
                                                    backgroundColor: getStatusColor(selectedItem.name),
                                                }}
                                            ></span>
                                        </span>
                                    </div>

                                    <div className={styles.section}>
                                        <strong>Order Ids:</strong>
                                        <p>
                                            {selectedItem.orders && selectedItem.orders.length > 0 ? (
                                                selectedItem.orders.map((o) => `#${o.id}`).join(', ')
                                            ) : (
                                                'No orders'
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="button-group">
                                    {isAdmin && (
                                        <button
                                            className="btn-danger"
                                            onClick={handleDelete}
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        className="btn-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={closeModal}
                                    >
                                        Close
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles.form}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    name: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="button-group">
                                    {isCreating ? (
                                        <>
                                            <button className="btn-success" onClick={handleCreate}>
                                                Create
                                            </button>
                                            <button className="btn-secondary" onClick={closeModal}>
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn-success" onClick={handleSave}>
                                                Save
                                            </button>
                                            <button
                                                className="btn-danger"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </button>
                                            <button
                                                className="btn-secondary"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
