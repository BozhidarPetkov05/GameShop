import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { DataProvider } from './context/DataContext.tsx';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <AuthProvider>
            <DataProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </DataProvider>
        </AuthProvider>
    </BrowserRouter>,
);
