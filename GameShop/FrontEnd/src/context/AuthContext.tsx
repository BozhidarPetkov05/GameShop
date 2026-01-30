import React, { createContext, useContext, useState, useCallback } from 'react';
import { TokenClaims } from '../entities';
import { getToken, removeToken, getCurrentUserClaims, decodeToken } from '../utils/tokenUtils';

interface AuthContextType {
    isAuthenticated: boolean;
    userClaims: TokenClaims | null;
    login: (token: string) => void;
    logout: () => void;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userClaims, setUserClaims] = useState<TokenClaims | null>(() => {
        if (getToken()) {
            return getCurrentUserClaims();
        }
        return null;
    });

    const login = useCallback((token: string) => {
        // Decode the token to get claims
        const claims = decodeToken(token);
        if (claims) {
            setUserClaims(claims);
        }
    }, []);

    const logout = useCallback(() => {
        removeToken();
        setUserClaims(null);
    }, []);

    const isAuthenticated = userClaims !== null;
    const isAdmin = userClaims?.isAdmin ?? false;

    return (
        <AuthContext.Provider value={{ isAuthenticated, userClaims, login, logout, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
