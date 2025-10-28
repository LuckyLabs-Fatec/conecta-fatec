import { NextResponse } from 'next/server';

export type CoordProjetoStatus = 'aprovada' | 'validada' | 'direcionada' | 'backlog';

export interface CoordProjeto {
  id: string;
  titulo: string;
  descricao: string;
  status: CoordProjetoStatus;
  curso?: string;
  turma?: string;
  semestre?: string;
  professor?: string;
}

const PROJETOS: CoordProjeto[] = [
  {
    id: '101',
    titulo: 'Horta comunitária no bairro',
    descricao: 'Projeto de extensão com foco em educação ambiental.',
    status: 'aprovada',
  },
  {
    id: '102',
    titulo: 'Iluminação inteligente em praças',
    descricao: 'Sensores e automação para consumo eficiente.',
    status: 'aprovada',
  },
  {
    id: '103',
    titulo: 'Coleta seletiva em escolas',
    descricao: 'Programa educativo com coleta seletiva.',
    status: 'aprovada',
  },
];

export async function GET() {
  return NextResponse.json(PROJETOS);
}
