import { NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Import types from domain to ensure consistency
import { Project, ProjectStatus } from '@/domain/projects/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(24, Math.max(1, Number(searchParams.get('pageSize')) || 6));

  const status = searchParams.get('status') || '';
  const search = (searchParams.get('search') || '').toLowerCase();

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

  // Build the query
  let query = supabase
    .from('proposta')
    .select('*, usuario(nome, perfil)', { count: 'exact' });

  // Filter for project statuses only
  // Projects are those that are NOT in initial proposal stages
  const projectStatuses = ['em_desenvolvimento', 'testando', 'concluido', 'suspenso', 'atribuida'];

  if (status) {
    query = query.eq('status', status);
  } else {
    // If no specific status requested, filter to show only project statuses
    query = query.in('status', projectStatuses);
  }

  if (search) {
    query = query.or(`titulo.ilike.%${search}%,descricao.ilike.%${search}%`);
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Map to Project interface
  const projects: Project[] = data.map((item: any) => {
    // Parse attachments if any
    const images = item.anexos
      ? (Array.isArray(item.anexos) ? item.anexos.map((a: any) => a.url) : [])
      : [];

    return {
      id: (item.id || item.id_proposta || '').toString(),
      title: item.titulo,
      description: item.descricao,
      status: (item.status as ProjectStatus) || 'em_analise',
      student: item.usuario ? {
        name: item.usuario.nome, // Using author as student/responsible for now
        course: 'Não informado',
        semester: 'Não informado'
      } : undefined,
      startDate: item.created_at, // Using creation date
      expectedEndDate: undefined,
      progress: 0, // Placeholder
      images: images,
      updates: [] // Placeholder
    };
  });

  return NextResponse.json({
    data: projects,
    page,
    pageSize,
    total: count || 0,
    totalPages: Math.ceil((count || 0) / pageSize)
  });
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
    const { id, status, updateMessage } = body;

    // Log unused variable for now
    console.log('Update message:', updateMessage);

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (status) updateData.status = status;

    // If there's an update message, we might want to store it.
    // For now, just updating status.

    const { data, error } = await supabase
      .from('proposta')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing PUT request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
