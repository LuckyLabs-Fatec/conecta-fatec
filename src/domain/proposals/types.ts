export type ProposalStatus = 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'aguardando_info' | 'atribuida';

export interface Proposal {
  id: string;
  title: string;
  description: string;
  status: ProposalStatus;
  submittedBy: {
    name: string;
    email: string;
    phone?: string;
  };
  submittedAt: string;
  images: string[];
  mediatorNotes?: string;
  coordinatorNotes?: string;
  assignedTo?: {
    class: string;
    semester: string;
    course: string;
    professor: string;
  };
}
