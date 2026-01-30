import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

interface LayoutProps {
    children: React.ReactNode;
    currentPage: string;
    onNavigate: (page: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
    const { userClaims, logout, isAdmin } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
    };

    const menuItems = [
        { id: 'games', label: 'Games', admin: false },
        { id: 'orders', label: 'Orders', admin: false },
        { id: 'platforms', label: 'Platforms', admin: false },
        { id: 'genres', label: 'Genres', admin: false },
        { id: 'companies', label: 'Companies', admin: false },
        { id: 'tags', label: 'Tags', admin: false },
        { id: 'users', label: 'Users', admin: true },
        { id: 'statuses', label: 'Statuses', admin: true },
        { id: 'profile', label: 'Profile', admin: false },
    ];

    const visibleItems = menuItems.filter((item) => !item.admin || isAdmin);

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
                                    className={`${styles.navLink} ${currentPage === item.id ? styles.active : ''}`}
                                    onClick={() => {
                                        onNavigate(item.id);
                                        setMobileMenuOpen(false);
                                    }}
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
