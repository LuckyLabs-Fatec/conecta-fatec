import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { updateUser } from '@/lib/mock/db';

const userProfileUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  avatar: z.union([z.string().url(), z.literal('')]).optional(),
  phone: z.string().optional(),
  phone_is_whats: z.boolean().optional(),
  role: z.enum(['comunidade', 'mediador', 'coordenador', 'estudante', 'admin']).optional(),
});

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params.id as string;
  const body = await req.json();
  const validation = userProfileUpdateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { name, avatar, phone, phone_is_whats, role } = validation.data;

  const updates: {
    nome?: string;
    telefone?: string;
    telefone_is_whats?: boolean;
    perfil?: 'comunidade' | 'mediador' | 'coordenador' | 'estudante' | 'admin';
    avatar?: string;
  } = {};
  if (name !== undefined) updates.nome = name;
  if (phone !== undefined) updates.telefone = phone;
  if (phone_is_whats !== undefined) updates.telefone_is_whats = phone_is_whats;
  if (role !== undefined) updates.perfil = role;
  if (avatar !== undefined) updates.avatar = avatar;

  const data = updateUser(id, updates);

  if (!data) {
    return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'User profile updated successfully', data }, { status: 200 });
}
