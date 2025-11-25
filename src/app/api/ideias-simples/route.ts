import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { suggestionSchemaServer } from '@/domain/ideas/schemas/suggestion.schema';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

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

  if (id) {
    const { data, error } = await supabase
      .from('proposta')
      .select('*, usuario(nome, email)')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching idea by ID:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 });
    }
    return NextResponse.json({
      ...data,
      autor: data.usuario?.nome || 'Anônimo'
    });
  }

  const { data, error } = await supabase
    .from('proposta')
    .select('*, usuario(nome, email)');

  if (error) {
    console.error('Error fetching ideas:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const mappedData = data.map((item: any) => ({
    ...item,
    autor: item.usuario?.nome || 'Anônimo'
  }));

  return NextResponse.json(mappedData);
}

export async function POST(request: Request) {
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

  try {
    const body = await request.json();
    const validatedData = suggestionSchemaServer.parse(body);

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, contact } = validatedData;

    const { data: userData, error: userError } = await supabase
      .from('usuario')
      .select('id_usuario')
      .eq('email', user.email)
      .single();

    if (userError || !userData) {
      console.error('Error fetching user:', userError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let finalDescription = description;
    if (contact.details && contact.details.trim()) {
      finalDescription += `\n\nInformações de contato:\n${contact.details}`;
    }

    const insertData: any = {
      id_usuario: userData.id_usuario,
      titulo: title,
      descricao: finalDescription,
      status: 'pendente',
      anexos: validatedData.attachments || null,
    };

    if (contact.secondaryEmail && contact.secondaryEmail.trim()) {
      insertData.email_contato_opcional = contact.secondaryEmail;
    }

    if (contact.secondaryPhone && contact.secondaryPhone.trim()) {
      insertData.telefone_contato_opcional = contact.secondaryPhone;
      insertData.telefone_contato_opcional_is_whats = contact.secondaryPhoneIsWhatsapp || false;
    }

    const { data: newIdea, error } = await supabase
      .from('proposta')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Error inserting new idea:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(newIdea, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Validation or processing error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('An unexpected error occurred:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
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

  try {
    const body = await request.json();
    const { id, status, mediatorNotes, coordinatorNotes, assignedTo } = body;

    console.log('Update details:', { mediatorNotes, coordinatorNotes, assignedTo });

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;

    const { data, error } = await supabase
      .from('proposta')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating idea:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing PUT request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
