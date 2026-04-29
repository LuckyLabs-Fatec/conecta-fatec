import { Project, ProjectStatus } from '@/domain/projects/types';

export type MockUserRole = 'comunidade' | 'mediador' | 'coordenador' | 'estudante' | 'admin';

export interface MockUser {
  id: string;
  id_usuario: number;
  uid: string;
  email: string;
  nome: string;
  telefone: string;
  telefone_is_whats: boolean;
  ativo: boolean;
  perfil: MockUserRole;
  user_metadata: {
    name?: string;
    avatar?: string;
    role?: MockUserRole;
    phone?: string;
    phone_is_whats?: boolean;
  };
}

export interface MockAttachment {
  key: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface MockProposal {
  id: string;
  id_proposta: string;
  id_usuario: number;
  titulo: string;
  descricao: string;
  status: ProjectStatus | 'aprovada' | 'rejeitada' | 'aguardando_info';
  anexos: MockAttachment[] | null;
  created_at: string;
  email_contato_opcional?: string;
  telefone_contato_opcional?: string;
  telefone_contato_opcional_is_whats?: boolean;
  usuario?: {
    nome: string;
    email: string;
    perfil: MockUserRole;
  };
}

interface MockDatabase {
  users: MockUser[];
  proposals: MockProposal[];
}

const now = new Date().toISOString();

const initialDatabase = (): MockDatabase => ({
  users: [
    {
      id: 'mock-user-comunidade',
      id_usuario: 1,
      uid: '11111111-1111-4111-8111-111111111111',
      email: 'comunidade@fatec.test',
      nome: 'Usuário Comunidade',
      telefone: '15999999999',
      telefone_is_whats: true,
      ativo: true,
      perfil: 'comunidade',
      user_metadata: {
        name: 'Usuário Comunidade',
        role: 'comunidade',
        phone: '15999999999',
        phone_is_whats: true,
      },
    },
    {
      id: 'mock-user-mediador',
      id_usuario: 2,
      uid: '22222222-2222-4222-8222-222222222222',
      email: 'mediador@fatec.test',
      nome: 'Usuário Mediador',
      telefone: '15888888888',
      telefone_is_whats: false,
      ativo: true,
      perfil: 'mediador',
      user_metadata: {
        name: 'Usuário Mediador',
        role: 'mediador',
        phone: '15888888888',
        phone_is_whats: false,
      },
    },
    {
      id: 'mock-user-admin',
      id_usuario: 3,
      uid: '33333333-3333-4333-8333-333333333333',
      email: 'admin@fatec.test',
      nome: 'Usuário Admin',
      telefone: '15777777777',
      telefone_is_whats: true,
      ativo: true,
      perfil: 'admin',
      user_metadata: {
        name: 'Usuário Admin',
        role: 'admin',
        phone: '15777777777',
        phone_is_whats: true,
      },
    },
  ],
  proposals: [
    {
      id: '101',
      id_proposta: '101',
      id_usuario: 1,
      titulo: 'Horta comunitária no bairro',
      descricao: 'Projeto de extensão com foco em educação ambiental.',
      status: 'em_desenvolvimento',
      anexos: null,
      created_at: now,
    },
    {
      id: '102',
      id_proposta: '102',
      id_usuario: 1,
      titulo: 'Iluminação inteligente em praças',
      descricao: 'Sensores e automação para consumo eficiente.',
      status: 'testando',
      anexos: null,
      created_at: now,
    },
    {
      id: '103',
      id_proposta: '103',
      id_usuario: 2,
      titulo: 'Coleta seletiva em escolas',
      descricao: 'Programa educativo com coleta seletiva.',
      status: 'pendente',
      anexos: null,
      created_at: now,
    },
  ],
});

const globalForMock = globalThis as typeof globalThis & {
  conectaFatecMockDb?: MockDatabase;
};

const db = globalForMock.conectaFatecMockDb ?? initialDatabase();
globalForMock.conectaFatecMockDb = db;

export function attachUsers(proposals: MockProposal[] = db.proposals) {
  return proposals.map((proposal) => {
    const user = db.users.find((item) => item.id_usuario === proposal.id_usuario);
    return {
      ...proposal,
      usuario: user
        ? {
          nome: user.nome,
          email: user.email,
          perfil: user.perfil,
        }
        : undefined,
    };
  });
}

export function listProposals() {
  return attachUsers();
}

export function findProposal(id: string) {
  return attachUsers(db.proposals).find((proposal) => proposal.id === id || proposal.id_proposta === id);
}

export function createProposal(input: Omit<MockProposal, 'id' | 'id_proposta' | 'created_at'>) {
  const id = String(Date.now());
  const proposal: MockProposal = {
    ...input,
    id,
    id_proposta: id,
    created_at: new Date().toISOString(),
  };

  db.proposals.unshift(proposal);
  return attachUsers([proposal])[0];
}

export function updateProposal(id: string, updates: Partial<Pick<MockProposal, 'status'>>) {
  const proposal = db.proposals.find((item) => item.id === id || item.id_proposta === id);

  if (!proposal) {
    return null;
  }

  Object.assign(proposal, updates);
  return attachUsers([proposal])[0];
}

export function findUserByEmail(email?: string | null) {
  if (!email) return undefined;
  return db.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findUserByUid(uid: string) {
  return db.users.find((user) => user.uid === uid || user.id === uid);
}

export function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  role: MockUserRole;
  uid: string;
}) {
  const existingUser = findUserByEmail(input.email);

  if (existingUser) {
    return existingUser;
  }

  const user: MockUser = {
    id: input.uid,
    id_usuario: Math.max(...db.users.map((item) => item.id_usuario), 0) + 1,
    uid: input.uid,
    email: input.email,
    nome: input.name,
    telefone: input.phone || '',
    telefone_is_whats: false,
    ativo: true,
    perfil: input.role,
    user_metadata: {
      name: input.name,
      role: input.role,
      phone: input.phone || '',
      phone_is_whats: false,
    },
  };

  db.users.push(user);
  return user;
}

export function updateUser(uid: string, updates: Partial<MockUser> & { avatar?: string }) {
  const user = findUserByUid(uid);

  if (!user) {
    return null;
  }

  if (updates.nome !== undefined) {
    user.nome = updates.nome;
    user.user_metadata.name = updates.nome;
  }

  if (updates.telefone !== undefined) {
    user.telefone = updates.telefone;
    user.user_metadata.phone = updates.telefone;
  }

  if (updates.telefone_is_whats !== undefined) {
    user.telefone_is_whats = updates.telefone_is_whats;
    user.user_metadata.phone_is_whats = updates.telefone_is_whats;
  }

  if (updates.perfil !== undefined) {
    user.perfil = updates.perfil;
    user.user_metadata.role = updates.perfil;
  }

  if (updates.avatar !== undefined) {
    user.user_metadata.avatar = updates.avatar;
  }

  return user;
}

export function toProject(item: MockProposal): Project {
  return {
    id: (item.id || item.id_proposta || '').toString(),
    title: item.titulo,
    description: item.descricao,
    status: item.status as ProjectStatus,
    student: item.usuario
      ? {
        name: item.usuario.nome,
        course: 'Não informado',
        semester: 'Não informado',
      }
      : undefined,
    startDate: item.created_at,
    expectedEndDate: undefined,
    progress: 0,
    images: item.anexos?.map((attachment) => attachment.url) ?? [],
    updates: [],
  };
}
