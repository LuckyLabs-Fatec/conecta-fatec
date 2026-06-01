'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, useToast } from '@/presentation/components';
import { useAuth } from '@/presentation/hooks/useAuth';
import http from '@/presentation/lib/http';

type Teammate = {
  id: string;
  name?: string;
  email: string;
};

type ProjectAssignment = {
  projectId: string;
  projectTitle: string;
  projectDescription: string;
  projectStatus: string;
  groupName?: string;
  teammates: Teammate[];
};

export default function StudentAssignmentsPage() {
  const router = useRouter();
  const { show } = useToast();
  const { user, isLoading } = useAuth();

  const [assignments, setAssignments] = useState<ProjectAssignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(true);

  const isStudent = (user?.role ?? '').toLowerCase() === 'estudante';

  useEffect(() => {
    if (!isLoading && !isStudent) {
      router.push('/');
    }
  }, [isLoading, isStudent, router]);

  useEffect(() => {
    if (!isStudent) return;

    const loadAssignments = async () => {
      setLoadingAssignments(true);
      try {
        const response = await http.get<ProjectAssignment[]>('/project-students/my-assignments');
        setAssignments(response.data ?? []);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar atribuições';
        show({ kind: 'error', message });
      } finally {
        setLoadingAssignments(false);
      }
    };

    void loadAssignments();
  }, [isStudent, show]);

  if (isLoading || !isStudent) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <section className="max-w-5xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Minhas Atribuições</h1>
            <p className="text-gray-600 mt-1">
              Veja os projetos em que voce foi incluído e os colegas do seu grupo.
            </p>
          </div>

          {loadingAssignments ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-500">Carregando atribuições...</div>
          ) : assignments.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
              Nenhuma atribuição encontrada para seu usuário.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {assignments.map((assignment) => (
                <article key={assignment.projectId} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-semibold text-gray-800">{assignment.projectTitle}</h2>
                    <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 text-xs px-2.5 py-1 font-medium">
                      {assignment.projectStatus}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600">{assignment.projectDescription}</p>

                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                    <p className="text-sm font-medium text-gray-700">
                      Grupo: {assignment.groupName || 'Nao informado'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Integrantes</h3>
                    <ul className="space-y-2">
                      {assignment.teammates.map((teammate) => (
                        <li key={teammate.id} className="text-sm text-gray-700 border border-gray-100 rounded-lg p-2">
                          <p className="font-medium">{teammate.name || 'Sem nome'}</p>
                          <p className="text-xs text-gray-500">{teammate.email}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
