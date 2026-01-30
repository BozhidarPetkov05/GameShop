import { apiCall } from '../utils/apiClient';
import { OrderResponse, OrderRequest, OrderEditRequest } from '../entities';

export const orderService = {
    getAllOrders: async (): Promise<OrderResponse[]> => {
        return apiCall<OrderResponse[]>('/api/Orders', { method: 'GET' });
    },

    getOrderById: async (id: number): Promise<OrderResponse> => {
        return apiCall<OrderResponse>(`/api/Orders/${id}`, { method: 'GET' });
    },

    createOrder: async (data: OrderRequest): Promise<OrderResponse> => {
        return apiCall<OrderResponse>('/api/Orders', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateOrder: async (id: number, data: OrderEditRequest): Promise<OrderResponse> => {
        return apiCall<OrderResponse>(`/api/Orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteOrder: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Orders/${id}`, { method: 'DELETE' });
    },
};
