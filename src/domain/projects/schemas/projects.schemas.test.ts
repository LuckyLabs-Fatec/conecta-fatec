import { describe, expect, it } from 'vitest';
import { assignmentSchema } from './assignment.schema';
import { projectsFiltersSchema, statusEnum } from './filters.schema';

describe('assignmentSchema', () => {
  const assignment = {
    curso: 'DSM',
    turma: 'Primeiro semestre',
    semestre: '2026-1',
    professor: 'Professor',
  };

  it('accepts a complete assignment', () => {
    expect(assignmentSchema.parse(assignment)).toEqual(assignment);
  });

  it.each(['curso', 'turma', 'semestre', 'professor'])('requires %s', (field) => {
    expect(assignmentSchema.safeParse({ ...assignment, [field]: '' }).success).toBe(false);
  });
});

describe('projectsFiltersSchema', () => {
  it('exports the available statuses', () => {
    expect(statusEnum).toEqual([
      'em_analise',
      'em_desenvolvimento',
      'testando',
      'concluido',
      'suspenso',
      'pendente',
    ]);
  });

  it('uses empty defaults', () => {
    expect(projectsFiltersSchema.parse({})).toEqual({ status: '', search: '' });
  });

  it('trims and accepts filters', () => {
    expect(projectsFiltersSchema.parse({ status: 'concluido', search: '  horta  ' })).toEqual({
      status: 'concluido',
      search: 'horta',
    });
  });

  it.each([
    { status: 'invalid' },
    { search: 'a' },
    { search: 'a'.repeat(101) },
  ])('rejects invalid filters', (filters) => {
    expect(projectsFiltersSchema.safeParse(filters).success).toBe(false);
  });
});
