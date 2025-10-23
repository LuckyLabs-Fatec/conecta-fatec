import { NextResponse } from 'next/server';

type Status = 'em_analise' | 'em_desenvolvimento' | 'testando' | 'concluido' | 'suspenso';
type Priority = 'baixa' | 'media' | 'alta' | 'urgente';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    neighborhood: string;
    city: string;
  };
  status: Status;
  priority: Priority;
  student: {
    name: string;
    course: string;
    semester: string;
  };
  startDate: string;
  expectedEndDate: string;
  progress: number;
  affectedPeople: string;
  images: string[];
  updates: Array<{
    id: string;
    date: string;
    message: string;
    author: string;
  }>;
}

// Base seed items to generate a larger mocked dataset
const seed: Project[] = [
  {
    id: '1',
    title: 'Aplicativo para Coleta Seletiva',
    description:
      'App mobile para facilitar a coleta seletiva com mapeamento de pontos e agendamento.',
    category: 'ambiente',
    location: { address: 'Rua das Flores, 123', neighborhood: 'Centro', city: 'Votorantim' },
    status: 'em_desenvolvimento',
    priority: 'alta',
    student: {
      name: 'Ana Silva',
      course: 'Análise e Desenvolvimento de Sistemas',
      semester: '4º semestre',
    },
    startDate: '2024-03-15',
    expectedEndDate: '2024-07-15',
    progress: 65,
    affectedPeople: 'Aproximadamente 500 famílias do bairro Centro',
    images: [
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop',
    ],
    updates: [
      { id: '1', date: '2024-06-01', message: 'Interface principal concluída', author: 'Ana Silva' },
      { id: '2', date: '2024-05-15', message: 'Mapeamento de pontos finalizado', author: 'Ana Silva' },
    ],
  },
  {
    id: '2',
    title: 'Monitoramento de Iluminação Pública',
    description: 'Sistema IoT para monitorar falhas na iluminação com alertas em tempo real.',
    category: 'infraestrutura',
    location: { address: 'Av. Principal', neighborhood: 'Vila Nova', city: 'Votorantim' },
    status: 'testando',
    priority: 'media',
    student: {
      name: 'Carlos Oliveira',
      course: 'Sistemas Embarcados',
      semester: '6º semestre',
    },
    startDate: '2024-02-01',
    expectedEndDate: '2024-08-01',
    progress: 85,
    affectedPeople: 'Moradores da Vila Nova (cerca de 1.200 pessoas)',
    images: ['https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop'],
    updates: [{ id: '1', date: '2024-06-10', message: 'Iniciados testes de campo', author: 'Carlos Oliveira' }],
  },
  {
    id: '3',
    title: 'Plataforma de Carona Solidária',
    description: 'Plataforma web para conectar pessoas que oferecem e precisam de carona.',
    category: 'transporte',
    location: { address: 'Toda a cidade', neighborhood: 'Todos os bairros', city: 'Votorantim' },
    status: 'concluido',
    priority: 'media',
    student: {
      name: 'Marina Santos',
      course: 'Análise e Desenvolvimento de Sistemas',
      semester: '5º semestre',
    },
    startDate: '2024-01-10',
    expectedEndDate: '2024-05-10',
    progress: 100,
    affectedPeople: 'Potencialmente toda a população de Votorantim',
    images: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop'],
    updates: [{ id: '1', date: '2024-05-10', message: 'Projeto concluído', author: 'Marina Santos' }],
  },
];

// Generate a larger list using the seed for pagination demo
const DATASET: Project[] = Array.from({ length: 42 }).map((_, i) => {
  const base = seed[i % seed.length];
  const id = (i + 1).toString();
  const progress = Math.min(100, Math.max(5, base.progress + ((i % 7) - 3) * 5));
  const statusPool: Status[] = ['em_analise', 'em_desenvolvimento', 'testando', 'concluido', 'suspenso'];
  const priorityPool: Priority[] = ['baixa', 'media', 'alta', 'urgente'];
  return {
    ...base,
    id,
    title: `${base.title} #${id}`,
    progress,
    status: statusPool[i % statusPool.length],
    priority: priorityPool[(i + 1) % priorityPool.length],
  };
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = Math.min(24, Math.max(1, Number(searchParams.get('pageSize')) || 6));

  const status = searchParams.get('status') || '';
  const category = searchParams.get('category') || '';
  const priority = searchParams.get('priority') || '';
  const search = (searchParams.get('search') || '').toLowerCase();

  let filtered = DATASET.slice();
  if (status) filtered = filtered.filter(p => p.status === status);
  if (category) filtered = filtered.filter(p => p.category === category);
  if (priority) filtered = filtered.filter(p => p.priority === priority);
  if (search) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.student.name.toLowerCase().includes(search)
    );
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return NextResponse.json({ data, page, pageSize, total, totalPages });
}
