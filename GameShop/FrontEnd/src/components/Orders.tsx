import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { statusService } from '../services/statusService';
import { OrderResponse, StatusResponse, OrderEditRequest } from '../entities';
import { useAuth } from '../context/AuthContext';
import styles from './Orders.module.css';

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
    const { userClaims, isAdmin } = useAuth();

    useEffect(() => {
        loadOrders();
        loadStatuses();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await orderService.getAllOrders();
            // Filter orders for non-admin users
            const filteredOrders = isAdmin
                ? data
                : data.filter((o) => o.userId === userClaims?.loggedUserId);
            setOrders(filteredOrders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const loadStatuses = async () => {
        try {
            const data = await statusService.getAllStatuses();
            setStatuses(data);
        } catch (err) {
            console.error('Failed to load statuses:', err);
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
            const updateData: OrderEditRequest = {
                shippingAddress: editFormData.shippingAddress,
            };

            if (isAdmin && editFormData.statusId) {
                updateData.statusId = editFormData.statusId;
            }

            await orderService.updateOrder(selectedOrder.id, updateData);
            alert('Order updated successfully!');
            setShowDetail(false);
            loadOrders();
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Failed to update order');
        }
    };

    const handleDelete = async () => {
        if (!selectedOrder) return;
        if (!window.confirm('Are you sure?')) return;

        try {
            await orderService.deleteOrder(selectedOrder.id);
            alert('Order deleted successfully!');
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
                                <th>Date</th>
                                <th>Status</th>
                                <th>Shipping Address</th>
                                <th>Items</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>#{order.id}</td>
                                    <td>{new Date(order.createdDate).toLocaleDateString()}</td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: `${getStatusColor(
                                                    order.status?.name || ''
                                                )}20`,
                                                color: getStatusColor(order.status?.name || ''),
                                            }}
                                        >
                                            {order.status?.name || 'N/A'}
                                        </span>
                                    </td>
                                    <td>{order.shippingAddress}</td>
                                    <td>{order.games?.length || 0}</td>
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
                                        <strong>Date:</strong>
                                        <span>
                                            {new Date(selectedOrder.createdDate).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className={styles.row}>
                                        <strong>Status:</strong>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: `${getStatusColor(
                                                    selectedOrder.status?.name || ''
                                                )}20`,
                                                color: getStatusColor(
                                                    selectedOrder.status?.name || ''
                                                ),
                                            }}
                                        >
                                            {selectedOrder.status?.name || 'N/A'}
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
                                                {selectedOrder.games.map((orderGame) => (
                                                    <div key={orderGame.id} className={styles.gameItem}>
                                                        <span className={styles.gameName}>
                                                            {orderGame.game?.name || 'N/A'}
                                                        </span>
                                                        <span className={styles.gameQuantity}>
                                                            x{orderGame.quantity}
                                                        </span>
                                                        {orderGame.game && (
                                                            <span className={styles.gamePrice}>
                                                                ${(
                                                                    orderGame.game.price * orderGame.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
