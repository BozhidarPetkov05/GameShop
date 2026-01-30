import { apiCall } from '../utils/apiClient';
import { TagResponse, TagRequest } from '../entities';

export const tagService = {
    getAllTags: async (): Promise<TagResponse[]> => {
        return apiCall<TagResponse[]>('/api/Tags', { method: 'GET' });
    },

    getTagById: async (id: number): Promise<TagResponse> => {
        return apiCall<TagResponse>(`/api/Tags/${id}`, { method: 'GET' });
    },

    createTag: async (data: TagRequest): Promise<TagResponse> => {
        return apiCall<TagResponse>('/api/Tags', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateTag: async (id: number, data: Partial<TagRequest>): Promise<TagResponse> => {
        return apiCall<TagResponse>(`/api/Tags/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteTag: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Tags/${id}`, { method: 'DELETE' });
    },
};
