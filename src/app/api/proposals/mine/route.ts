import { NextResponse } from 'next/server';

import { listProposals } from '@/lib/mock/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get('email') || '').toLowerCase();

  const proposals = listProposals().filter((proposal) => {
    if (!email) {
      return true;
    }

    return proposal.usuario?.email.toLowerCase() === email;
  });

  const items = proposals.map((item) => ({
    id: item.id,
    title: item.titulo,
    description: item.descricao,
    submissionDate: item.created_at,
    status: item.status,
    attachments: item.anexos ? JSON.stringify(item.anexos) : '',
    optionalContactPhone: item.telefone_contato_opcional,
    optionalContactPhoneIsWhats: item.telefone_contato_opcional_is_whats ?? false,
    optionalContactEmail: item.email_contato_opcional,
    user: {
      id: item.usuario?.email || item.id_usuario.toString(),
      email: item.usuario?.email || '',
      name: item.usuario?.nome || 'Anônimo',
      avatar: null,
      role: item.usuario?.perfil || 'comunidade',
    },
  }));

  return NextResponse.json({
    items,
    page: 1,
    limit: items.length,
    totalItems: items.length,
    totalPages: 1,
  });
}
