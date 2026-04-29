import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createUser, findUserByEmail, updateUser } from '@/lib/mock/db';

const userProfileSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  phone: z.string().optional(),
  role: z.enum(['comunidade', 'mediador', 'coordenador', 'estudante', 'admin']),
  uid: z.uuid(),
});

const updatePhoneSchema = z.object({
  phone: z.string().min(10).max(11),
  phone_is_whats: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const validation = userProfileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { name, email, phone, role, uid } = validation.data;

  const data = createUser({ name, email, phone, role, uid });

  return NextResponse.json({ message: 'User profile created successfully', data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const validation = updatePhoneSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { phone, phone_is_whats } = validation.data;
  const email = req.headers.get('x-mock-user-email') || req.nextUrl.searchParams.get('email');
  const user = findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = updateUser(user.uid, {
    telefone: phone,
    telefone_is_whats: phone_is_whats ?? false,
  });

  return NextResponse.json({ message: 'User profile updated successfully', data }, { status: 200 });
}
