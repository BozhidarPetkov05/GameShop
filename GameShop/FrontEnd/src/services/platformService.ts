import { apiCall } from '../utils/apiClient';
import { PlatformResponse, PlatformRequest } from '../entities';

export const platformService = {
    getAllPlatforms: async (): Promise<PlatformResponse[]> => {
        return apiCall<PlatformResponse[]>('/api/Platforms', { method: 'GET' });
    },

    getPlatformById: async (id: number): Promise<PlatformResponse> => {
        return apiCall<PlatformResponse>(`/api/Platforms/${id}`, { method: 'GET' });
    },

    createPlatform: async (data: PlatformRequest): Promise<PlatformResponse> => {
        return apiCall<PlatformResponse>('/api/Platforms', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updatePlatform: async (id: number, data: Partial<PlatformRequest>): Promise<PlatformResponse> => {
        return apiCall<PlatformResponse>(`/api/Platforms/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deletePlatform: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Platforms/${id}`, { method: 'DELETE' });
    },
};
