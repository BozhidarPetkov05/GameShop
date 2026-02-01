import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { statusService } from '../services/statusService';
import { OrderResponse, StatusResponse, OrderRequest } from '../entities';
import { useAuth } from '../context/AuthContext';
import styles from './Orders.module.css';

// Module-level cache for statuses
let statusesCache: StatusResponse[] = [];
let statusesCacheLoading = false;

export const Orders: React.FC = () => {
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDetail, setShowDetail] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [statuses, setStatuses] = useState<StatusResponse[]>([]);
    const [editFormData, setEditFormData] = useState({
        shippingAddress: '',
        statusId: 0,
    });
    const { isAdmin } = useAuth();

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        // Only load statuses when editing and user is admin
        if (isEditing && isAdmin && statusesCache.length === 0 && !statusesCacheLoading) {
            loadStatuses();
        } else if (isEditing && isAdmin && statusesCache.length > 0) {
            setStatuses(statusesCache);
        }
    }, [isEditing, isAdmin]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await orderService.getAllOrders();
            // Backend already filters orders by userId for non-admins
            setOrders(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const loadStatuses = async () => {
        if (statusesCacheLoading) return;

        try {
            statusesCacheLoading = true;
            const data = await statusService.getAllStatuses();
            statusesCache = data;
            setStatuses(data);
        } catch (err) {
            console.error('Failed to load statuses:', err);
        } finally {
            statusesCacheLoading = false;
        }
    };

    const getStatusColor = (statusName: string): string => {
        switch (statusName?.toLowerCase()) {
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

    const handleOrderClick = async (order: OrderResponse) => {
        try {
            const data = await orderService.getOrderById(order.id);
            setSelectedOrder(data);
            setEditFormData({
                shippingAddress: data.shippingAddress,
                statusId: data.statusId,
            });
            setIsEditing(false);
            setShowDetail(true);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to load order details');
        }
    };

    const handleSave = async () => {
        if (!selectedOrder) return;

        try {
            // Send OrderRequest format with games from current order
            const updateData: OrderRequest = {
                shippingAddress: editFormData.shippingAddress,
                games: (selectedOrder.games || []).filter((g) => typeof g === 'string') as string[],
            };

            // If admin and status changed, include the status
            if (isAdmin && editFormData.statusId && editFormData.statusId !== selectedOrder.statusId) {
                const selectedStatus = statuses.find((s) => s.id === editFormData.statusId);
                if (selectedStatus) {
                    updateData.status = selectedStatus.name;
                }
            }

            await orderService.updateOrder(selectedOrder.id, updateData);
            setShowDetail(false);
            loadOrders();
        } catch (err) {
            console.error('Update error:', err);
            alert(err instanceof Error ? err.message : 'Failed to update order');
        }
    };

    const handleDelete = async () => {
        if (!selectedOrder) return;

        try {
            await orderService.deleteOrder(selectedOrder.id);
            setShowDetail(false);
            loadOrders();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to delete order');
        }
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner"></div>
                <p>Loading orders...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1>Orders</h1>

            {error && <div className="error">{error}</div>}

            {orders.length === 0 ? (
                <div className="text-center" style={{ padding: '40px' }}>
                    <p>No orders found</p>
                </div>
            ) : (
                <div className={styles.ordersTable}>
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User ID</th>
                                <th>Status</th>
                                <th>Shipping Address</th>
                                <th>Items</th>
                                <th>Total Price</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{order.userId}</td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: `${getStatusColor(order.status || '')}20`,
                                                color: getStatusColor(order.status || ''),
                                            }}
                                        >
                                            {order.status || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{order.shippingAddress}</td>
                                    <td>{order.games?.length || 0}</td>
                                    <td>${(order.totalPrice ?? 0).toFixed(2)}</td>
                                    <td>
                                        <button
                                            className="btn-primary"
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                            onClick={() => handleOrderClick(order)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Order Detail Modal */}
            {showDetail && selectedOrder && (
                <div className="modal active" onClick={() => setShowDetail(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{ maxWidth: '700px' }}
                    >
                        <div className="modal-header">
                            <h2>Order #{selectedOrder.id}</h2>
                            <button
                                className="close-btn"
                                onClick={() => setShowDetail(false)}
                            >
                                ×
                            </button>
                        </div>

                        {!isEditing ? (
                            <>
                                <div className={styles.orderDetail}>
                                    <div className={styles.row}>
                                        <strong>Order ID:</strong>
                                        <span>{selectedOrder.id}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <strong>User ID:</strong>
                                        <span>{selectedOrder.userId}</span>
                                    </div>
                                    <div className={styles.row}>
                                        <strong>Status:</strong>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: `${getStatusColor(selectedOrder.status || '')}20`,
                                                color: getStatusColor(selectedOrder.status || ''),
                                            }}
                                        >
                                            {selectedOrder.status || 'N/A'}
                                        </span>
                                    </div>
                                    <div className={styles.section}>
                                        <strong>Shipping Address:</strong>
                                        <p>{selectedOrder.shippingAddress}</p>
                                    </div>

                                    {selectedOrder.games && selectedOrder.games.length > 0 && (
                                        <div className={styles.section}>
                                            <strong>Games:</strong>
                                            <div className={styles.gamesList}>
                                                {selectedOrder.games.map((game, index) => {
                                                    const gameObj = typeof game === 'string' ? null : game;
                                                    const gameName = typeof game === 'string' ? game : gameObj?.game?.title || 'N/A';
                                                    const quantity = gameObj?.quantity || 1;
                                                    const price = gameObj?.game?.price || 0;

                                                    return (
                                                        <div key={`game-${index}`} className={styles.gameItem}>
                                                            <span className={styles.gameName}>
                                                                {gameName}
                                                            </span>
                                                            <span className={styles.gameQuantity}>
                                                                x{quantity}
                                                            </span>
                                                            {price > 0 && (
                                                                <span className={styles.gamePrice}>
                                                                    ${(price * quantity).toFixed(2)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    <div className={styles.row}>
                                        <strong>Total Price:</strong>
                                        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0066cc' }}>
                                            ${(selectedOrder.totalPrice ?? 0).toFixed(2)}
                                        </span>
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
                                        className="btn-danger"
                                        onClick={handleDelete}
                                    >
                                        Delete
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
                                        <label htmlFor="shippingAddress">Shipping Address</label>
                                        <textarea
                                            id="shippingAddress"
                                            value={editFormData.shippingAddress}
                                            onChange={(e) =>
                                                setEditFormData((prev) => ({
                                                    ...prev,
                                                    shippingAddress: e.target.value,
                                                }))
                                            }
                                            rows={3}
                                        />
                                    </div>

                                    {isAdmin && (
                                        <div className="form-group">
                                            <label htmlFor="statusId">Status</label>
                                            <select
                                                id="statusId"
                                                value={editFormData.statusId}
                                                onChange={(e) =>
                                                    setEditFormData((prev) => ({
                                                        ...prev,
                                                        statusId: parseInt(e.target.value),
                                                    }))
                                                }
                                            >
                                                <option value="0">-- Select Status --</option>
                                                {statuses.map((status) => (
                                                    <option key={status.id} value={status.id}>
                                                        {status.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className="button-group">
                                    <button
                                        className="btn-success"
                                        onClick={handleSave}
                                    >
                                        Save
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
