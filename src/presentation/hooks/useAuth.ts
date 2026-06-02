'use client';
import { useCallback, useSyncExternalStore } from 'react';
import { LoginSchema } from '@/domain/auth/schemas/login.schema';
import { RegisterSchema } from '@/domain/auth/schemas/register.schema';
import {
    clearAuthCookie,
    AUTH_SESSION_EXPIRED_EVENT,
    AUTH_COOKIE_KEY,
    writeAuthCookie,
    type AuthSessionUser,
    type UserRole,
} from '@/presentation/lib/auth-session';
import http from '@/presentation/lib/http';

export type { UserRole } from '@/presentation/lib/auth-session';

type AppUser = AuthSessionUser;

const AUTH_SESSION_CHANGED_EVENT = 'conecta-fatec-auth-session-changed';
let cachedAuthCookie: string | null = null;
let cachedAuthUser: AppUser | null = null;

const readRawAuthCookie = () => {
    if (typeof document === 'undefined') {
        return null;
    }

    return document.cookie
        .split('; ')
        .find((item) => item.startsWith(`${AUTH_COOKIE_KEY}=`)) ?? null;
};

const getAuthUserSnapshot = (): AppUser | null => {
    const rawCookie = readRawAuthCookie();

    if (rawCookie === cachedAuthCookie) {
        return cachedAuthUser;
    }

    cachedAuthCookie = rawCookie;

    if (!rawCookie) {
        cachedAuthUser = null;
        return cachedAuthUser;
    }

    const encodedValue = rawCookie.split('=').slice(1).join('=');

    try {
        const session = JSON.parse(decodeURIComponent(encodedValue)) as { user?: AppUser };
        cachedAuthUser = session.user ?? null;
    } catch {
        cachedAuthUser = null;
    }

    return cachedAuthUser;
};

const getServerAuthUserSnapshot = () => null;

const notifyAuthSessionChanged = () => {
    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
};

const subscribeToAuthSession = (onStoreChange: () => void) => {
    window.addEventListener(AUTH_SESSION_CHANGED_EVENT, onStoreChange);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, onStoreChange);

    return () => {
        window.removeEventListener(AUTH_SESSION_CHANGED_EVENT, onStoreChange);
        window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, onStoreChange);
    };
};

const saveAuthSession = (accessToken: string, user: AppUser) => {
    writeAuthCookie({ accessToken, user });
    cachedAuthCookie = null;
    cachedAuthUser = null;
    notifyAuthSessionChanged();
    return user;
};

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
    const user = useSyncExternalStore(
        subscribeToAuthSession,
        getAuthUserSnapshot,
        getServerAuthUserSnapshot,
    );
    const isLoading = false;

    const login = async (credentials: LoginSchema) => {
        const res = await http.post('/auth/login', credentials);
        const data = res.data as {
            accessToken: string;
            user?: {
                id?: string;
                email?: string;
                name?: string;
                avatar?: string | null;
                phone?: string;
                phoneIsWhats?: boolean;
                role?: string;
            };
        };

        const apiUser = data.user;
        const fallbackName = credentials.email.split('@')[0];
        const mappedRole = mapApiRoleToAppRole(apiUser?.role ?? 'SOCIETY');

        const sessionUser: AppUser = {
            id: apiUser?.id || crypto.randomUUID(),
            email: apiUser?.email || credentials.email,
            role: mappedRole,
            user_metadata: {
                name: apiUser?.name || fallbackName,
                avatar: apiUser?.avatar ?? undefined,
                role: mappedRole,
                phone: apiUser?.phone ?? '',
                phone_is_whats: apiUser?.phoneIsWhats ?? false,
            },
        };

        saveAuthSession(data.accessToken, sessionUser);
        return sessionUser;
    };

    const signup = async (credentials: RegisterSchema) => {
        const { name, email, phone, password } = credentials;

        const res = await http.post('/auth/register', {
            name,
            email,
            password,
            phone: phone ?? '',
            phoneIsWhats: false,
        });

        const apiUser = res.data as {
            id: string;
            email: string;
            name?: string;
            avatar?: string | null;
            phone?: string;
            phoneIsWhats?: boolean;
            role?: string;
        };

        return {
            id: apiUser.id,
            email: apiUser.email,
            role: mapApiRoleToAppRole(apiUser.role ?? 'SOCIETY'),
            user_metadata: {
                name: apiUser.name ?? name,
                avatar: apiUser.avatar ?? undefined,
                role: mapApiRoleToAppRole(apiUser.role ?? 'SOCIETY'),
                phone: apiUser.phone ?? phone,
                phone_is_whats: apiUser.phoneIsWhats ?? false,
            },
        } satisfies AppUser;
    };

    const logout = async () => {
        try {
            clearAuthCookie();
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            cachedAuthCookie = null;
            cachedAuthUser = null;
            notifyAuthSessionChanged();
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
