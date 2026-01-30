import { getToken } from './tokenUtils';

interface FetchOptions extends RequestInit {
    skipAuth?: boolean;
}

export const apiCall = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> => {
    const { skipAuth = false, ...fetchOptions } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(typeof fetchOptions.headers === 'object' && fetchOptions.headers !== null
            ? (fetchOptions.headers as Record<string, string>)
            : {}),
    };

    if (!skipAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    const response = await fetch(`https://localhost:5000${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.text().catch(() => 'Unknown error');
        throw new Error(`API Error: ${response.status} - ${error}`);
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json();
};
