import React, { createContext, useContext, useState, useCallback } from 'react';
import { CartItem, GameResponse } from '../entities';

interface CartContextType {
    cart: CartItem[];
    addToCart: (game: GameResponse) => void;
    removeFromCart: (gameId: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = useCallback((game: GameResponse) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.gameId === game.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.gameId === game.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { gameId: game.id, game, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((gameId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.gameId !== gameId));
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const getCartTotal = useCallback(() => {
        return cart.reduce((total, item) => total + item.game.price * item.quantity, 0);
    }, [cart]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
