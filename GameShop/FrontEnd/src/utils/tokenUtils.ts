import { TokenClaims } from '../entities';

// Decode JWT token to get claims
export const decodeToken = (token: string): TokenClaims | null => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        const decoded = JSON.parse(atob(parts[1]));
        return {
            loggedUserId: decoded.loggedUserId || decoded.sub,
            isAdmin: decoded.isAdmin === 'True' || decoded.isAdmin === true,
            username: decoded.username || decoded.unique_name,
        };
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

// Save token to localStorage
export const saveToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

// Get token from localStorage
export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

// Remove token from localStorage
export const removeToken = (): void => {
    localStorage.removeItem('authToken');
};

// Check if token exists and is valid
export const hasValidToken = (): boolean => {
    const token = getToken();
    if (!token) return false;
    const claims = decodeToken(token);
    return claims !== null;
};

// Get current user claims
export const getCurrentUserClaims = (): TokenClaims | null => {
    const token = getToken();
    if (!token) return null;
    return decodeToken(token);
};
