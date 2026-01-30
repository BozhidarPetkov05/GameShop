import { apiCall } from '../utils/apiClient';
import { GenreResponse, GenreRequest } from '../entities';

export const genreService = {
    getAllGenres: async (): Promise<GenreResponse[]> => {
        return apiCall<GenreResponse[]>('/api/Genres', { method: 'GET' });
    },

    getGenreById: async (id: number): Promise<GenreResponse> => {
        return apiCall<GenreResponse>(`/api/Genres/${id}`, { method: 'GET' });
    },

    createGenre: async (data: GenreRequest): Promise<GenreResponse> => {
        return apiCall<GenreResponse>('/api/Genres', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateGenre: async (id: number, data: Partial<GenreRequest>): Promise<GenreResponse> => {
        return apiCall<GenreResponse>(`/api/Genres/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteGenre: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Genres/${id}`, { method: 'DELETE' });
    },
};
