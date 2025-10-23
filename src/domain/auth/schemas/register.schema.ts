import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(1, 'Nome completo é obrigatório'),
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  userType: z.enum(['comunidade', 'mediador', 'coordenacao']).default('comunidade'),
  department: z.string().optional(),
  specialization: z.string().optional(),
  agreeToTerms: z.boolean().refine(v => v === true, 'Você deve aceitar os termos e condições')
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword']
});

export type RegisterSchema = z.infer<typeof registerSchema>;
