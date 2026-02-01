import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Login } from './components/Login';
import { Layout } from './components/Layout';

// Lazy load all page components
const Games = lazy(() => import('./components/Games').then(m => ({ default: m.Games })));
const Orders = lazy(() => import('./components/Orders').then(m => ({ default: m.Orders })));
const Platforms = lazy(() => import('./components/Platforms').then(m => ({ default: m.Platforms })));
const Genres = lazy(() => import('./components/Genres').then(m => ({ default: m.Genres })));
const Companies = lazy(() => import('./components/Companies').then(m => ({ default: m.Companies })));
const Tags = lazy(() => import('./components/Tags').then(m => ({ default: m.Tags })));
const Statuses = lazy(() => import('./components/Statuses').then(m => ({ default: m.Statuses })));
const Users = lazy(() => import('./components/Users').then(m => ({ default: m.Users })));
const Profile = lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));

type Page = 'games' | 'orders' | 'platforms' | 'genres' | 'companies' | 'tags' | 'statuses' | 'users' | 'profile';

function App() {
    const { isAuthenticated, isAdmin } = useAuth();

    const LoadingFallback = () => (
        <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );

    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <Layout>
            <Suspense fallback={<LoadingFallback />}>
                <Routes>
                    <Route path="/" element={<Navigate to="/games" replace />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/platforms" element={<Platforms />} />
                    <Route path="/genres" element={<Genres />} />
                    <Route path="/companies" element={<Companies />} />
                    <Route path="/tags" element={<Tags />} />
                    <Route path="/profile" element={<Profile />} />
                    {isAdmin && <Route path="/users" element={<Users />} />}
                    {isAdmin && <Route path="/statuses" element={<Statuses />} />}
                    <Route path="*" element={<Navigate to="/games" replace />} />
                </Routes>
            </Suspense>
        </Layout>
    );
}

export default App;
