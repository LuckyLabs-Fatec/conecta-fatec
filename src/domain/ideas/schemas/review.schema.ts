import { z } from 'zod';

export const reviewActionEnum = ['approve', 'reject', 'request_info'] as const;
export type ReviewAction = typeof reviewActionEnum[number];

export const reviewSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('approve'),
    message: z.string().trim().max(500).optional(),
  }),
  z.object({
    action: z.literal('reject'),
    message: z.string().trim().min(5, 'Explique o motivo da rejeição (mín. 5 caracteres)').max(500),
  }),
  z.object({
    action: z.literal('request_info'),
    message: z.string().trim().min(10, 'Descreva as informações solicitadas (mín. 10 caracteres)').max(500),
  }),
]);

export type ReviewSchema = z.infer<typeof reviewSchema>;
