import React, { useState, useEffect } from 'react';
import { companyService } from '../services/companyService';
import { CompanyResponse, CompanyRequest } from '../entities';
import { useAuth } from '../context/AuthContext';
import styles from './EntityList.module.css';

export const Companies: React.FC = () => {
    const [items, setItems] = useState<CompanyResponse[]>([]);
    const [selectedItem, setSelectedItem] = useState<CompanyResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<CompanyRequest>({
        name: '',
        description: '',
        foundedYear: new Date().getFullYear(),
    });
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await companyService.getAllCompanies();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load companies');
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = async (item: CompanyResponse) => {
        try {
            const data = await companyService.getCompanyById(item.id);
            setSelectedItem(data);
            setFormData({
                name: data.name,
                description: data.description,
                foundedYear: data.foundedYear,
            });
            setIsEditing(false);
            setShowDetail(true);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to load details');
        }
    };

    const handleSave = async () => {
        if (!selectedItem) return;

        try {
            await companyService.updateCompany(selectedItem.id, formData);
            alert('Company updated successfully!');
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
            await companyService.deleteCompany(selectedItem.id);
            alert('Company deleted successfully!');
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
                <p>Loading companies...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Companies</h1>

            {error && <div className="error">{error}</div>}

            <div className="grid grid-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        onClick={() => handleItemClick(item)}
                    >
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        <p style={{ fontSize: '12px', marginTop: '10px', color: '#999' }}>
                            Founded: {item.foundedYear}
                        </p>
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
                                        <span>{selectedItem.name}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <strong>Founded Year:</strong>
                                        <span>{selectedItem.foundedYear}</span>
                                    </div>
                                    <div className={styles.section}>
                                        <strong>Description:</strong>
                                        <p>{selectedItem.description}</p>
                                    </div>
                                </div>

                                <div className="button-group">
                                    {isAdmin && (
                                        <button
                                            className="btn-primary"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit
                                        </button>
                                    )}
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
                                        <label htmlFor="foundedYear">Founded Year</label>
                                        <input
                                            id="foundedYear"
                                            type="number"
                                            value={formData.foundedYear}
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    foundedYear: parseInt(e.target.value),
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
