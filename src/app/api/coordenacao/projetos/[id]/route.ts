import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const action = body?.action as 'validar' | 'direcionar' | 'backlog' | undefined;

  if (!action) {
    return NextResponse.json({ error: 'Ação não informada' }, { status: 400 });
  }

  if (action === 'direcionar') {
    const { curso, turma, semestre, professor } = body ?? {};
    if (!curso || !turma || !semestre || !professor) {
      return NextResponse.json({ error: 'Campos obrigatórios para direcionar: curso, turma, semestre, professor' }, { status: 400 });
    }
    return NextResponse.json({ id, status: 'direcionada', curso, turma, semestre, professor });
  }

  if (action === 'validar') {
    return NextResponse.json({ id, status: 'validada' });
  }

  if (action === 'backlog') {
    return NextResponse.json({ id, status: 'backlog' });
  }

  return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
}
