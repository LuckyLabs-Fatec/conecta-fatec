
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

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

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({ name, value: '', ...options })
        },
      },
    }
  );

  const updates: { nome?: string; telefone?: string; telefone_is_whats?: boolean; perfil?: string } = {};
  if (name !== undefined) updates.nome = name;
  if (phone !== undefined) updates.telefone = phone;
  if (phone_is_whats !== undefined) updates.telefone_is_whats = phone_is_whats;
  if (role !== undefined) updates.perfil = role;

  const { error: dbError } = await supabase
    .from('usuario')
    .update(updates)
    .eq('uid', id);

  if (dbError) {
    console.error('Error updating user profile in public.usuario:', dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return NextResponse.json({ error: 'Unauthorized or user not found' }, { status: 401 });
  }

  const userMetadataUpdates: { name?: string; avatar?: string; role?: string } = {};
  if (name !== undefined) userMetadataUpdates.name = name;
  if (avatar !== undefined) userMetadataUpdates.avatar = avatar;
  if (role !== undefined) userMetadataUpdates.role = role;

  if (Object.keys(userMetadataUpdates).length > 0) {
    const { error: metadataError } = await supabase.auth.updateUser({
      data: userMetadataUpdates
    });

    if (metadataError) {
      console.error('Error updating user metadata:', metadataError);
      // TODO: Melhorar error handling
      return NextResponse.json({ error: metadataError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'User profile updated successfully' }, { status: 200 });
}
