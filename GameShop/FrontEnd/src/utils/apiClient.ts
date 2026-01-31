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
        } else {
            console.warn('No token found for authenticated request to', endpoint);
        }
    }

    console.log('API Request:', endpoint, 'Headers:', headers, 'Options:', fetchOptions);

    const response = await fetch(`http://localhost:5001${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.text().catch(() => 'Unknown error');
        console.error(`API Error: ${response.status}`, error);
        throw new Error(`API Error: ${response.status} - ${error}`);
    }

    if (response.status === 204) {
        return null as T;
    }

    return response.json();
};
