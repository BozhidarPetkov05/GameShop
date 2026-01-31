import React, { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import { orderService } from '../services/orderService';
import { companyService } from '../services/companyService';
import { genreService } from '../services/genreService';
import { tagService } from '../services/tagService';
import { platformService } from '../services/platformService';
import { GameResponse, OrderRequest, CompanyResponse, GenreResponse, TagResponse, PlatformResponse } from '../entities';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styles from './Games.module.css';

export const Games: React.FC = () => {
    const [games, setGames] = useState<GameResponse[]>([]);
    const [selectedGame, setSelectedGame] = useState<GameResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showGameDetail, setShowGameDetail] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [editLoading, setEditLoading] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [addError, setAddError] = useState('');
    const [companies, setCompanies] = useState<CompanyResponse[]>([]);
    const [genres, setGenres] = useState<GenreResponse[]>([]);
    const [tags, setTags] = useState<TagResponse[]>([]);
    const [platforms, setPlatforms] = useState<PlatformResponse[]>([]);
    const [editData, setEditData] = useState<any>(null);
    const [addData, setAddData] = useState<any>({
        title: '',
        description: '',
        price: 0,
        company: '',
        genre: '',
        tags: [],
        platforms: [],
    });
    const { cart, clearCart, addToCart, isGameInCart } = useCart();
    const { isAdmin } = useAuth();
    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        loadGames();
        loadMetadata();
    }, []);

    const loadMetadata = async () => {
        try {
            const [companiesData, genresData, tagsData, platformsData] = await Promise.all([
                companyService.getAllCompanies().catch(() => []),
                genreService.getAllGenres().catch(() => []),
                tagService.getAllTags().catch(() => []),
                platformService.getAllPlatforms().catch(() => []),
            ]);
            setCompanies(companiesData);
            setGenres(genresData);
            setTags(tagsData);
            setPlatforms(platformsData);
        } catch (err) {
            console.error('Failed to load metadata:', err);
            // Don't break the app, just log the error
        }
    };

    const loadGames = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await gameService.getAllGames();
            setGames(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load games');
        } finally {
            setLoading(false);
        }
    };

    const handleGameClick = (game: GameResponse) => {
        setSelectedGame(game);
        setShowGameDetail(true);
    };

    const handleAddToCart = (game: GameResponse) => {
        addToCart(game);
    };

    const handleDeleteGame = async () => {
        if (!selectedGame) return;
        try {
            await gameService.deleteGame(selectedGame.id);
            setShowGameDetail(false);
            setSelectedGame(null);
            loadGames();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete game');
        }
    };

    const handleEditGame = (game: GameResponse) => {
        setEditData({
            title: game.title || '',
            description: game.description || '',
            price: Number(game.price) || 0,
            company: game.company || '',
            genre: game.genre || '',
            tags: game.tags || [],
            platforms: game.platforms || [],
        });
        setShowEditModal(true);
    };

    const handleOpenAddModal = () => {
        setAddData({
            title: '',
            description: '',
            price: 0,
            company: '',
            genre: '',
            tags: [],
            platforms: [],
        });
        setAddError('');
        setShowAddModal(true);
    };

    const handleSaveAdd = async () => {
        if (!addData.title || !addData.company || !addData.genre || addData.tags.length === 0 || addData.platforms.length === 0) {
            setAddError('Please fill in all required fields');
            return;
        }

        setAddLoading(true);
        setAddError('');

        try {
            const companyId = companies.find(c => c.name === addData.company)?.id || 0;
            const genreId = genres.find(g => g.name === addData.genre)?.id || 0;
            const tagIds = tags
                .filter(t => addData.tags.includes(t.name))
                .map(t => t.id);
            const platformIds = platforms
                .filter(p => addData.platforms.includes(p.name))
                .map(p => p.id);

            if (!companyId || !genreId) {
                setAddError('Invalid company or genre selected');
                return;
            }

            const createData = {
                name: addData.title,
                description: addData.description,
                price: Number(addData.price) || 0,
                companyId,
                genreId,
                tagIds,
                platformIds,
                releaseDate: new Date().toISOString(),
            };

            await gameService.createGame(createData);
            setShowAddModal(false);
            loadGames();
        } catch (err) {
            setAddError(err instanceof Error ? err.message : 'Failed to create game');
        } finally {
            setAddLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        if (!selectedGame || !editData) return;
        setEditLoading(true);
        setEditError('');

        try {
            // Find the IDs for the selected company, genre, tags, and platforms
            const companyId = companies.find(c => c.name === editData.company)?.id || 0;
            const genreId = genres.find(g => g.name === editData.genre)?.id || 0;
            const tagIds = tags
                .filter(t => editData.tags.includes(t.name))
                .map(t => t.id);
            const platformIds = platforms
                .filter(p => editData.platforms.includes(p.name))
                .map(p => p.id);

            const updateData = {
                name: editData.title,
                description: editData.description,
                price: Number(editData.price) || 0,
                companyId,
                genreId,
                tagIds,
                platformIds,
                releaseDate: new Date().toISOString(),
            };

            await gameService.updateGame(selectedGame.id, updateData);
            setShowEditModal(false);
            setShowGameDetail(false);
            setSelectedGame(null);
            loadGames();
        } catch (err) {
            setEditError(err instanceof Error ? err.message : 'Failed to update game');
        } finally {
            setEditLoading(false);
        }
    };

    const handleMakeOrder = async () => {
        if (!shippingAddress.trim()) {
            alert('Please enter a shipping address');
            return;
        }
        if (totalCartCount === 0) {
            alert('Cart is empty');
            return;
        }

        try {
            setOrderLoading(true);
            const orderData: OrderRequest = {
                shippingAddress,
                games: cart.map((item) => item.game.title),
            };

            await orderService.createOrder(orderData);
            clearCart();
            setShippingAddress('');
            setShowCart(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to create order');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading games...</p>
            </div>
        );
    }

    return (
        <div className={styles.gamesContainer}>
            <div className={styles.header}>
                <h1>Games</h1>
                <div className={styles.cartIndicator}>
                    {isAdmin && (
                        <button
                            className="btn-success"
                            onClick={handleOpenAddModal}
                            style={{ marginRight: '10px' }}
                        >
                            + Add Game
                        </button>
                    )}
                    <button
                        className="btn-secondary"
                        onClick={() => setShowCart(true)}
                        style={{ position: 'relative' }}
                    >
                        🛒 Cart
                        {totalCartCount > 0 && (
                            <span className={styles.cartBadge}>{totalCartCount}</span>
                        )}
                    </button>
                </div>
            </div>

            {error && <div className="error">{error}</div>}

            <div className="grid grid-4">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className={styles.gameCard}
                        onClick={() => handleGameClick(game)}
                    >
                        <div className={styles.gameCardHeader}>
                            <h3>{game.title}</h3>
                            <p className={styles.price}>${game.price.toFixed(2)}</p>
                        </div>
                        <p className={styles.description}>{game.description}</p>
                        <p className={styles.meta}>
                            {game.genre && <span>{game.genre}</span>}
                        </p>
                        <button
                            className="btn-primary"
                            disabled={isGameInCart(game.id)}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(game);
                            }}
                            style={{
                                opacity: isGameInCart(game.id) ? 0.5 : 1,
                                cursor: isGameInCart(game.id) ? 'not-allowed' : 'pointer',
                            }}
                        >
                            {isGameInCart(game.id) ? 'In Cart' : 'Add to Cart'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Game Detail Modal */}
            {showGameDetail && selectedGame && (
                <div className="modal active" onClick={() => setShowGameDetail(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h2>{selectedGame.title}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowGameDetail(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.gameDetailContent}>
                            <div className={styles.detailRow}>
                                <strong>Price:</strong>
                                <span>${selectedGame.price.toFixed(2)}</span>
                            </div>

                            <div className={styles.detailRow}>
                                <strong>Company:</strong>
                                <span>{selectedGame.company || 'N/A'}</span>
                            </div>

                            <div className={styles.detailRow}>
                                <strong>Genre:</strong>
                                <span>{selectedGame.genre || 'N/A'}</span>
                            </div>
                            <div className={styles.detailSection}>
                                <strong>Description:</strong>
                                <p>{selectedGame.description}</p>
                            </div>

                            {selectedGame.tags && selectedGame.tags.length > 0 && (
                                <div className={styles.detailSection}>
                                    <strong>Tags:</strong>
                                    <div className={styles.tagList}>
                                        {selectedGame.tags.map((tag, index) => (
                                            <span key={index} className={styles.tag}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {selectedGame.platforms && selectedGame.platforms.length > 0 && (
                                <div className={styles.detailSection}>
                                    <strong>Platforms:</strong>
                                    <div className={styles.platformList}>
                                        {selectedGame.platforms.map((platform, index) => (
                                            <span key={index} className={styles.platform}>
                                                {platform}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="button-group">
                                <button
                                    className="btn-primary"
                                    disabled={isGameInCart(selectedGame.id)}
                                    onClick={() => {
                                        handleAddToCart(selectedGame);
                                        setShowGameDetail(false);
                                    }}
                                    style={{
                                        opacity: isGameInCart(selectedGame.id) ? 0.5 : 1,
                                        cursor: isGameInCart(selectedGame.id) ? 'not-allowed' : 'pointer',
                                    }}
                                >
                                    {isGameInCart(selectedGame.id) ? 'In Cart' : 'Add to Cart'}
                                </button>
                                {isAdmin && (
                                    <>
                                        <button
                                            className="btn-warning"
                                            onClick={() => handleEditGame(selectedGame)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn-danger"
                                            onClick={handleDeleteGame}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowGameDetail(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Modal */}
            {showCart && (
                <div className="modal active" onClick={() => setShowCart(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '600px' }}
                    >
                        <div className="modal-header">
                            <h2>Shopping Cart</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowCart(false)}
                            >
                                ×
                            </button>
                        </div>

                        {totalCartCount === 0 ? (
                            <p className="text-center">Your cart is empty</p>
                        ) : (
                            <>
                                <div className={styles.cartItems}>
                                    {cart.map((item) => (
                                        <div key={item.gameId} className={styles.cartItem}>
                                            <div className={styles.cartItemInfo}>
                                                <h4>{item.game.title}</h4>
                                                <p>
                                                    ${item.game.price.toFixed(2)} x {item.quantity}
                                                </p>
                                            </div>
                                            <div className={styles.cartItemTotal}>
                                                ${(item.game.price * item.quantity).toFixed(2)}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className={styles.cartSummary}>
                                    <h3>
                                        Total: $
                                        {cart
                                            .reduce(
                                                (total, item) =>
                                                    total + item.game.price * item.quantity,
                                                0
                                            )
                                            .toFixed(2)}
                                    </h3>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="shippingAddress">Shipping Address</label>
                                    <textarea
                                        id="shippingAddress"
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Enter your shipping address"
                                        rows={3}
                                    />
                                </div>

                                <div className="button-group">
                                    <button
                                        className="btn-success"
                                        onClick={handleMakeOrder}
                                        disabled={orderLoading}
                                    >
                                        {orderLoading ? 'Processing...' : 'Make Order'}
                                    </button>
                                    <button
                                        className="btn-danger"
                                        onClick={() => {
                                            clearCart();
                                            setShippingAddress('');
                                        }}
                                        disabled={orderLoading}
                                    >
                                        Clear Cart
                                    </button>
                                    <button
                                        className="btn-secondary"
                                        onClick={() => setShowCart(false)}
                                        disabled={orderLoading}
                                    >
                                        Continue Shopping
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && editData && (
                <div className="modal active" onClick={() => setShowEditModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
                    >
                        <div className="modal-header">
                            <h2>Edit Game</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowEditModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        {editError && <div className="error" style={{ margin: '20px 20px 0 20px' }}>{editError}</div>}

                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                            <div className="form-group">
                                <label htmlFor="editTitle">Title</label>
                                <input
                                    id="editTitle"
                                    type="text"
                                    value={editData.title}
                                    onChange={(e) =>
                                        setEditData({ ...editData, title: e.target.value })
                                    }
                                    disabled={editLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editPrice">Price</label>
                                <input
                                    id="editPrice"
                                    type="number"
                                    step="0.01"
                                    value={isNaN(editData.price) ? '' : editData.price}
                                    onChange={(e) =>
                                        setEditData({
                                            ...editData,
                                            price: e.target.value === '' ? 0 : parseFloat(e.target.value),
                                        })
                                    }
                                    disabled={editLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editDescription">Description</label>
                                <textarea
                                    id="editDescription"
                                    value={editData.description}
                                    onChange={(e) =>
                                        setEditData({ ...editData, description: e.target.value })
                                    }
                                    disabled={editLoading}
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="editCompany">Company</label>
                                <select
                                    id="editCompany"
                                    value={editData.company}
                                    onChange={(e) =>
                                        setEditData({ ...editData, company: e.target.value })
                                    }
                                    disabled={editLoading}
                                >
                                    <option value="">Select Company</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.name}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="editGenre">Genre</label>
                                <select
                                    id="editGenre"
                                    value={editData.genre}
                                    onChange={(e) =>
                                        setEditData({ ...editData, genre: e.target.value })
                                    }
                                    disabled={editLoading}
                                >
                                    <option value="">Select Genre</option>
                                    {genres.map((genre) => (
                                        <option key={genre.id} value={genre.name}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Tags</label>
                                <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {tags.map((tag) => (
                                        <div key={tag.id} style={{ marginBottom: '8px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={editData.tags.includes(tag.name)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setEditData({
                                                                ...editData,
                                                                tags: [...editData.tags, tag.name],
                                                            });
                                                        } else {
                                                            setEditData({
                                                                ...editData,
                                                                tags: editData.tags.filter(
                                                                    (t: string) => t !== tag.name
                                                                ),
                                                            });
                                                        }
                                                    }}
                                                    disabled={editLoading}
                                                />
                                                {tag.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Platforms</label>
                                <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {platforms.map((platform) => (
                                        <div key={platform.id} style={{ marginBottom: '8px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={editData.platforms.includes(
                                                        platform.name
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setEditData({
                                                                ...editData,
                                                                platforms: [
                                                                    ...editData.platforms,
                                                                    platform.name,
                                                                ],
                                                            });
                                                        } else {
                                                            setEditData({
                                                                ...editData,
                                                                platforms: editData.platforms.filter(
                                                                    (p: string) =>
                                                                        p !== platform.name
                                                                ),
                                                            });
                                                        }
                                                    }}
                                                    disabled={editLoading}
                                                />
                                                {platform.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="button-group" style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                            <button
                                className="btn-success"
                                onClick={handleSaveEdit}
                                disabled={editLoading}
                            >
                                {editLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowEditModal(false)}
                                disabled={editLoading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Game Modal */}
            {showAddModal && (
                <div className="modal active" onClick={() => setShowAddModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
                    >
                        <div className="modal-header">
                            <h2>Add New Game</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowAddModal(false)}
                            >
                                ×
                            </button>
                        </div>

                        {addError && <div className="error" style={{ margin: '20px 20px 0 20px' }}>{addError}</div>}

                        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
                            <div className="form-group">
                                <label htmlFor="addTitle">Title *</label>
                                <input
                                    id="addTitle"
                                    type="text"
                                    value={addData.title}
                                    onChange={(e) =>
                                        setAddData({ ...addData, title: e.target.value })
                                    }
                                    disabled={addLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="addPrice">Price</label>
                                <input
                                    id="addPrice"
                                    type="number"
                                    step="0.01"
                                    value={isNaN(addData.price) ? '' : addData.price}
                                    onChange={(e) =>
                                        setAddData({
                                            ...addData,
                                            price: e.target.value === '' ? 0 : parseFloat(e.target.value),
                                        })
                                    }
                                    disabled={addLoading}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="addDescription">Description</label>
                                <textarea
                                    id="addDescription"
                                    value={addData.description}
                                    onChange={(e) =>
                                        setAddData({ ...addData, description: e.target.value })
                                    }
                                    disabled={addLoading}
                                    rows={3}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="addCompany">Company *</label>
                                <select
                                    id="addCompany"
                                    value={addData.company}
                                    onChange={(e) =>
                                        setAddData({ ...addData, company: e.target.value })
                                    }
                                    disabled={addLoading}
                                >
                                    <option value="">Select Company</option>
                                    {companies.map((company) => (
                                        <option key={company.id} value={company.name}>
                                            {company.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="addGenre">Genre *</label>
                                <select
                                    id="addGenre"
                                    value={addData.genre}
                                    onChange={(e) =>
                                        setAddData({ ...addData, genre: e.target.value })
                                    }
                                    disabled={addLoading}
                                >
                                    <option value="">Select Genre</option>
                                    {genres.map((genre) => (
                                        <option key={genre.id} value={genre.name}>
                                            {genre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Tags *</label>
                                <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {tags.map((tag) => (
                                        <div key={tag.id} style={{ marginBottom: '8px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={addData.tags.includes(tag.name)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setAddData({
                                                                ...addData,
                                                                tags: [...addData.tags, tag.name],
                                                            });
                                                        } else {
                                                            setAddData({
                                                                ...addData,
                                                                tags: addData.tags.filter(t => t !== tag.name),
                                                            });
                                                        }
                                                    }}
                                                    disabled={addLoading}
                                                />
                                                {tag.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Platforms *</label>
                                <div style={{ border: '1px solid var(--border-color)', padding: '10px', borderRadius: '4px', maxHeight: '150px', overflowY: 'auto' }}>
                                    {platforms.map((platform) => (
                                        <div key={platform.id} style={{ marginBottom: '8px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={addData.platforms.includes(platform.name)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setAddData({
                                                                ...addData,
                                                                platforms: [...addData.platforms, platform.name],
                                                            });
                                                        } else {
                                                            setAddData({
                                                                ...addData,
                                                                platforms: addData.platforms.filter(p => p !== platform.name),
                                                            });
                                                        }
                                                    }}
                                                    disabled={addLoading}
                                                />
                                                {platform.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="button-group" style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
                            <button
                                className="btn-success"
                                onClick={handleSaveAdd}
                                disabled={addLoading}
                            >
                                {addLoading ? 'Creating...' : 'Create Game'}
                            </button>
                            <button
                                className="btn-secondary"
                                onClick={() => setShowAddModal(false)}
                                disabled={addLoading}
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
