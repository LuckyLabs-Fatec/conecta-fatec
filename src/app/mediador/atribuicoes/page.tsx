'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header, useToast } from '@/presentation/components';
import { useAuth } from '@/presentation/hooks/useAuth';
import http from '@/presentation/lib/http';

type ProjectItem = {
  id: string;
  title: string;
  status: string;
};

type PaginatedResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

type StudentSummary = {
  id: string;
  name?: string;
  email: string;
};

type AssignResponse = {
  projectId: string;
  groupName?: string;
  assignments: Array<{
    id: string;
    projectId: string;
    userId: string;
    groupName?: string;
  }>;
};

export default function MediatorAssignmentsPage() {
  const router = useRouter();
  const { show } = useToast();
  const { user, isLoading } = useAuth();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [students, setStudents] = useState<StudentSummary[]>([]);

  const [projectId, setProjectId] = useState('');
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isMediator = (user?.role ?? '').toLowerCase() === 'mediador';

  useEffect(() => {
    if (!isLoading && !isMediator) {
      router.push('/');
    }
  }, [isLoading, isMediator, router]);

  const loadProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const response = await http.get<PaginatedResponse<ProjectItem>>('/projects', {
        params: {
          page: 1,
          limit: 100,
        },
      });

      setProjects(response.data.items ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar projetos';
      show({ kind: 'error', message });
    } finally {
      setLoadingProjects(false);
    }
  }, [show]);

  const loadStudents = useCallback(async (currentSearch?: string) => {
    setLoadingStudents(true);
    try {
      const response = await http.get<StudentSummary[]>('/project-students/students', {
        params: currentSearch ? { search: currentSearch } : {},
      });

      setStudents(response.data ?? []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar estudantes';
      show({ kind: 'error', message });
    } finally {
      setLoadingStudents(false);
    }
  }, [show]);

  useEffect(() => {
    if (!isMediator) return;
    void loadProjects();
    void loadStudents();
  }, [isMediator, loadProjects, loadStudents]);

  useEffect(() => {
    if (!isMediator) return;

    const timeoutId = window.setTimeout(() => {
      void loadStudents(search.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [search, isMediator, loadStudents]);

  const selectedCount = selectedStudentIds.length;

  const selectedStudentsPreview = useMemo(() => {
    const selected = new Set(selectedStudentIds);
    return students.filter((student) => selected.has(student.id)).slice(0, 4);
  }, [students, selectedStudentIds]);

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((current) => {
      if (current.includes(studentId)) {
        return current.filter((id) => id !== studentId);
      }

      return [...current, studentId];
    });
  };

  const handleAssign = async () => {
    if (!projectId) {
      show({ kind: 'error', message: 'Selecione um projeto.' });
      return;
    }

    if (selectedStudentIds.length === 0) {
      show({ kind: 'error', message: 'Selecione pelo menos um estudante.' });
      return;
    }

    setSubmitting(true);
    try {
      const response = await http.post<AssignResponse>('/project-students/assign', {
        projectId,
        groupName: groupName.trim() || undefined,
        studentIds: selectedStudentIds,
      });

      show({
        kind: 'success',
        message: `Atribuição salva para ${response.data.assignments.length} estudante(s).`,
      });

      setSelectedStudentIds([]);
      setGroupName('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao salvar atribuição';
      show({ kind: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !isMediator) {
    return null;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-8">
        <section className="max-w-5xl mx-auto px-4 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Atribuir Projetos a Grupos</h1>
            <p className="text-gray-600 mt-1">
              Selecione um projeto, defina o nome do grupo e escolha os estudantes que farão parte da equipe.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                  Projeto
                </label>
                <select
                  id="projectId"
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                  disabled={loadingProjects}
                >
                  <option value="">Selecione um projeto</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} ({project.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do grupo
                </label>
                <input
                  id="groupName"
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Ex.: Grupo Alpha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                />
              </div>
            </div>

            <div>
              <label htmlFor="searchStudents" className="block text-sm font-medium text-gray-700 mb-1">
                Buscar estudantes
              </label>
              <input
                id="searchStudents"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Filtrar por nome ou email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
              />
            </div>

            <div className="border border-gray-200 rounded-lg max-h-80 overflow-auto">
              {loadingStudents ? (
                <p className="p-4 text-sm text-gray-500">Carregando estudantes...</p>
              ) : students.length === 0 ? (
                <p className="p-4 text-sm text-gray-500">Nenhum estudante encontrado.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <li key={student.id} className="p-3 flex items-center gap-3">
                      <input
                        id={`student-${student.id}`}
                        type="checkbox"
                        checked={selectedStudentIds.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                        className="h-4 w-4 rounded border-gray-300 text-[#CB2616] focus:ring-[#CB2616]"
                      />
                      <label htmlFor={`student-${student.id}`} className="cursor-pointer">
                        <p className="text-sm font-medium text-gray-800">{student.name || 'Sem nome'}</p>
                        <p className="text-xs text-gray-500">{student.email}</p>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="text-sm text-gray-600">
                {selectedCount} estudante(s) selecionado(s)
                {selectedStudentsPreview.length > 0 && (
                  <span>
                    {' '}
                    - {selectedStudentsPreview.map((student) => student.name || student.email).join(', ')}
                    {selectedCount > selectedStudentsPreview.length ? '...' : ''}
                  </span>
                )}
              </div>

              <button
                onClick={handleAssign}
                disabled={submitting || loadingProjects || loadingStudents}
                className="px-4 py-2 rounded-lg bg-[#CB2616] text-white font-medium hover:bg-[#AE1E11] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Salvando...' : 'Salvar atribuição'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
