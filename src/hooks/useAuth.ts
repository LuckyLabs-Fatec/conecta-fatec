'use client';
import { useState, useEffect } from 'react';

export type UserRole = 'comunidade' | 'mediador' | 'coordenacao';

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    loginTime: string;
    role: UserRole;
    department?: string; // Para coordenação
    specialization?: string; // Para mediador
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

    const hasPermission = (requiredRole: UserRole | UserRole[]) => {
        if (!user) return false;
        
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        return roles.includes(user.role);
    };

    const canAccessIdeaValidation = () => {
        return hasPermission(['mediador', 'coordenacao']);
    };

    const canAssignToClasses = () => {
        return hasPermission('coordenacao');
    };

    const canSuggestIdeas = () => {
        return hasPermission('comunidade');
    };

    return {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        canAccessIdeaValidation,
        canAssignToClasses,
        canSuggestIdeas
    };
};
