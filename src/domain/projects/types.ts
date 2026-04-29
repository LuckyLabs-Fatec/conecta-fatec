export type ProjectStatus = 'em_analise' | 'em_desenvolvimento' | 'testando' | 'concluido' | 'suspenso' | 'aprovado' | 'rejeitado' | 'aguardando_revisao' | 'pendente';

export interface ProjectUpdate {
  id: string;
  date: string;
  message: string;
  author: string;
}

export interface ProjectStudent {
  name: string;
  course: string;
  semester: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  student?: ProjectStudent;
  startDate?: string;
  expectedEndDate?: string;
  progress: number;
  images: string[];
  updates: ProjectUpdate[];
  assignedTo?: {
    mediatorId?: string;
    coordinatorId?: string;
    studentIds?: string[];
  };
}
