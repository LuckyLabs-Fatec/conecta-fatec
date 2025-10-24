import { z } from 'zod';

export const statusEnum = [
  'em_analise',
  'em_desenvolvimento',
  'testando',
  'concluido',
  'suspenso',
] as const;

export const priorityEnum = [
  'baixa',
  'media',
  'alta',
  'urgente',
] as const;

export const categoryEnum = [
  'infraestrutura',
  'seguranca',
  'ambiente',
  'transporte',
  'saude',
  'educacao',
  'tecnologia',
  'outros',
] as const;

// Accept empty string as "no filter" for selects
const SelectWithEmpty = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.literal(''), z.enum(values)]);

export const projectsFiltersSchema = z.object({
  status: SelectWithEmpty(statusEnum).default(''),
  category: SelectWithEmpty(categoryEnum).default(''),
  priority: SelectWithEmpty(priorityEnum).default(''),
  search: z
    .string()
    .trim()
    .max(100, { message: 'Busca muito longa (máx. 100)' })
    .refine((val) => val === '' || val.length >= 2, {
      message: 'Digite pelo menos 2 caracteres',
    })
    .default(''),
});

export type ProjectsFiltersSchema = z.infer<typeof projectsFiltersSchema>;
export type ProjectsFiltersFormValues = z.input<typeof projectsFiltersSchema>;
