import { z } from 'zod';

export const suggestionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  attachments: z.array(z.instanceof(File)).max(5).optional(),
  contact: z.object({
    primaryEmail: z.string().email('Email principal inválido'),
    secondaryEmail: z.union([z.string().email('Email opcional inválido'), z.literal('')]).optional(),
    primaryPhone: z.string()
      .min(10, 'Telefone deve ter no mínimo 10 dígitos')
      .max(11, 'Telefone deve ter no máximo 11 dígitos')
      .regex(/^\d+$/, 'Telefone deve conter apenas números'),
    secondaryPhone: z.union([
      z.string()
        .min(10, 'Telefone deve ter no mínimo 10 dígitos')
        .max(11, 'Telefone deve ter no máximo 11 dígitos')
        .regex(/^\d+$/, 'Telefone deve conter apenas números'),
      z.literal('')
    ]).optional(),
    details: z.union([z.string(), z.literal('')]).optional(),
    primaryPhoneIsWhatsapp: z.boolean().default(false),
    secondaryPhoneIsWhatsapp: z.boolean().optional().default(false),
  }),
});

export const suggestionSchemaServer = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  attachments: z.array(z.object({
    key: z.string(),
    name: z.string(),
    size: z.number(),
    type: z.string(),
    url: z.string(),
    uploadedAt: z.string(),
  })).optional(),
  contact: z.object({
    primaryEmail: z.string().email('Email principal inválido'),
    secondaryEmail: z.union([z.string().email('Email opcional inválido'), z.literal('')]).optional(),
    primaryPhone: z.string()
      .min(10, 'Telefone deve ter no mínimo 10 dígitos')
      .max(11, 'Telefone deve ter no máximo 11 dígitos')
      .regex(/^\d+$/, 'Telefone deve conter apenas números'),
    secondaryPhone: z.union([
      z.string()
        .min(10, 'Telefone deve ter no mínimo 10 dígitos')
        .max(11, 'Telefone deve ter no máximo 11 dígitos')
        .regex(/^\d+$/, 'Telefone deve conter apenas números'),
      z.literal('')
    ]).optional(),
    details: z.union([z.string(), z.literal('')]).optional(),
    primaryPhoneIsWhatsapp: z.boolean().default(false),
    secondaryPhoneIsWhatsapp: z.boolean().optional().default(false),
  }),
});

export type SuggestionSchema = z.infer<typeof suggestionSchema>;
export type SuggestionSchemaServer = z.infer<typeof suggestionSchemaServer>;
