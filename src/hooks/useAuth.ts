'use client';
import { useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    loginTime: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on component mount
        const checkAuth = () => {
            try {
                const userData = localStorage.getItem('fatec-conecta-user');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                localStorage.removeItem('fatec-conecta-user');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = (userData: User) => {
        localStorage.setItem('fatec-conecta-user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('fatec-conecta-user');
        setUser(null);
    };

    return {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
    };
};
