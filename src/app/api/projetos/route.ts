import { NextResponse } from 'next/server';

import { listProposals, toProject, updateProposal } from '@/lib/mock/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(24, Math.max(1, Number(searchParams.get('pageSize')) || 6));

  const status = searchParams.get('status') || '';
  const search = (searchParams.get('search') || '').toLowerCase();

  const projectStatuses = ['em_desenvolvimento', 'testando', 'concluido', 'suspenso', 'atribuida'];
  const filteredProjects = listProposals().filter((proposal) => {
    const matchesStatus = status
      ? proposal.status === status
      : projectStatuses.includes(proposal.status);
    const matchesSearch = !search
      || proposal.titulo.toLowerCase().includes(search)
      || proposal.descricao.toLowerCase().includes(search);

    return matchesStatus && matchesSearch;
  });

  const from = (page - 1) * pageSize;
  const to = from + pageSize;
  const projects = filteredProjects.slice(from, to).map(toProject);

  return NextResponse.json({
    data: projects,
    page,
    pageSize,
    total: filteredProjects.length,
    totalPages: Math.ceil(filteredProjects.length / pageSize)
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status, updateMessage } = body;

    console.log('Update message:', updateMessage);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const data = updateProposal(id, status ? { status } : {});

    if (!data) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing PUT request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
