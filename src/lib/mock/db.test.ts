import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MockProposal } from './db';

const importDb = async () => import('./db');

beforeEach(() => {
  delete (globalThis as typeof globalThis & { conectaFatecMockDb?: unknown }).conectaFatecMockDb;
  vi.resetModules();
});

describe('mock database', () => {
  it('lists proposals with their users and finds proposals by both ids', async () => {
    const db = await importDb();
    const proposals = db.listProposals();

    expect(proposals).toHaveLength(3);
    expect(proposals[0].usuario?.email).toBe('comunidade@fatec.test');
    expect(db.findProposal('101')).toEqual(proposals[0]);
    expect(db.findProposal('missing')).toBeUndefined();
    expect(db.attachUsers([{ ...proposals[0], id_usuario: 999 }])[0].usuario).toBeUndefined();
  });

  it('creates and updates proposals', async () => {
    const db = await importDb();
    vi.spyOn(Date, 'now').mockReturnValue(123);

    const created = db.createProposal({
      id_usuario: 1,
      titulo: 'Nova proposta',
      descricao: 'Descrição',
      status: 'pendente',
      anexos: null,
    });

    expect(created.id).toBe('123');
    expect(created.usuario?.nome).toBe('Usuário Comunidade');
    expect(db.updateProposal('123', { status: 'aprovada' })?.status).toBe('aprovada');
    expect(db.updateProposal('missing', { status: 'rejeitada' })).toBeNull();
  });

  it('finds and creates users without duplicating email addresses', async () => {
    const db = await importDb();

    expect(db.findUserByEmail()).toBeUndefined();
    expect(db.findUserByEmail('COMUNIDADE@FATEC.TEST')?.id_usuario).toBe(1);
    expect(db.findUserByUid('mock-user-comunidade')?.email).toBe('comunidade@fatec.test');
    expect(db.findUserByUid('missing')).toBeUndefined();

    const created = db.createUser({
      name: 'New User',
      email: 'new@fatec.test',
      phone: '15111111111',
      role: 'estudante',
      uid: 'new-user',
    });
    expect(created.telefone).toBe('15111111111');
    expect(db.createUser({
      name: 'Ignored',
      email: 'NEW@fatec.test',
      role: 'admin',
      uid: 'ignored',
    })).toBe(created);

    expect(db.createUser({
      name: 'No Phone',
      email: 'no-phone@fatec.test',
      role: 'coordenador',
      uid: 'no-phone',
    }).telefone).toBe('');
  });

  it('updates user fields and metadata', async () => {
    const db = await importDb();

    expect(db.updateUser('missing', {})).toBeNull();
    expect(db.updateUser('mock-user-comunidade', {})).toBeTruthy();

    const updated = db.updateUser('11111111-1111-4111-8111-111111111111', {
      nome: 'Updated',
      telefone: '15000000000',
      telefone_is_whats: false,
      perfil: 'admin',
      avatar: 'avatar.png',
    });

    expect(updated).toMatchObject({
      nome: 'Updated',
      telefone: '15000000000',
      telefone_is_whats: false,
      perfil: 'admin',
      user_metadata: {
        name: 'Updated',
        phone: '15000000000',
        phone_is_whats: false,
        role: 'admin',
        avatar: 'avatar.png',
      },
    });
  });

  it('converts proposals to dashboard projects', async () => {
    const { toProject } = await importDb();
    const withStudent = {
      id: '',
      id_proposta: 'proposal-id',
      id_usuario: 1,
      titulo: 'Título',
      descricao: 'Descrição',
      status: 'testando',
      anexos: [{ key: 'key', name: 'image', size: 1, type: 'image/png', url: '/image.png', uploadedAt: 'now' }],
      created_at: 'now',
      usuario: { nome: 'Student', email: 'student@fatec.test', perfil: 'estudante' },
    } satisfies MockProposal;

    expect(toProject(withStudent)).toMatchObject({
      id: 'proposal-id',
      student: { name: 'Student' },
      images: ['/image.png'],
    });
    expect(toProject({ ...withStudent, id_proposta: '', usuario: undefined, anexos: null })).toMatchObject({
      id: '',
      student: undefined,
      images: [],
    });
  });
});
