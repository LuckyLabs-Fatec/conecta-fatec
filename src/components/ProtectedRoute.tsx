'use client';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    redirectTo?: string;
}

export const ProtectedRoute = ({ 
    children, 
    allowedRoles, 
    redirectTo = '/' 
}: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/autenticacao');
                return;
            }

            if (!allowedRoles.includes(user.role)) {
                router.push(redirectTo);
                return;
            }
        }
    }, [user, isLoading, allowedRoles, redirectTo, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#CB2616] mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return null;
    }

    return <>{children}</>;
};
