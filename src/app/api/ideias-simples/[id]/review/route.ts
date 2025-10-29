import { NextRequest, NextResponse } from 'next/server';
import { reviewSchema } from '@/domain/ideas/schemas/review.schema';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { action, message } = parsed.data;
  const newStatus = action === 'approve' ? 'aprovada' : action === 'reject' ? 'rejeitada' : 'aguardando_info';

  // Sem persistência: apenas ecoa o resultado
  return NextResponse.json({ id, status: newStatus, message: message ?? null });
}
