import { z } from 'zod';

export const suggestionSchema = z.object({
  category: z.string().min(1, 'Selecione uma categoria'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  location: z.object({
    address: z.string().min(1, 'Endereço é obrigatório'),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1).optional(),
    coordinates: z
      .object({ lat: z.number(), lng: z.number() })
      .optional(),
  }),
  affectedPeople: z.string().min(1, 'Informe quantas pessoas serão beneficiadas'),
  frequency: z.enum(['unica', 'semanal', 'diaria', 'constante']).default('unica'),
  images: z.array(z.instanceof(File)).max(5).optional(),
  contactInfo: z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    allowContact: z.boolean().default(true),
  }),
});

export type SuggestionSchema = z.infer<typeof suggestionSchema>;
