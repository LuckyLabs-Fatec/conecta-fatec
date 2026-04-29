'use client';
import { useState, useEffect, useCallback } from 'react';
import { LoginSchema } from '@/domain/auth/schemas/login.schema';
import { RegisterSchema } from '@/domain/auth/schemas/register.schema';

export type UserRole = 'comunidade' | 'mediador' | 'coordenador' | 'estudante' | 'admin';

interface AppUser {
    id: string;
    email?: string;
    role: UserRole;
    department?: string;
    specialization?: string;
    user_metadata: {
        name?: string;
        avatar?: string;
        role?: UserRole;
        phone?: string;
        phone_is_whats?: boolean;
    }
}

const AUTH_STORAGE_KEY = 'conecta-fatec-mock-user';

const createMockUser = (email: string, role: UserRole = 'comunidade', name?: string, phone?: string): AppUser => ({
    id: crypto.randomUUID(),
    email,
    role,
    user_metadata: {
        name: name || email.split('@')[0],
        role,
        phone,
        phone_is_whats: false,
    },
});

const getRoleFromEmail = (email: string): UserRole => {
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail.includes('admin')) return 'admin';
    if (normalizedEmail.includes('coordenador')) return 'coordenador';
    if (normalizedEmail.includes('mediador')) return 'mediador';
    if (normalizedEmail.includes('estudante')) return 'estudante';

    return 'comunidade';
};

const saveMockUser = (mockUser: AppUser) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockUser));
    return mockUser;
};

const syncMockProfile = async (mockUser: AppUser, phone?: string) => {
    const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: mockUser.user_metadata.name || mockUser.email,
            email: mockUser.email,
            phone,
            role: mockUser.user_metadata.role || 'comunidade',
            uid: mockUser.id,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error creating user profile:', errorData);
        throw new Error(errorData.error || 'Failed to create user profile');
    }

    const { data } = await response.json();

    return {
        ...mockUser,
        id: data.uid,
        role: data.perfil,
        user_metadata: {
            ...mockUser.user_metadata,
            name: data.nome,
            role: data.perfil,
            phone: data.telefone,
            phone_is_whats: data.telefone_is_whats,
        },
    } as AppUser;
};

const ROLE_LEVELS: Record<UserRole, number> = {
    'admin': 4,
    'coordenador': 3,
    'mediador': 2,
    'estudante': 1,
    'comunidade': 0
};

export const useAuth = () => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

        if (storedUser) {
            setUser(JSON.parse(storedUser) as AppUser);
        }

        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginSchema) => {
        const syncedUser = await syncMockProfile(createMockUser(
            credentials.email,
            getRoleFromEmail(credentials.email),
        ));

        setUser(saveMockUser(syncedUser));
    };

    const signup = async (credentials: RegisterSchema) => {
        const { name, email, phone } = credentials;
        const role = 'comunidade';
        const mockUser = createMockUser(email, role, name, phone);
        const uid = mockUser.id;

        try {
            const syncedUser = await syncMockProfile({ ...mockUser, id: uid }, phone);
            setUser(saveMockUser(syncedUser));
        } catch (profileError: unknown) {
            const err = profileError as Error;
            console.error('Network or unexpected error when creating user profile:', err);
            throw new Error(err.message || 'Failed to create user profile');
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setUser(null);
        }
    };



    const hasPermission = useCallback((requiredRole: UserRole) => {
        if (!user) return false;

        const userRole = (user.user_metadata.role as string)?.toLowerCase() as UserRole;

        if (!userRole || !ROLE_LEVELS.hasOwnProperty(userRole)) return false;

        const userLevel = ROLE_LEVELS[userRole];
        const requiredLevel = ROLE_LEVELS[requiredRole];

        return userLevel >= requiredLevel;
    }, [user]);

    const canAccessIdeaValidation = () => {
        return hasPermission('mediador');
    };

    const canAssignToClasses = () => {
        return hasPermission('coordenador');
    };

    const canSuggestIdeas = () => {
        return hasPermission('comunidade');
    };

    return {
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        hasPermission,
        canAccessIdeaValidation,
        canAssignToClasses,
        canSuggestIdeas
    };
};
