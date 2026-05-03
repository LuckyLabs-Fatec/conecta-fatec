import { useQuery } from '@tanstack/react-query';
import http from '@/presentation/lib/http';
import { Proposal, ProposalStatus } from '@/domain/proposals/types';

const API_MY_PROPOSALS = '/proposals/mine';

type ProposalApiAuthor = {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  role: string;
};

type ProposalApiItem = {
  id: string;
  title: string;
  description: string;
  submissionDate: string;
  status: string;
  attachments: string;
  optionalContactPhone?: string;
  optionalContactPhoneIsWhats: boolean;
  optionalContactEmail?: string;
  user: ProposalApiAuthor;
};

type ProposalApiResponse = {
  items: ProposalApiItem[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

const normalizeProposalStatus = (status: string): ProposalStatus => {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case 'submitted':
    case 'pendente':
      return 'pendente';
    case 'analysis':
    case 'under_review':
    case 'em_analise':
      return 'em_analise';
    case 'approved':
    case 'aprovada':
      return 'aprovada';
    case 'rejected':
    case 'rejeitada':
      return 'rejeitada';
    case 'awaiting_info':
    case 'aguardando_info':
      return 'aguardando_info';
    case 'assigned':
    case 'atribuida':
      return 'atribuida';
    default:
      return 'pendente';
  }
};

const mapProposal = (item: ProposalApiItem): Proposal => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: normalizeProposalStatus(item.status),
  submittedBy: {
    name: item.user.name ?? item.user.email,
    email: item.user.email,
  },
  submittedAt: item.submissionDate,
  images: [],
  mediatorNotes: '',
  coordinatorNotes: '',
});

interface UseMyProposalsOptions {
  enabled?: boolean;
}

interface UseMyProposalsResult {
  proposals: Proposal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useMyProposals = ({ enabled = true }: UseMyProposalsOptions = {}): UseMyProposalsResult => {
  const query = useQuery({
    queryKey: ['my-proposals'],
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    retry: 2,
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await http.get<ProposalApiResponse>(API_MY_PROPOSALS, {
        params: {
          page: 1,
          limit: 100,
        },
      });

      return response.data.items.map(mapProposal);
    },
  });

  return {
    proposals: query.data ?? [],
    loading: query.isLoading || query.isFetching,
    error: query.error instanceof Error ? query.error.message : null,
    refetch: () => {
      query.refetch();
    },
  };
};
