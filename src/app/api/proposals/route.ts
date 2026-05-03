import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createProposal, findUserByEmail } from '@/lib/mock/db';

const createProposalSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  submissionDate: z.string().optional(),
  status: z.string().optional(),
  attachments: z.union([z.string(), z.array(z.any())]).optional(),
  optionalContactPhone: z.string().optional(),
  optionalContactPhoneIsWhats: z.boolean().optional(),
  optionalContactEmail: z.string().email().optional(),
  authorEmail: z.string().email('Email do autor é obrigatório'),
});

const normalizeStatus = (status?: string) => {
  const normalized = (status || 'SUBMITTED').trim().toUpperCase();

  switch (normalized) {
    case 'SUBMITTED':
    case 'PENDENTE':
      return 'pendente';
    case 'ANALYSIS':
    case 'UNDER_REVIEW':
    case 'EM_ANALISE':
      return 'em_analise';
    case 'APPROVED':
    case 'APROVADA':
      return 'aprovada';
    case 'REJECTED':
    case 'REJEITADA':
      return 'rejeitada';
    case 'AWAITING_INFO':
    case 'AGUARDANDO_INFO':
      return 'aguardando_info';
    case 'ASSIGNED':
    case 'ATRIBUIDA':
      // map assigned/atribuida to an existing ProjectStatus
      return 'em_desenvolvimento';
    default:
      return 'pendente';
  }
};

const parseAttachments = (attachments?: string | unknown[]) => {
  if (!attachments) {
    return null;
  }

  if (Array.isArray(attachments)) {
    return attachments as any;
  }

  try {
    const parsed = JSON.parse(attachments as string);
    if (Array.isArray(parsed)) {
      return parsed;
    }

    if (typeof parsed === 'string' && parsed.trim()) {
      return [
        {
          key: `inline/${Date.now()}`,
          name: 'Anexo',
          size: 0,
          type: 'application/octet-stream',
          url: parsed,
          uploadedAt: new Date().toISOString(),
        },
      ];
    }
  } catch {
    const raw = String(attachments).trim();
    if (raw) {
      return [
        {
          key: `inline/${Date.now()}`,
          name: 'Anexo',
          size: 0,
          type: 'application/octet-stream',
          url: raw,
          uploadedAt: new Date().toISOString(),
        },
      ];
    }
  }

  return null;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createProposalSchema.parse(body);

    const user = findUserByEmail(payload.authorEmail);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const created = createProposal({
      id_usuario: user.id_usuario,
      titulo: payload.title,
      descricao: payload.description,
      status: normalizeStatus(payload.status),
      anexos: parseAttachments(payload.attachments),
      email_contato_opcional: payload.optionalContactEmail,
      telefone_contato_opcional: payload.optionalContactPhone,
      telefone_contato_opcional_is_whats: payload.optionalContactPhoneIsWhats ?? false,
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar proposta';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
