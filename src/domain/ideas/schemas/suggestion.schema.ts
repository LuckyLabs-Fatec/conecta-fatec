import { z } from 'zod';

// New two-step schema: details + contact
export const suggestionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  attachments: z.array(z.instanceof(File)).max(5).optional(),
  contact: z.object({
    primaryEmail: z.string().email('Email principal inválido'),
    // Allow empty string for optional fields coming from inputs
    secondaryEmail: z.union([z.string().email('Email opcional inválido'), z.literal('')]).optional(),
    primaryPhone: z.string().min(1, 'Telefone principal é obrigatório'),
    secondaryPhone: z.union([z.string(), z.literal('')]).optional(),
    details: z.union([z.string(), z.literal('')]).optional(),
    primaryPhoneIsWhatsapp: z.boolean().default(false),
    secondaryPhoneIsWhatsapp: z.boolean().optional().default(false),
  }),
});

export type SuggestionSchema = z.infer<typeof suggestionSchema>;
