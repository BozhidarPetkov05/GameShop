import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { userClaims, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const menuItems = [
        { id: 'games', path: '/games', label: 'Games', admin: false },
        { id: 'orders', path: '/orders', label: 'Orders', admin: false },
        { id: 'platforms', path: '/platforms', label: 'Platforms', admin: false },
        { id: 'genres', path: '/genres', label: 'Genres', admin: false },
        { id: 'companies', path: '/companies', label: 'Companies', admin: false },
        { id: 'tags', path: '/tags', label: 'Tags', admin: false },
        { id: 'users', path: '/users', label: 'Users', admin: true },
        { id: 'statuses', path: '/statuses', label: 'Statuses', admin: true },
        { id: 'profile', path: '/profile', label: 'Profile', admin: false },
    ];

    const visibleItems = menuItems.filter((item) => !item.admin || isAdmin);

    const handleNavigate = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    return (
        <div className={styles.layoutContainer}>
            <nav className={styles.navbar}>
                <div className={styles.navContent}>
                    <div className={styles.logo}>
                        <h1>GameShop</h1>
                    </div>

                    <button
                        className={styles.menuToggle}
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        ☰
                    </button>

                    <ul className={`${styles.navMenu} ${mobileMenuOpen ? styles.active : ''}`}>
                        {visibleItems.map((item) => (
                            <li key={item.id}>
                                <button
                                    className={`${styles.navLink} ${location.pathname === item.path ? styles.active : ''}`}
                                    onClick={() => handleNavigate(item.path)}
                                >
                                    {item.label}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className={styles.userMenu}>
                        <span className={styles.username}>{userClaims?.username}</span>
                        <button className={styles.logoutBtn} onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main className={styles.mainContent}>{children}</main>
        </div>
    );
};
