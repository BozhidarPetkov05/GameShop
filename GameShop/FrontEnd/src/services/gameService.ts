import { apiCall } from '../utils/apiClient';
import { GameResponse, GameRequest } from '../entities';

export const gameService = {
    getAllGames: async (): Promise<GameResponse[]> => {
        return apiCall<GameResponse[]>('/api/Games', { method: 'GET' });
    },

    getGameById: async (id: number): Promise<GameResponse> => {
        return apiCall<GameResponse>(`/api/Games/${id}`, { method: 'GET' });
    },

    createGame: async (data: GameRequest): Promise<GameResponse> => {
        return apiCall<GameResponse>('/api/Games', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateGame: async (id: number, data: Partial<GameRequest>): Promise<GameResponse> => {
        return apiCall<GameResponse>(`/api/Games/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteGame: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Games/${id}`, { method: 'DELETE' });
    },
};
