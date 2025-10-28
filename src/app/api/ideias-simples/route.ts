import { NextResponse } from 'next/server';

type Idea = {
  id: string;
  titulo: string;
  descricao: string;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'aguardando_info';
  autor: string;
  createdAt: string;
};

const IDEIAS: Idea[] = [
  {
    id: '1',
    titulo: 'Horta comunitária no bairro',
    descricao: 'Criação de horta compartilhada para educação ambiental.',
    status: 'pendente',
    autor: 'Maria Silva',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    titulo: 'Iluminação inteligente em praças',
    descricao: 'Sensores para reduzir consumo e aumentar segurança.',
    status: 'em_analise',
    autor: 'João Santos',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    titulo: 'Coleta seletiva em escolas',
    descricao: 'Programa educativo com coleta seletiva nas escolas municipais.',
    status: 'aprovada',
    autor: 'Ana Souza',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(IDEIAS);
}
