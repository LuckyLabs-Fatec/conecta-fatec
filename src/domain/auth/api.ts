import { withApi } from '../config';

export type BackendRole = 'Administrador' | 'Supervisor' | 'Mediador' | 'Aluno' | 'Comunidade';
export type UserRole = 'comunidade' | 'mediador' | 'coordenacao';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: BackendRole;
}

export interface BackendUser {
  id_usuario: number;
  nome: string;
  email: string;
  perfil: BackendRole;
  ativo?: boolean;
}

export interface LoginResponse {
  message: string;
  user: BackendUser;
}

export interface RegisterResponse {
  message: string;
  id_usuario: number;
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await fetch(withApi('/api/users/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // session cookie
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Falha no login');
  }
  return res.json();
};

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const res = await fetch(withApi('/api/users/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || 'Falha no cadastro');
  }
  return res.json();
};

export const logoutUser = async (): Promise<void> => {
  const res = await fetch(withApi('/api/users/logout'), {
    method: 'POST',
    credentials: 'include'
  });
  if (!res.ok) {
    console.warn('Logout failed');
  }
};

export const mapUserTypeToBackendRole = (userType: UserRole): BackendRole => {
  switch (userType) {
    case 'comunidade':
      return 'Comunidade';
    case 'mediador':
      return 'Mediador';
    case 'coordenacao':
      return 'Administrador';
  }
};

export const mapBackendRoleToUserType = (perfil: BackendRole): UserRole => {
  switch (perfil) {
    case 'Comunidade':
      return 'comunidade';
    case 'Mediador':
    case 'Supervisor':
      return 'mediador';
    case 'Administrador':
      return 'coordenacao';
    case 'Aluno':
      return 'comunidade';
  }
};
