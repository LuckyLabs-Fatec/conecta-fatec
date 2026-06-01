'use client';

import { useEffect, useMemo, useState } from 'react';
import { Pencil, Save, Search, Trash2, X } from 'lucide-react';
import { useToast } from '@/presentation/components';
import {
  AdminUser,
  AdminUserRole,
  useAdminUsers,
} from '@/presentation/hooks/useAdminUsers';

type SearchField = 'name' | 'email' | 'phone' | 'role';

type UserEditForm = {
  name: string;
  email: string;
  avatar: string;
  phone: string;
  phoneIsWhats: boolean;
  role: AdminUserRole;
};

const usersPerPage = 10;

const emptyEditForm: UserEditForm = {
  name: '',
  email: '',
  avatar: '',
  phone: '',
  phoneIsWhats: false,
  role: 'comunidade',
};

const roleLabels: Record<AdminUserRole, string> = {
  comunidade: 'Comunidade',
  estudante: 'Estudante',
  mediador: 'Mediador',
  admin: 'Admin',
};

const searchFieldLabels: Record<SearchField, string> = {
  name: 'nome',
  email: 'email',
  phone: 'telefone',
  role: 'perfil',
};

export function AdminUsersPanel() {
  const { show } = useToast();
  const {
    users,
    isLoading,
    error,
    updateUser,
    updatingUserId,
    deleteUser,
    deletingUserId,
  } = useAdminUsers();
  const [searchField, setSearchField] = useState<SearchField>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<UserEditForm>(emptyEditForm);

  const editingUser = users.find((user) => user.id === editingUserId) ?? null;

  const startEditing = (user: AdminUser) => {
    setEditingUserId(user.id);
    setEditForm({
      name: user.name === 'Sem nome' ? '' : user.name,
      email: user.email,
      avatar: user.avatar ?? '',
      phone: user.phone,
      phoneIsWhats: user.phoneIsWhats,
      role: user.role,
    });
  };

  const cancelEditing = () => {
    setEditingUserId(null);
    setEditForm(emptyEditForm);
  };

  const handleSaveUser = async () => {
    if (!editingUser) return;

    const email = editForm.email.trim();
    const phone = editForm.phone.trim();

    if (!email || !phone) {
      show({
        kind: 'error',
        message: 'Informe email e telefone do usuário.',
      });
      return;
    }

    try {
      await updateUser({
        id: editingUser.id,
        name: editForm.name.trim() || null,
        email,
        avatar: editForm.avatar.trim() || null,
        phone,
        phoneIsWhats: editForm.phoneIsWhats,
        role: editForm.role,
      });
      cancelEditing();

      show({
        kind: 'success',
        message: `Usuário ${editingUser.name} atualizado com sucesso.`,
      });
    } catch (updateError) {
      show({
        kind: 'error',
        message: updateError instanceof Error
          ? updateError.message
          : 'Não foi possível atualizar o usuário.',
      });
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      return;
    }

    try {
      await deleteUser(user.id);

      show({
        kind: 'success',
        message: `Usuário ${user.name} excluído com sucesso.`,
      });
    } catch (deleteError) {
      show({
        kind: 'error',
        message: deleteError instanceof Error
          ? deleteError.message
          : 'Não foi possível excluir o usuário.',
      });
    }
  };

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return users;
    }

    return users.filter((user) => {
      if (searchField === 'role') {
        return roleLabels[user.role].toLowerCase().includes(normalizedQuery);
      }

      return user[searchField].toLowerCase().includes(normalizedQuery);
    });
  }, [users, searchField, searchQuery]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    const lastPage = Math.max(1, totalPages);

    if (currentPage > lastPage) {
      setCurrentPage(lastPage);
    }
  }, [currentPage, totalPages]);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Administração de Usuários
        </h2>
        <p className="text-gray-600">
          Gerencie os usuários cadastrados no sistema
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search-field" className="block text-sm font-medium text-gray-700 mb-2">
              Buscar por
            </label>
            <select
              id="search-field"
              value={searchField}
              onChange={(event) => {
                setSearchField(event.target.value as SearchField);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
            >
              <option value="name">Nome</option>
              <option value="email">Email</option>
              <option value="phone">Telefone</option>
              <option value="role">Perfil</option>
            </select>
          </div>
          <div className="flex-[2]">
            <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
              Pesquisar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder={`Buscar por ${searchFieldLabels[searchField]}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Perfil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Carregando usuários...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const isDeleting = deletingUserId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">{user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{user.phoneIsWhats ? 'Sim' : 'Não'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">{roleLabels[user.role]}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => startEditing(user)}
                            className="text-gray-600 hover:text-gray-800 transition-colors"
                            title="Editar usuário"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(user)}
                            disabled={isDeleting}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Excluir usuário"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && !error && totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-600">
              Mostrando {indexOfFirstUser + 1} a {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuários
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.max(previous - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-[#CB2616] text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((previous) => Math.min(previous + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <button
            type="button"
            aria-label="Fechar modal de edição de usuário"
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!updatingUserId) {
                cancelEditing();
              }
            }}
            disabled={Boolean(updatingUserId)}
          />
          <div
            className="relative z-10 w-full max-w-2xl rounded-lg bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
          >
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 id="edit-user-title" className="text-lg font-semibold text-gray-900">
                  Editar usuário
                </h3>
                <p className="text-sm text-gray-500">{editingUser.email}</p>
              </div>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={Boolean(updatingUserId)}
                className="text-gray-500 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                title="Fechar modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-2">
              <div>
                <label htmlFor="edit-user-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome
                </label>
                <input
                  id="edit-user-name"
                  type="text"
                  value={editForm.name}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, name: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CB2616] focus:ring-2 focus:ring-[#CB2616] outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-user-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="edit-user-email"
                  type="email"
                  value={editForm.email}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, email: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CB2616] focus:ring-2 focus:ring-[#CB2616] outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-user-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  id="edit-user-phone"
                  type="tel"
                  value={editForm.phone}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, phone: event.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CB2616] focus:ring-2 focus:ring-[#CB2616] outline-none"
                />
              </div>

              <div>
                <label htmlFor="edit-user-role" className="block text-sm font-medium text-gray-700 mb-2">
                  Perfil
                </label>
                <select
                  id="edit-user-role"
                  value={editForm.role}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, role: event.target.value as AdminUserRole }))}
                  disabled={Boolean(updatingUserId)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CB2616] focus:ring-2 focus:ring-[#CB2616] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="comunidade">Comunidade</option>
                  <option value="estudante">Estudante</option>
                  <option value="mediador">Mediador</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="edit-user-avatar" className="block text-sm font-medium text-gray-700 mb-2">
                  URL do avatar
                </label>
                <input
                  id="edit-user-avatar"
                  type="url"
                  value={editForm.avatar}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, avatar: event.target.value }))}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#CB2616] focus:ring-2 focus:ring-[#CB2616] outline-none"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={editForm.phoneIsWhats}
                  onChange={(event) => setEditForm((previous) => ({ ...previous, phoneIsWhats: event.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-[#CB2616] focus:ring-[#CB2616]"
                />
                Telefone é WhatsApp
              </label>
            </div>

            <div className="flex flex-col gap-3 border-t border-gray-200 px-6 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={cancelEditing}
                disabled={Boolean(updatingUserId)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                disabled={Boolean(updatingUserId)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#CB2616] px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
