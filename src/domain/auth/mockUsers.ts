import { UserRole } from '@/hooks/useAuth';

export type MockUser = {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  department?: string; // coordenação
  specialization?: string; // mediador
};

export const MOCK_USERS: Record<string, MockUser> = {
  'comunidade@fatecconecta.com': {
    email: 'comunidade@fatecconecta.com',
    password: '123456',
    role: 'comunidade',
    name: 'Membro da Comunidade',
  },
  'mediador@fatecconecta.com': {
    email: 'mediador@fatecconecta.com',
    password: '123456',
    role: 'mediador',
    name: 'Mediador(a)',
    specialization: 'Tecnologia e Inovação',
  },
  'coordenacao@fatecconecta.com': {
    email: 'coordenacao@fatecconecta.com',
    password: '123456',
    role: 'coordenacao',
    name: 'Coordenação',
    department: 'Desenvolvimento de Software Multiplataforma',
  },
  'estudante@fatecconecta.com': {
    email: 'estudante@fatecconecta.com',
    password: '123456',
    role: 'estudante',
    name: 'Estudante',
  },
};

export function resolveMockUser(email: string, password: string): MockUser | null {
  const key = email.trim().toLowerCase();
  const user = MOCK_USERS[key];
  if (!user) return null;
  if (user.password !== password) return null;
  return user;
}
