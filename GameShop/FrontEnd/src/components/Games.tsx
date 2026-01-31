import React, { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import { orderService } from '../services/orderService';
import { GameResponse, OrderRequest } from '../entities';
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
    const [orderLoading, setOrderLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const { cart, clearCart, addToCart } = useCart();
    const { isAdmin } = useAuth();
    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    useEffect(() => {
        loadGames();
    }, []);

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
        if (!window.confirm(`Are you sure you want to delete "${selectedGame.title}"?`)) {
            return;
        }
        try {
            await gameService.deleteGame(selectedGame.id);
            setShowGameDetail(false);
            setSelectedGame(null);
            loadGames();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete game');
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
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart(game);
                            }}
                        >
                            Add to Cart
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
                                    onClick={() => {
                                        handleAddToCart(selectedGame);
                                        setShowGameDetail(false);
                                    }}
                                >
                                    Add to Cart
                                </button>
                                {isAdmin && (
                                    <>
                                        <button
                                            className="btn-warning"
                                            onClick={() => {
                                                alert('Edit feature coming soon!');
                                            }}
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
        </div>
    );
};
