'use client';
import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { LoginSchema } from '@/domain/auth/schemas/login.schema';
import { RegisterSchema } from '@/domain/auth/schemas/register.schema';

export type UserRole = 'comunidade' | 'mediador' | 'coordenador' | 'estudante' | 'admin';

interface AppUser extends User {
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

const ROLE_LEVELS: Record<UserRole, number> = {
    'admin': 4,
    'coordenador': 3,
    'mediador': 2,
    'estudante': 1,
    'comunidade': 0
};

export const useAuth = () => {
    const supabase = createClient();
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user as AppUser ?? null);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase.auth]);

    const login = async (credentials: LoginSchema) => {
        const { error } = await supabase.auth.signInWithPassword(credentials);
        if (error) {
            throw new Error(error.message);
        }
    };

    const signup = async (credentials: RegisterSchema) => {
        const { data, error: signUpError } = await supabase.auth.signUp({
            email: credentials.email,
            password: credentials.password,
            options: {
                data: {
                    name: credentials.name,
                    role: 'comunidade',
                },
            },
        });

        if (signUpError) {
            throw new Error(signUpError.message);
        }

        if (!data.user?.id) {
            throw new Error('Failed to retrieve user ID after signup');
        }

        const { name, email, phone } = credentials;
        const role = 'comunidade';
        const uid = data.user.id;

        try {
            const response = await fetch('/api/user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, role, uid }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error creating user profile:', errorData);
                throw new Error(errorData.error || 'Failed to create user profile');
            }
        } catch (profileError: unknown) {
            const err = profileError as Error;
            console.error('Network or unexpected error when creating user profile:', err);
            throw new Error(err.message || 'Failed to create user profile');
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut({ scope: 'global' });
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            setUser(null);

            if (typeof window !== 'undefined') {
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('sb-')) {
                        localStorage.removeItem(key);
                    }
                });
            }
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
