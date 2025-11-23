'use client';
import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { LoginSchema } from '@/domain/auth/schemas/login.schema';
import { RegisterSchema } from '@/domain/auth/schemas/register.schema';

export type UserRole = 'comunidade' | 'mediador' | 'coordenacao' | 'estudante';

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
        const { error: signUpError } = await supabase.auth.signUp({
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

        const { name, email, phone } = credentials;
        const role = 'comunidade';

        try {
            const response = await fetch('/api/user-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, role }),
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
        await supabase.auth.signOut();
        setUser(null);
    };

    const hasPermission = (requiredRole: UserRole | UserRole[]) => {
        if (!user) return false;

        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const userRole = (user.user_metadata.role as string)?.toLowerCase() as UserRole;
        const normalizedRoles = roles.map(role => role.toLowerCase() as UserRole);
        return normalizedRoles.includes(userRole);
    };

    const canAccessIdeaValidation = () => {
        return hasPermission(['mediador', 'coordenacao']);
    };

    const canAssignToClasses = () => {
        return hasPermission('coordenacao');
    };

    const canSuggestIdeas = () => {
        return hasPermission(['comunidade', 'estudante']);
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
