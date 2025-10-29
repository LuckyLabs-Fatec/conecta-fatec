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
                    const parsedUser = JSON.parse(userData);
                    setUser(parsedUser);
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

    const updateUser = (partial: Partial<User>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const next = { ...prev, ...partial } as User;
            localStorage.setItem('fatec-conecta-user', JSON.stringify(next));
            return next;
        });
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
        updateUser,
        isAuthenticated: !!user,
        hasPermission,
        canAccessIdeaValidation,
        canAssignToClasses,
        canSuggestIdeas
    };
};
