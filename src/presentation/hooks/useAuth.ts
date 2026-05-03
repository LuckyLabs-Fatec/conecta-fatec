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

const saveAuthSession = (accessToken: string, user: AppUser) => {
    writeAuthCookie({ accessToken, user });
    return user;
};

const buildUserFromProfile = (profile: {
    uid: string;
    email: string;
    nome: string;
    telefone?: string;
    telefone_is_whats?: boolean;
    perfil: UserRole;
    avatar?: string;
}): AppUser => ({
    id: profile.uid,
    email: profile.email,
    role: profile.perfil,
    user_metadata: {
        name: profile.nome,
        avatar: profile.avatar,
        role: profile.perfil,
        phone: profile.telefone,
        phone_is_whats: profile.telefone_is_whats,
    },
});

const ROLE_LEVELS: Record<UserRole, number> = {
    admin: 4,
    coordenador: 3,
    mediador: 2,
    estudante: 1,
    comunidade: 0,
};

// Mapear roles da API (em maiúsculas) para roles da aplicação (em minúsculas)
const mapApiRoleToAppRole = (apiRole: string): UserRole => {
    const roleMap: Record<string, UserRole> = {
        'ADMIN': 'admin',
        'COORDINATOR': 'coordenador',
        'COORDENADOR': 'coordenador',
        'MEDIATOR': 'mediador',
        'MEDIADOR': 'mediador',
        'STUDENT': 'estudante',
        'ESTUDANTE': 'estudante',
        'SOCIETY': 'comunidade',
        'COMUNIDADE': 'comunidade',
        'COMMUNITY': 'comunidade',
    };
    
    return roleMap[apiRole.toUpperCase()] || 'comunidade';
};

export const useAuth = () => {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const session = readAuthCookie();

            if (session?.user) {
                setUser(session.user);
            } else if (session) {
                clearAuthCookie();
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
            role: string;
        };

        const fallbackName = credentials.email.split('@')[0];
        const mappedRole = mapApiRoleToAppRole(data.role);

        const sessionUser: AppUser = {
            id: crypto.randomUUID(),
            email: credentials.email,
            role: mappedRole,
            user_metadata: {
                name: fallbackName,
                role: mappedRole,
            },
        };

        setUser(saveAuthSession(data.accessToken, sessionUser));
        return sessionUser;
    };

    const signup = async (credentials: RegisterSchema) => {
        const { name, email, phone } = credentials;
        const uid = crypto.randomUUID();

        const res = await http.post('/user-profile', {
            name,
            email,
            phone,
            role: 'comunidade',
            uid,
        });

        const profile = (res.data?.data ?? res.data) as {
            uid: string;
            email: string;
            nome: string;
            telefone?: string;
            telefone_is_whats?: boolean;
            perfil: UserRole;
            avatar?: string;
        };

        const user = buildUserFromProfile(profile);
        setUser(saveAuthSession(crypto.randomUUID(), user));
        return user;
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
