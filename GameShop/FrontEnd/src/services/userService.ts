import { apiCall } from '../utils/apiClient';
import { UserResponse, UserRequest } from '../entities';

export const userService = {
    getAllUsers: async (): Promise<UserResponse[]> => {
        return apiCall<UserResponse[]>('/api/Users', { method: 'GET' });
    },

    getUserById: async (id: number): Promise<UserResponse> => {
        return apiCall<UserResponse>(`/api/Users/${id}`, { method: 'GET' });
    },

    updateUser: async (id: number, data: Partial<UserRequest>): Promise<UserResponse> => {
        return apiCall<UserResponse>(`/api/Users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteUser: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Users/${id}`, { method: 'DELETE' });
    },
};
