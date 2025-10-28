import { z } from 'zod';

export const assignmentSchema = z.object({
  curso: z.string().min(1, 'Curso obrigatório'),
  turma: z.string().min(1, 'Turma obrigatória'),
  semestre: z.string().min(1, 'Semestre obrigatório'),
  professor: z.string().min(1, 'Professor obrigatório'),
});

export type AssignmentSchema = z.infer<typeof assignmentSchema>;
