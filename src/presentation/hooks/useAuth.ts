'use client';
import { useState, useEffect, useCallback } from 'react';
import { LoginSchema } from '@/domain/auth/schemas/login.schema';
import { RegisterSchema } from '@/domain/auth/schemas/register.schema';
import {
    clearAuthCookie,
    readAuthCookie,
    writeAuthCookie,
    type AuthSessionUser,
    type UserRole,
} from '@/presentation/lib/auth-session';
import http from '@/presentation/lib/http';

export type { UserRole } from '@/presentation/lib/auth-session';

type AppUser = AuthSessionUser;

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

const saveAuthSession = (accessToken: string, user: AppUser) => {
    writeAuthCookie({ accessToken, user });
    return user;
};

const syncMockProfile = async (mockUser: AppUser, phone?: string) => {
    const res = await http.post('/user-profile', {
        name: mockUser.user_metadata.name || mockUser.email,
        email: mockUser.email,
        phone,
        role: mockUser.user_metadata.role || 'comunidade',
        uid: mockUser.id,
    });

    const { data } = res.data;

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
    admin: 4,
    coordenador: 3,
    mediador: 2,
    estudante: 1,
    comunidade: 0,
};

export const useAuth = () => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const session = readAuthCookie();

            if (session?.user) {
                setUser(session.user);
            }
        } catch (error) {
            console.error('Error reading auth cookie:', error);
            clearAuthCookie();
        }

        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginSchema) => {
        const res = await http.post('/auth/login', credentials);
        const data = res.data as {
            accessToken: string;
            role: UserRole;
            user: AppUser;
        };

        const sessionUser = {
            ...data.user,
            email: data.user.email || credentials.email,
            role: data.user.role || getRoleFromEmail(credentials.email),
            user_metadata: {
                ...data.user.user_metadata,
                name: data.user.user_metadata.name || credentials.email.split('@')[0],
                role: data.user.user_metadata.role || data.role,
            },
        } as AppUser;

        setUser(saveAuthSession(data.accessToken, sessionUser));
        return sessionUser;
    };

    const signup = async (credentials: RegisterSchema) => {
        const { name, email, phone } = credentials;
        const role = 'comunidade';
        const mockUser = createMockUser(email, role, name, phone);
        const uid = mockUser.id;

        try {
            const syncedUser = await syncMockProfile({ ...mockUser, id: uid }, phone);
            setUser(saveAuthSession(crypto.randomUUID(), syncedUser));
        } catch (profileError: unknown) {
            const err = profileError as Error;
            console.error('Network or unexpected error when creating user profile:', err);
            throw new Error(err.message || 'Failed to create user profile');
        }
    };

    const logout = async () => {
        try {
            clearAuthCookie();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setUser(null);
        }
    };

    const hasPermission = useCallback((requiredRole: UserRole) => {
        if (!user) return false;

        const userRole = (user.user_metadata.role as string)?.toLowerCase() as UserRole;

        if (!userRole || !Object.prototype.hasOwnProperty.call(ROLE_LEVELS, userRole)) return false;

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
        canSuggestIdeas,
    };
};
