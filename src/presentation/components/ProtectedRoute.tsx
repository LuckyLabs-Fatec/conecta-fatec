'use client';
import { useAuth, UserRole } from '@/presentation/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
// TODO: Remover arquivo??
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

            const userRole = (user.role as string)?.toLowerCase();
            const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

            if (!normalizedAllowedRoles.includes(userRole)) {
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

    const userRole = (user?.role as string)?.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    if (!user || !normalizedAllowedRoles.includes(userRole)) {
        return null;
    }

    return <>{children}</>;
};

// Deprecated: ProtectedRoute has been removed as it's unused in the app.
export { };
