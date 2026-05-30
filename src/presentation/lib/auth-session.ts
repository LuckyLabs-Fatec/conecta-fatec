export type UserRole = 'comunidade' | 'mediador' | 'coordenador' | 'estudante' | 'admin';

export interface AuthSessionUser {
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
    };
}

export interface AuthSession {
    accessToken: string;
    user: AuthSessionUser;
}

export const AUTH_COOKIE_KEY = 'conecta-fatec-auth';

export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const AUTH_SESSION_EXPIRED_EVENT = 'conecta-fatec-auth-session-expired';

export const readAuthCookie = (): AuthSession | null => {
    if (typeof document === 'undefined') {
        return null;
    }

    const rawCookie = document.cookie
        .split('; ')
        .find((item) => item.startsWith(`${AUTH_COOKIE_KEY}=`));

    if (!rawCookie) {
        return null;
    }

    const encodedValue = rawCookie.split('=').slice(1).join('=');

    try {
        return JSON.parse(decodeURIComponent(encodedValue)) as AuthSession;
    } catch {
        return null;
    }
};

export const writeAuthCookie = (session: AuthSession) => {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = `${AUTH_COOKIE_KEY}=${encodeURIComponent(JSON.stringify(session))}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=lax`;
};

export const clearAuthCookie = () => {
    if (typeof document === 'undefined') {
        return;
    }

    document.cookie = `${AUTH_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
};

export const expireAuthSession = (redirectTo = '/') => {
    clearAuthCookie();

    if (typeof window === 'undefined') {
        return;
    }

    window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));

    if (window.location.pathname !== redirectTo) {
        window.location.assign(redirectTo);
    }
};
