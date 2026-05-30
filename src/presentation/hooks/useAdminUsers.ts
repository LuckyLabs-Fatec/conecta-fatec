import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '@/presentation/lib/http';

type ApiRole = 'SOCIETY' | 'STUDENT' | 'MEDIATOR' | 'ADMIN';
export type AdminUserRole = 'comunidade' | 'estudante' | 'mediador' | 'admin';

type ApiUser = {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  phone: string;
  phoneIsWhats: boolean;
  role: ApiRole;
};

type UsersResponse = {
  items: ApiUser[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone: string;
  phoneIsWhats: boolean;
  role: AdminUserRole;
};

export type AdminUserUpdate = {
  id: string;
  name: string | null;
  email: string;
  avatar: string | null;
  phone: string;
  phoneIsWhats: boolean;
  role: AdminUserRole;
};

const usersQueryKey = ['admin-users'] as const;

const apiRoleByUserRole: Record<AdminUserRole, ApiRole> = {
  comunidade: 'SOCIETY',
  estudante: 'STUDENT',
  mediador: 'MEDIATOR',
  admin: 'ADMIN',
};

const userRoleByApiRole: Record<ApiRole, AdminUserRole> = {
  SOCIETY: 'comunidade',
  STUDENT: 'estudante',
  MEDIATOR: 'mediador',
  ADMIN: 'admin',
};

const mapApiUser = (user: ApiUser): AdminUser => ({
  id: user.id,
  name: user.name || 'Sem nome',
  email: user.email,
  avatar: user.avatar,
  phone: user.phone,
  phoneIsWhats: user.phoneIsWhats,
  role: userRoleByApiRole[user.role] ?? 'comunidade',
});

const listAllUsers = async (): Promise<AdminUser[]> => {
  const firstPage = await http.get<UsersResponse>('/auth/register', {
    params: { page: 1, limit: 100 },
  });
  const users = [...firstPage.data.items];

  for (let nextPage = 2; nextPage <= firstPage.data.totalPages; nextPage += 1) {
    const page = await http.get<UsersResponse>('/auth/register', {
      params: { page: nextPage, limit: 100 },
    });
    users.push(...page.data.items);
  }

  return users.map(mapApiUser);
};

export const useAdminUsers = () => {
  const queryClient = useQueryClient();
  const usersQuery = useQuery({
    queryKey: usersQueryKey,
    queryFn: listAllUsers,
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, ...data }: AdminUserUpdate) => {
      const response = await http.patch<ApiUser>(`/auth/register/${id}`, {
        ...data,
        role: apiRoleByUserRole[data.role],
      });

      return mapApiUser(response.data);
    },
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<AdminUser[]>(usersQueryKey, (users = []) => (
        users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
      ));
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await http.delete(`/auth/register/${userId}`);
      return userId;
    },
    onSuccess: (deletedUserId) => {
      queryClient.setQueryData<AdminUser[]>(usersQueryKey, (users = []) => (
        users.filter((user) => user.id !== deletedUserId)
      ));
    },
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    error: usersQuery.error instanceof Error ? usersQuery.error.message : null,
    updateUser: updateUserMutation.mutateAsync,
    updatingUserId: updateUserMutation.variables?.id ?? null,
    deleteUser: deleteUserMutation.mutateAsync,
    deletingUserId: deleteUserMutation.variables ?? null,
  };
};
