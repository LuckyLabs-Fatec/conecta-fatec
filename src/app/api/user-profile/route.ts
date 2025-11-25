
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const userProfileSchema = z.object({
  name: z.string().min(1),
  email: z.email().min(1),
  phone: z.string().optional(),
  role: z.enum(['comunidade', 'mediador', 'coordenador', 'estudante']),
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

  const { data, error } = await supabase
    .from('usuario')
    .insert([
      {
        nome: name,
        email: email,
        telefone: phone || '',
        telefone_is_whats: false,
        ativo: true,
        perfil: role,
        uid: uid,
      },
    ]);

  if (error) {
    console.error('Error inserting user profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'User profile created successfully', data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const validation = updatePhoneSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { phone, phone_is_whats } = validation.data;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updateData: { telefone: string; telefone_is_whats?: boolean } = {
    telefone: phone,
  };

  if (phone_is_whats !== undefined) {
    updateData.telefone_is_whats = phone_is_whats;
  }

  const { data, error } = await supabase
    .from('usuario')
    .update(updateData)
    .eq('email', user.email)
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await supabase.auth.updateUser({
    data: {
      phone: phone,
      phone_is_whats: phone_is_whats ?? false,
    }
  });

  return NextResponse.json({ message: 'User profile updated successfully', data }, { status: 200 });
}
