'use client';

import { useMemo, useState } from 'react';
import { Pencil, Save, Search, Trash2, X } from 'lucide-react';
import { useToast } from '@/presentation/components';
import { AdminCourse, useAdminCourses } from '@/presentation/hooks/useAdminCourses';

type SearchField = 'name' | 'description' | 'status';

const coursesPerPage = 10;

const statusLabels: Record<string, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
};

export function AdminCoursesPanel() {
  const { show } = useToast();
  const {
    courses,
    isLoading,
    error,
    updateCourse,
    updatingCourseId,
    deleteCourse,
    deletingCourseId,
  } = useAdminCourses();
  const [searchField, setSearchField] = useState<SearchField>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '' });

  const filteredCourses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return courses;
    }

    return courses.filter((course) => {
      if (searchField === 'status') {
        const status = course.active ? statusLabels.active : statusLabels.inactive;
        return status.toLowerCase().includes(normalizedQuery);
      }

      const value = course[searchField] ?? '';
      return value.toLowerCase().includes(normalizedQuery);
    });
  }, [courses, searchField, searchQuery]);

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const lastPage = Math.max(1, totalPages);
  const visiblePage = Math.min(currentPage, lastPage);
  const indexOfLastCourse = visiblePage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

  const startEditing = (course: AdminCourse) => {
    setEditingCourseId(course.id);
    setEditForm({
      name: course.name,
      description: course.description ?? '',
    });
  };

  const cancelEditing = () => {
    setEditingCourseId(null);
    setEditForm({ name: '', description: '' });
  };

  const handleSaveCourse = async (courseId: string) => {
    const name = editForm.name.trim();
    const description = editForm.description.trim();

    if (!name) {
      show({
        kind: 'error',
        message: 'Informe o nome do curso.',
      });
      return;
    }

    try {
      await updateCourse({
        id: courseId,
        name,
        description: description || undefined,
      });
      cancelEditing();

      show({
        kind: 'success',
        message: 'Curso atualizado com sucesso.',
      });
    } catch (saveError) {
      show({
        kind: 'error',
        message: saveError instanceof Error
          ? saveError.message
          : 'Não foi possível atualizar o curso.',
      });
    }
  };

  const handleDeleteCourse = async (course: AdminCourse) => {
    if (!window.confirm(`Tem certeza que deseja excluir o curso ${course.name}?`)) {
      return;
    }

    try {
      await deleteCourse(course.id);

      show({
        kind: 'success',
        message: `Curso ${course.name} excluído com sucesso.`,
      });
    } catch (deleteError) {
      show({
        kind: 'error',
        message: deleteError instanceof Error
          ? deleteError.message
          : 'Não foi possível excluir o curso.',
      });
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--cps-blue-base)] mb-2">
          Administração de Cursos
        </h2>
        <p className="text-[var(--cps-gray-text)]">
          Gerencie os cursos cadastrados no sistema
        </p>
      </div>

      <div className="bg-white rounded-[30px] shadow-[var(--cps-shadow-1)] border border-[var(--cps-gray-light)] p-6 mb-6">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex-1">
            <label htmlFor="course-search-field" className="block text-sm font-medium text-[var(--cps-gray-text)] mb-2">
              Buscar por
            </label>
            <select
              id="course-search-field"
              value={searchField}
              onChange={(event) => {
                setSearchField(event.target.value as SearchField);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-[var(--cps-gray-light)] rounded-[30px] focus:ring-2 focus:ring-[var(--cps-blue-highlight)] focus:border-[var(--cps-blue-base)] outline-none"
            >
              <option value="name">Nome</option>
              <option value="description">Descrição</option>
              <option value="status">Status</option>
            </select>
          </div>
          <div className="flex-[2]">
            <label htmlFor="course-search-input" className="block text-sm font-medium text-[var(--cps-gray-text)] mb-2">
              Pesquisar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--cps-gray-text)]" size={20} />
              <input
                id="course-search-input"
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Buscar por ${searchField === 'name' ? 'nome' : searchField === 'description' ? 'descrição' : 'status'}...`}
                className="w-full pl-10 pr-4 py-2 border border-[var(--cps-gray-light)] rounded-[30px] focus:ring-2 focus:ring-[var(--cps-blue-highlight)] focus:border-[var(--cps-blue-base)] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[30px] shadow-[var(--cps-shadow-1)] border border-[var(--cps-gray-light)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--cps-silver-base)] border-b border-[var(--cps-gray-light)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--cps-gray-text)] uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--cps-gray-text)] uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--cps-gray-text)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--cps-gray-text)] uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--cps-gray-text)]">
                    Carregando cursos...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--cps-feedback-cancelled)]">
                    {error}
                  </td>
                </tr>
              ) : currentCourses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[var(--cps-gray-text)]">
                    Nenhum curso encontrado
                  </td>
                </tr>
              ) : (
                currentCourses.map((course) => {
                  const isEditing = editingCourseId === course.id;
                  const isSaving = updatingCourseId === course.id;
                  const isDeleting = deletingCourseId === course.id;

                  return (
                    <tr key={course.id} className="hover:bg-[var(--cps-silver-base)]">
                      <td className="px-6 py-4 align-top">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(event) => setEditForm((previous) => ({
                              ...previous,
                              name: event.target.value,
                            }))}
                            className="w-full min-w-48 rounded-[30px] border border-[var(--cps-gray-light)] px-3 py-2 text-sm focus:border-[var(--cps-blue-base)] focus:ring-2 focus:ring-[var(--cps-blue-highlight)] outline-none"
                          />
                        ) : (
                          <div className="text-sm font-medium text-[var(--cps-blue-base)]">{course.name}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 align-top">
                        {isEditing ? (
                          <textarea
                            value={editForm.description}
                            onChange={(event) => setEditForm((previous) => ({
                              ...previous,
                              description: event.target.value,
                            }))}
                            rows={2}
                            className="w-full min-w-64 resize-none rounded-[30px] border border-[var(--cps-gray-light)] px-3 py-2 text-sm focus:border-[var(--cps-blue-base)] focus:ring-2 focus:ring-[var(--cps-blue-highlight)] outline-none"
                          />
                        ) : (
                          <div className="max-w-md text-sm text-[var(--cps-gray-text)]">
                            {course.description || 'Sem descrição'}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          course.active
                            ? 'bg-[var(--cps-feedback-done-light)] text-[var(--cps-feedback-done)]'
                            : 'bg-[var(--cps-gray-hover)] text-[var(--cps-gray-text)]'
                        }`}
                        >
                          {course.active ? statusLabels.active : statusLabels.inactive}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap align-top">
                        {isEditing ? (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => handleSaveCourse(course.id)}
                              disabled={isSaving}
                              className="text-[var(--cps-feedback-done)] transition-colors hover:text-[var(--cps-feedback-done)] disabled:cursor-not-allowed disabled:opacity-50"
                              title="Salvar curso"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={cancelEditing}
                              disabled={isSaving}
                              className="text-[var(--cps-gray-text)] transition-colors hover:text-[var(--cps-blue-base)] disabled:cursor-not-allowed disabled:opacity-50"
                              title="Cancelar edição"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => startEditing(course)}
                              className="text-[var(--cps-gray-text)] transition-colors hover:text-[var(--cps-blue-base)]"
                              title="Editar curso"
                            >
                              <Pencil size={18} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCourse(course)}
                              disabled={isDeleting}
                              className="text-[var(--cps-feedback-cancelled)] transition-colors hover:text-[var(--cps-red-dark-10)] disabled:cursor-not-allowed disabled:opacity-50"
                              title="Excluir curso"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && !error && totalPages > 1 && (
          <div className="bg-[var(--cps-silver-base)] px-6 py-4 border-t border-[var(--cps-gray-light)] flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-[var(--cps-gray-text)]">
              Mostrando {indexOfFirstCourse + 1} a {Math.min(indexOfLastCourse, filteredCourses.length)} de {filteredCourses.length} cursos
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-[var(--cps-gray-light)] rounded-[30px] text-sm font-medium text-[var(--cps-gray-text)] hover:bg-[var(--cps-gray-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-[30px] text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[var(--cps-red-base)] text-white'
                      : 'text-[var(--cps-gray-text)] hover:bg-[var(--cps-gray-hover)]'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.min(previous + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-[var(--cps-gray-light)] rounded-[30px] text-sm font-medium text-[var(--cps-gray-text)] hover:bg-[var(--cps-gray-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
