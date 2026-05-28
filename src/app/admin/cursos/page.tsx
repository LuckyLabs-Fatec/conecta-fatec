'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, useToast } from '@/presentation/components';
import { useAuth } from '@/presentation/hooks/useAuth';
import { AdminShell } from '../components/AdminShell';
import { AdminCoursesPanel } from './components/AdminCoursesPanel';

export default function AdminCoursesPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, hasPermission } = useAuth();
  const { show } = useToast();

  useEffect(() => {
    if (!isLoading && isAuthenticated && !hasPermission('admin')) {
      show({
        kind: 'error',
        message: 'Acesso negado. Apenas administradores podem acessar esta página.',
      });
      router.push('/');
    }
  }, [isLoading, isAuthenticated, user, router, show, hasPermission]);

  if (isLoading || !isAuthenticated || !hasPermission('admin')) {
    return null;
  }

  return (
    <>
      <Header />
      <AdminShell activeSection="courses">
        <AdminCoursesPanel />
      </AdminShell>
    </>
  );
}
