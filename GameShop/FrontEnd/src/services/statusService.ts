import { apiCall } from '../utils/apiClient';
import { StatusResponse, StatusRequest } from '../entities';

export const statusService = {
    getAllStatuses: async (): Promise<StatusResponse[]> => {
        return apiCall<StatusResponse[]>('/api/Statuses', { method: 'GET' });
    },

    getStatusById: async (id: number): Promise<StatusResponse> => {
        return apiCall<StatusResponse>(`/api/Statuses/${id}`, { method: 'GET' });
    },

    createStatus: async (data: StatusRequest): Promise<StatusResponse> => {
        return apiCall<StatusResponse>('/api/Statuses', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateStatus: async (id: number, data: Partial<StatusRequest>): Promise<StatusResponse> => {
        return apiCall<StatusResponse>(`/api/Statuses/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteStatus: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Statuses/${id}`, { method: 'DELETE' });
    },
};
