import { apiCall } from '../utils/apiClient';
import { CompanyResponse, CompanyRequest } from '../entities';

export const companyService = {
    getAllCompanies: async (): Promise<CompanyResponse[]> => {
        return apiCall<CompanyResponse[]>('/api/Companies', { method: 'GET' });
    },

    getCompanyById: async (id: number): Promise<CompanyResponse> => {
        return apiCall<CompanyResponse>(`/api/Companies/${id}`, { method: 'GET' });
    },

    createCompany: async (data: CompanyRequest): Promise<CompanyResponse> => {
        return apiCall<CompanyResponse>('/api/Companies', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    updateCompany: async (id: number, data: Partial<CompanyRequest>): Promise<CompanyResponse> => {
        return apiCall<CompanyResponse>(`/api/Companies/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    deleteCompany: async (id: number): Promise<void> => {
        return apiCall<void>(`/api/Companies/${id}`, { method: 'DELETE' });
    },
};
