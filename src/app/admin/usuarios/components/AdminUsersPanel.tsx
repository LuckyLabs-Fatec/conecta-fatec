'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Trash2 } from 'lucide-react';
import { useToast } from '@/presentation/components';
import http from '@/presentation/lib/http';

type ApiRole = 'SOCIETY' | 'STUDENT' | 'MEDIATOR' | 'ADMIN';
type UserRole = 'comunidade' | 'estudante' | 'mediador' | 'admin';
type SearchField = 'name' | 'email' | 'phone' | 'role';

interface ApiUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone: string;
  phoneIsWhats: boolean;
  role: ApiRole;
}

interface UsersResponse {
  items: ApiUser[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

const usersPerPage = 10;

const roleLabels: Record<UserRole, string> = {
  comunidade: 'Comunidade',
  estudante: 'Estudante',
  mediador: 'Mediador',
  admin: 'Admin',
};

const apiRoleByUserRole: Record<UserRole, ApiRole> = {
  comunidade: 'SOCIETY',
  estudante: 'STUDENT',
  mediador: 'MEDIATOR',
  admin: 'ADMIN',
};

const userRoleByApiRole: Record<ApiRole, UserRole> = {
  SOCIETY: 'comunidade',
  STUDENT: 'estudante',
  MEDIATOR: 'mediador',
  ADMIN: 'admin',
};

const searchFieldLabels: Record<SearchField, string> = {
  name: 'nome',
  email: 'email',
  phone: 'telefone',
  role: 'perfil',
};

const mapApiUser = (user: ApiUser): User => ({
  id: user.id,
  name: user.name || 'Sem nome',
  email: user.email,
  phone: user.phone,
  role: userRoleByApiRole[user.role] ?? 'comunidade',
});

export function AdminUsersPanel() {
  const { show } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchField, setSearchField] = useState<SearchField>('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await http.get<UsersResponse>('/auth/register', {
          params: { page: 1, limit: 100 },
        });

        if (!isMounted) return;

        setUsers(response.data.items.map(mapApiUser));
      } catch (loadError) {
        if (!isMounted) return;

        setError(loadError instanceof Error
          ? loadError.message
          : 'Não foi possível carregar os usuários.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const isFatecEmail = (email: string): boolean => {
    return email.endsWith('@fatec.sp.gov.br');
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    const userToUpdate = users.find((user) => user.id === userId);
    if (!userToUpdate) return;

    if (newRole !== 'comunidade' && !isFatecEmail(userToUpdate.email)) {
      show({
        kind: 'error',
        message: 'Apenas usuários com email @fatec.sp.gov.br podem ter perfis de estudante, mediador ou admin.',
      });
      return;
    }

    try {
      setUpdatingUserId(userId);
      const response = await http.patch<ApiUser>(`/auth/register/${userId}`, {
        role: apiRoleByUserRole[newRole],
      });
      const updatedUser = mapApiUser(response.data);

      setUsers((previousUsers) => previousUsers.map((user) => (
        user.id === userId ? updatedUser : user
      )));

      show({
        kind: 'success',
        message: `Perfil de ${userToUpdate.name} alterado para ${roleLabels[newRole]}.`,
      });
    } catch (updateError) {
      show({
        kind: 'error',
        message: updateError instanceof Error
          ? updateError.message
          : 'Não foi possível alterar o perfil do usuário.',
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      return;
    }

    try {
      setDeletingUserId(user.id);
      await http.delete(`/auth/register/${user.id}`);
      setUsers((previousUsers) => (
        previousUsers.filter((currentUser) => currentUser.id !== user.id)
      ));

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
    } finally {
      setDeletingUserId(null);
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Carregando usuários...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => {
                  const isUpdating = updatingUserId === user.id;
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
                        <select
                          value={user.role}
                          onChange={(event) => handleRoleChange(user.id, event.target.value as UserRole)}
                          disabled={isUpdating}
                          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="comunidade">Comunidade</option>
                          <option value="estudante" disabled={!isFatecEmail(user.email)}>
                            Estudante
                          </option>
                          <option value="mediador" disabled={!isFatecEmail(user.email)}>
                            Mediador
                          </option>
                          <option value="admin" disabled={!isFatecEmail(user.email)}>
                            Admin
                          </option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          disabled={isDeleting}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Excluir usuário"
                        >
                          <Trash2 size={18} />
                        </button>
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
    </div>
  );
}
