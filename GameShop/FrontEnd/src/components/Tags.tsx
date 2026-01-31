import React, { useState, useEffect } from 'react';
import { tagService } from '../services/tagService';
import { TagResponse, TagRequest } from '../entities';
import { useAuth } from '../context/AuthContext';
import styles from './EntityList.module.css';

export const Tags: React.FC = () => {
    const [items, setItems] = useState<TagResponse[]>([]);
    const [selectedItem, setSelectedItem] = useState<TagResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState<TagRequest>({
        name: '',
        description: '',
    });
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await tagService.getAllTags();
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load tags');
        } finally {
            setLoading(false);
        }
    };

    const handleItemClick = async (item: TagResponse) => {
        try {
            const data = await tagService.getTagById(item.id);
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
            await tagService.updateTag(selectedItem.id, formData);
            setShowDetail(false);
            loadItems();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update');
        }
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        try {
            await tagService.deleteTag(selectedItem.id);
            setShowDetail(false);
            loadItems();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete');
        }
    };

    const handleDeleteFromCard = async (e: React.MouseEvent, tagId: number) => {
        e.stopPropagation();

        try {
            await tagService.deleteTag(tagId);
            loadItems();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete');
        }
    };

    const handleOpenAddModal = () => {
        setFormData({ name: '', description: '' });
        setShowAddModal(true);
    };

    const handleSaveAdd = async () => {
        if (!formData.name.trim()) {
            alert('Tag name is required');
            return;
        }

        try {
            await tagService.createTag(formData);
            setShowAddModal(false);
            loadItems();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to create tag');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading tags...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Tags</h1>

            {error && <div className="error">{error}</div>}

            {isAdmin && (
                <button
                    className="btn-success"
                    onClick={handleOpenAddModal}
                    style={{ marginBottom: '20px' }}
                >
                    + Add Tag
                </button>
            )}

            <div className="grid grid-3">
                {items.map((item) => (
                    <div
                        key={item.id}
                        className={styles.card}
                        onClick={() => handleItemClick(item)}
                        style={{ position: 'relative' }}
                    >
                        <h3>{item.name}</h3>
                        <p>{item.description}</p>
                        {isAdmin && (
                            <button
                                className="btn-danger"
                                onClick={(e) => handleDeleteFromCard(e, item.id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    padding: '4px 8px',
                                    fontSize: '12px',
                                }}
                            >
                                Delete
                            </button>
                        )}
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
                                    {selectedItem.games && selectedItem.games.length > 0 && (
                                        <div className={styles.section}>
                                            <strong>Games:</strong>
                                            <div style={{ marginTop: '10px' }}>
                                                {selectedItem.games.map((game, index) => (
                                                    <div key={index} style={{ padding: '5px 0', borderBottom: '1px solid var(--border-color)' }}>
                                                        {game}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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

            {/* Add Tag Modal */}
            {showAddModal && (
                <div className="modal active" onClick={() => setShowAddModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>Add New Tag</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowAddModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.form}>
                            <div className="form-group">
                                <label htmlFor="addName">Name</label>
                                <input
                                    id="addName"
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
                            <button
                                className="btn-success"
                                onClick={handleSaveAdd}
                            >
                                Create
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowAddModal(false)}
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
