import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { AdminIcon } from './icons/AdminIcon';
import { UserIcon } from './icons/UserIcon';
import { HeartIcon } from './icons/HeartIcon';

interface HeaderProps {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        if (auth) {
            auth.logout();
            setIsDropdownOpen(false);
            navigate('/login');
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const UserMenu = () => (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex items-center justify-center text-white font-bold">
                    {auth?.user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-gray-800 dark:text-gray-200 hidden sm:block">{auth?.user?.name}</span>
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-20 border border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 border-b dark:border-gray-700">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{auth?.user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{auth?.user?.role}</p>
                    </div>
                    {!auth?.isAdmin && (
                        <Link to="/my-styles" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                           <HeartIcon isFilled={false}/> My Styles
                        </Link>
                    )}
                    {auth?.isAdmin && (
                        <Link to="/admin" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <AdminIcon /> Admin Panel
                        </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <LogoutIcon /> Logout
                    </button>
                </div>
            )}
        </div>
    );

    const AuthLinks = () => (
        <div className="flex items-center gap-2">
            <Link to="/login" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                Login
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-all shadow hover:shadow-md">
                Register
            </Link>
        </div>
    );

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700/50 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
                    AI Fashion Stylist
                </Link>
                <div className="flex items-center gap-4">
                    {auth?.isAuthenticated ? <UserMenu /> : <AuthLinks />}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </button>
                </div>
            </div>
        </header>
    );
};
