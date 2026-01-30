import React, { useState, useEffect } from 'react';
import { statusService } from '../services/statusService';
import { StatusResponse, StatusRequest } from '../entities';
import styles from './Statuses.module.css';

export const Statuses: React.FC = () => {
    const [items, setItems] = useState<StatusResponse[]>([]);
    const [selectedItem, setSelectedItem] = useState<StatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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
            setError(err instanceof Error ? err.message : 'Failed to load statuses');
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
            setShowDetail(true);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to load details');
        }
    };

    const handleSave = async () => {
        if (!selectedItem) return;

        try {
            await statusService.updateStatus(selectedItem.id, formData);
            alert('Status updated successfully!');
            setShowDetail(false);
            loadItems();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update');
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;
        if (!window.confirm('Are you sure?')) return;

        try {
            await statusService.deleteStatus(selectedItem.id);
            alert('Status deleted successfully!');
            setShowDetail(false);
            loadItems();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete');
        }
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
            <h1>Statuses</h1>

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
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>

            {showDetail && selectedItem && (
                <div className="modal active" onClick={() => setShowDetail(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>{selectedItem.name}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowDetail(false)}
                            >
                                ×
                            </button>
                        </div>

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
                                        <strong>Description:</strong>
                                        <p>{selectedItem.description}</p>
                                    </div>
                                </div>

                                <div className="button-group">
                                    <button
                                        className="btn-primary"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setShowDetail(false)}
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

                                    <div className="form-group">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    description: e.target.value,
                                                }))
                                            }
                                            rows={4}
                                        />
                                    </div>
                                </div>

                                <div className="button-group">
                                    <button
                                        className="btn-success"
                                        onClick={handleSave}
                                    >
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
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
