import { z } from 'zod';

export const loginSchema = z.object({
  userType: z.enum(['comunidade', 'mediador', 'coordenacao']).default('comunidade'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export type LoginSchema = z.infer<typeof loginSchema>;
