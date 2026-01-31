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

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;

        const decoded = JSON.parse(atob(parts[1]));
        const exp = decoded.exp;

        if (!exp) return false; // No expiration claim, assume valid

        const currentTime = Math.floor(Date.now() / 1000);
        return exp < currentTime;
    } catch (error) {
        console.error('Error checking token expiration:', error);
        return true;
    }
};

// Save token to localStorage
export const saveToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

// Get token from localStorage (returns null if expired)
export const getToken = (): string | null => {
    const token = localStorage.getItem('authToken');
    if (token && isTokenExpired(token)) {
        removeToken();
        return null;
    }
    return token;
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
