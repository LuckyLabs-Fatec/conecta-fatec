import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Project, ProjectStatus } from '@/domain/projects/types';
import { Proposal, ProposalStatus } from '@/domain/proposals/types';
import http from '@/presentation/lib/http';

const API_PROJECTS = '/projects';
const API_PROPOSALS = '/proposals';
const API_MY_PROPOSALS = '/proposals/mine';

type ApiListResponse<T> = {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

type ApiProject = {
  id: string;
  title: string;
  description: string;
  deadline?: string | null;
  status: string;
};

type ApiProposal = {
  id: string;
  title: string;
  description: string;
  submissionDate: string;
  status: string;
  attachments?: string | null;
  user?: {
    email?: string | null;
    name?: string | null;
  };
};

type DashboardTab = 'proposals' | 'projects';

type DashboardQueryResult = {
  projects: Project[];
  proposals: Proposal[];
  total: number;
  totalPages: number;
};

type UseProjectsDashboardOptions = {
  activeTab: DashboardTab;
  canListProjects: boolean;
  canListAllProposals: boolean;
  enabled: boolean;
  hasUser: boolean;
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
};

type AssignmentData = unknown;

const normalizeProjectStatus = (status: string): ProjectStatus => {
  const normalized = status.trim().toLowerCase();

  switch (normalized) {
    case 'active':
    case 'em_desenvolvimento':
      return 'em_desenvolvimento';
    case 'completed':
    case 'concluido':
      return 'concluido';
    case 'suspended':
    case 'suspenso':
      return 'suspenso';
    case 'approved':
    case 'aprovado':
      return 'aprovado';
    case 'rejected':
    case 'rejeitado':
      return 'rejeitado';
    case 'under_review':
    case 'em_analise':
      return 'em_analise';
    case 'testing':
    case 'testando':
      return 'testando';
    case 'awaiting_review':
    case 'aguardando_revisao':
      return 'aguardando_revisao';
    default:
      return 'pendente';
  }
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

const mapProject = (item: ApiProject): Project => {
  const status = normalizeProjectStatus(item.status);

  return {
    id: item.id,
    title: item.title,
    description: item.description,
    status,
    startDate: undefined,
    expectedEndDate: item.deadline ?? undefined,
    progress: status === 'concluido' ? 100 : 0,
    images: [],
    updates: [],
  };
};

const mapProposal = (item: ApiProposal): Proposal => ({
  id: item.id,
  title: item.title,
  description: item.description,
  status: normalizeProposalStatus(item.status),
  submittedBy: {
    name: item.user?.name ?? item.user?.email ?? 'Anônimo',
    email: item.user?.email ?? 'N/A',
  },
  submittedAt: item.submissionDate,
  images: [],
  mediatorNotes: '',
  coordinatorNotes: '',
});

const fetchAllPages = async <T>(endpoint: string): Promise<T[]> => {
  const firstPage = await http.get<ApiListResponse<T>>(endpoint, {
    params: { page: 1, limit: 100 },
  });
  const items = [...firstPage.data.items];

  for (let currentPage = 2; currentPage <= Number(firstPage.data.totalPages); currentPage += 1) {
    const page = await http.get<ApiListResponse<T>>(endpoint, {
      params: { page: currentPage, limit: 100 },
    });
    items.push(...page.data.items);
  }

  return items;
};

const listDashboardData = async ({
  activeTab,
  canListProjects,
  canListAllProposals,
  hasUser,
  page,
  pageSize,
  search,
  status,
}: UseProjectsDashboardOptions): Promise<DashboardQueryResult> => {
  if (!hasUser) {
    throw new Error('Faça login para visualizar os dados.');
  }

  if (activeTab === 'projects') {
    if (!canListProjects) {
      throw new Error('Seu perfil não tem permissão para listar projetos.');
    }

    if (search || status) {
      const projects = (await fetchAllPages<ApiProject>(API_PROJECTS)).map(mapProject);
      const normalizedSearch = search?.toLowerCase();
      const filtered = projects.filter((project) => {
        const matchesSearch = !normalizedSearch
          || project.title.toLowerCase().includes(normalizedSearch)
          || project.description.toLowerCase().includes(normalizedSearch);
        const matchesStatus = !status || project.status === status;
        return matchesSearch && matchesStatus;
      });
      const start = (page - 1) * pageSize;

      return {
        projects: filtered.slice(start, start + pageSize),
        proposals: [],
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / pageSize),
      };
    }

    const response = await http.get<ApiListResponse<ApiProject>>(API_PROJECTS, {
      params: {
        page,
        limit: pageSize,
      },
    });

    return {
      projects: response.data.items.map(mapProject),
      proposals: [],
      total: Number(response.data.totalItems),
      totalPages: Number(response.data.totalPages),
    };
  }

  const endpoint = canListAllProposals ? API_PROPOSALS : API_MY_PROPOSALS;

  if (search || status) {
    const proposals = (await fetchAllPages<ApiProposal>(endpoint)).map(mapProposal);
    const normalizedSearch = search?.toLowerCase();
    const filtered = proposals.filter((proposal) => {
      const matchesSearch = !normalizedSearch
        || proposal.title.toLowerCase().includes(normalizedSearch)
        || proposal.description.toLowerCase().includes(normalizedSearch);
      const matchesStatus = !status || proposal.status === status;
      return matchesSearch && matchesStatus;
    });
    const start = (page - 1) * pageSize;

    return {
      projects: [],
      proposals: filtered.slice(start, start + pageSize),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }

  const response = await http.get<ApiListResponse<ApiProposal>>(endpoint, {
    params: { page, limit: pageSize },
  });

  return {
    projects: [],
    proposals: response.data.items.map(mapProposal),
    total: Number(response.data.totalItems),
    totalPages: Number(response.data.totalPages),
  };
};

export const useProjectsDashboard = (options: UseProjectsDashboardOptions) => {
  const queryClient = useQueryClient();
  const queryKey = ['projects-dashboard', options] as const;
  const dashboardQuery = useQuery({
    queryKey,
    enabled: options.enabled,
    queryFn: () => listDashboardData(options),
  });

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ['projects-dashboard'] });
  };

  const updateProjectStatusMutation = useMutation({
    mutationFn: async ({ projectId, status }: { projectId: string; status: ProjectStatus }) => {
      await http.put(`${API_PROJECTS}/${projectId}`, { status });
    },
    onSuccess: invalidateDashboard,
  });

  const updateProposalStatusMutation = useMutation({
    mutationFn: async ({ proposalId, status, message }: { proposalId: string; status: ProposalStatus; message?: string }) => {
      await http.put(`${API_PROPOSALS}/${proposalId}`, {
        status,
        mediatorNotes: message,
      });
    },
    onSuccess: invalidateDashboard,
  });

  const assignProposalMutation = useMutation({
    mutationFn: async ({ proposalId, assignmentData }: { proposalId: string; assignmentData: AssignmentData }) => {
      await http.put(`${API_PROPOSALS}/${proposalId}`, {
        status: 'atribuida',
        assignedTo: assignmentData,
      });
    },
    onSuccess: invalidateDashboard,
  });

  return {
    projects: dashboardQuery.data?.projects ?? [],
    proposals: dashboardQuery.data?.proposals ?? [],
    total: dashboardQuery.data?.total ?? 0,
    totalPages: dashboardQuery.data?.totalPages ?? 1,
    loading: dashboardQuery.isLoading || dashboardQuery.isFetching,
    error: dashboardQuery.error instanceof Error ? dashboardQuery.error.message : null,
    updateProjectStatus: updateProjectStatusMutation.mutateAsync,
    updateProposalStatus: updateProposalStatusMutation.mutateAsync,
    assignProposal: assignProposalMutation.mutateAsync,
  };
};
