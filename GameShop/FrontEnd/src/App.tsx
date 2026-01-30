import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Games } from './components/Games';
import { Orders } from './components/Orders';
import { Platforms } from './components/Platforms';
import { Genres } from './components/Genres';
import { Companies } from './components/Companies';
import { Tags } from './components/Tags';
import { Statuses } from './components/Statuses';
import { Users } from './components/Users';
import { Profile } from './components/Profile';

type Page = 'games' | 'orders' | 'platforms' | 'genres' | 'companies' | 'tags' | 'statuses' | 'users' | 'profile';

function App() {
    const { isAuthenticated } = useAuth();
    const [currentPage, setCurrentPage] = useState<Page>('games');

    useEffect(() => {
        // Reset to games when user logs out
        if (!isAuthenticated) {
            setCurrentPage('games');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return <Login />;
    }

    const renderPage = () => {
        switch (currentPage) {
            case 'games':
                return <Games />;
            case 'orders':
                return <Orders />;
            case 'platforms':
                return <Platforms />;
            case 'genres':
                return <Genres />;
            case 'companies':
                return <Companies />;
            case 'tags':
                return <Tags />;
            case 'statuses':
                return <Statuses />;
            case 'users':
                return <Users />;
            case 'profile':
                return <Profile />;
            default:
                return <Games />;
        }
    };

    return (
        <Layout currentPage={currentPage} onNavigate={(page) => setCurrentPage(page as Page)}>
            {renderPage()}
        </Layout>
    );
}

export default App;
