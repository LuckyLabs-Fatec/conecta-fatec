'use client';
import { useState, useEffect } from 'react';
import { Header, useToast } from "@/presentation/components";
import { Filter, Search, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectsFiltersSchema, type ProjectsFiltersFormValues } from "@/domain/projects/schemas/filters.schema";
import { usePagination } from "@/presentation/hooks/usePagination";
import http from '@/presentation/lib/http';
import { Pagination } from "@/presentation/components";
import { Project, ProjectStatus } from "@/domain/projects/types";
import { ProjectCard } from "@/presentation/components/molecules/ProjectCard";
import { ProjectModal } from "@/presentation/components/organisms/ProjectModal";
import { Proposal, ProposalStatus } from "@/domain/proposals/types";
import { ProposalList } from "@/presentation/components/organisms/ProposalList";
import { ProposalModal } from "@/presentation/components/organisms/ProposalModal";
import { DashboardTabs } from "@/presentation/components/organisms/DashboardTabs";
import { useAuth } from "@/presentation/hooks/useAuth";

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

const statusConfig: Record<ProjectStatus, { label: string }> = {
    em_analise: { label: 'Em Análise' },
    em_desenvolvimento: { label: 'Em Desenvolvimento' },
    testando: { label: 'Testando' },
    concluido: { label: 'Concluído' },
    suspenso: { label: 'Suspenso' },
    aprovado: { label: 'Aprovado' },
    rejeitado: { label: 'Rejeitado' },
    aguardando_revisao: { label: 'Aguardando Revisão' },
    pendente: { label: 'Pendente' },
};

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

const mapProject = (item: ApiProject): Project => ({
    id: item.id,
    title: item.title,
    description: item.description,
    status: normalizeProjectStatus(item.status),
    startDate: undefined,
    expectedEndDate: item.deadline ?? undefined,
    progress: normalizeProjectStatus(item.status) === 'concluido' ? 100 : 0,
    images: [],
    updates: [],
});

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

export default function ProjectsPage() {
    const { user, isLoading: isAuthLoading, hasPermission } = useAuth();
    const { show } = useToast();
    const canListProjects = hasPermission('estudante');
    const canListAllProposals = hasPermission('estudante');
    const [activeTab, setActiveTab] = useState<'proposals' | 'projects'>(() =>
        canListProjects ? 'projects' : 'proposals',
    );

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

    const form = useForm<ProjectsFiltersFormValues>({
        resolver: zodResolver(projectsFiltersSchema),
        defaultValues: { status: '', search: '' },
        mode: 'onChange',
    });
    const filters = form.watch();
    const {
        page,
        setPage,
        pageSize,
        setPageSize,
        total,
        totalPages,
        setTotals,
    } = usePagination({ initialPage: 1, initialPageSize: 6, pageSizeOptions: [6, 9, 12, 24] });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthLoading && !canListProjects && activeTab === 'projects') {
            setActiveTab('proposals');
            setPage(1);
        }
    }, [activeTab, canListProjects, isAuthLoading, setPage]);

    useEffect(() => {
        const fetchData = async () => {
            if (isAuthLoading) return;

            if (!user) {
                setProjects([]);
                setProposals([]);
                setTotals(0, 1);
                setError('Faça login para visualizar os dados.');
                return;
            }

            try {
                setLoading(true);
                setError(null);

                if (activeTab === 'projects') {
                    if (!canListProjects) {
                        setProjects([]);
                        setTotals(0, 1);
                        setError('Seu perfil não tem permissão para listar projetos.');
                        return;
                    }

                    const params = new URLSearchParams({
                        page: String(page),
                        limit: String(pageSize),
                    });
                    if (filters.status) params.set('status', filters.status);
                    if (filters.search) params.set('search', filters.search);

                    const res = await http.get(`${API_PROJECTS}?${params.toString()}`);
                    const data = res.data as ApiListResponse<ApiProject>;
                    setProjects(data.items.map(mapProject));
                    setTotals(Number(data.totalItems), Number(data.totalPages));
                } else {
                    const params = new URLSearchParams({
                        page: String(page),
                        limit: String(pageSize),
                    });

                    const endpoint = canListAllProposals ? API_PROPOSALS : API_MY_PROPOSALS;
                    const res = await http.get(`${endpoint}?${params.toString()}`);
                    const data = res.data as ApiListResponse<ApiProposal>;
                    const mappedProposals = data.items.map(mapProposal);

                    const filtered = mappedProposals.filter((proposal) => {
                        const matchesSearch = !filters.search ||
                            proposal.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                            proposal.description.toLowerCase().includes(filters.search.toLowerCase());
                        const matchesStatus = !filters.status || proposal.status === filters.status;
                        return matchesSearch && matchesStatus;
                    });

                    setProposals(filtered);
                    setTotals(Number(data.totalItems), Number(data.totalPages));
                }

            } catch (e: unknown) {
                if (e instanceof DOMException && e.name === 'AbortError') return;
                const message = e instanceof Error ? e.message : 'Erro ao buscar dados';
                setError(message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [
        activeTab,
        canListAllProposals,
        canListProjects,
        filters.search,
        filters.status,
        isAuthLoading,
        page,
        pageSize,
        setTotals,
        user,
    ]);

    const handleUpdateStatus = async (newStatus: ProjectStatus) => {
        if (selectedProject) {
            try {
                await http.put(`${API_PROJECTS}/${selectedProject.id}`, { status: newStatus });

                const updatedProject = { ...selectedProject, status: newStatus };
                setSelectedProject(updatedProject);
                setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
                show({ message: 'Status atualizado com sucesso!', kind: 'success' });
            } catch (error) {
                console.error(error);
                show({ message: 'Erro ao atualizar status', kind: 'error' });
            }
        }
    };

    const handleAddUpdate = async (message: string) => {
        if (selectedProject) {
            const newUpdate = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                message,
                author: user?.user_metadata?.name || 'Usuário'
            };
            const updatedProject = {
                ...selectedProject,
                updates: [newUpdate, ...selectedProject.updates]
            };
            setSelectedProject(updatedProject);
            setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
            show({ message: 'Atualização adicionada (localmente)', kind: 'success' });
        }
    };

    const handleProposalStatusUpdate = async (status: ProposalStatus, message?: string) => {
        if (selectedProposal) {
            try {
                await http.put(`${API_PROPOSALS}/${selectedProposal.id}`, {
                    status,
                    mediatorNotes: message,
                });

                const updated = { ...selectedProposal, status, mediatorNotes: message };
                setSelectedProposal(updated);
                setProposals(proposals.map(p => p.id === updated.id ? updated : p));
                show({ message: 'Proposta atualizada com sucesso!', kind: 'success' });
            } catch (error) {
                console.error(error);
                show({ message: 'Erro ao atualizar proposta', kind: 'error' });
            }
        }
    };

    const handleAssign = async (assignmentData: any) => {
        if (selectedProposal) {
            try {
                await http.put(`${API_PROPOSALS}/${selectedProposal.id}`, {
                    status: 'atribuida',
                    assignedTo: assignmentData,
                });

                const updated = { ...selectedProposal, status: 'atribuida' as ProposalStatus, assignedTo: assignmentData };
                setSelectedProposal(updated);
                setProposals(proposals.map(p => p.id === updated.id ? updated : p));
                show({ message: 'Proposta atribuída com sucesso!', kind: 'success' });
            } catch (error) {
                console.error(error);
                show({ message: 'Erro ao atribuir proposta', kind: 'error' });
            }
        }
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Acompanhar Projetos
                        </h1>
                        <p className="text-gray-600">
                            Gerencie propostas e acompanhe o desenvolvimento dos projetos.
                        </p>
                    </div>

                    <DashboardTabs
                        activeTab={activeTab}
                        onTabChange={(tab) => { setActiveTab(tab); setPage(1); form.reset(); }}
                        projectsDisabled={!canListProjects}
                    />

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="md:col-span-2">
                                <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Search size={16} className="inline mr-1" />
                                    Pesquisar
                                </label>
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder={activeTab === 'projects' ? "Buscar por projeto, estudante..." : "Buscar por título, descrição..."}
                                    {...form.register('search', { onChange: () => setPage(1) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--cps-blue-base)] focus:border-[var(--cps-blue-base)] outline-none"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Filter size={16} className="inline mr-1" />
                                    Status
                                </label>
                                <select
                                    id="status-select"
                                    {...form.register('status', { onChange: () => setPage(1) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--cps-blue-base)] focus:border-[var(--cps-blue-base)] outline-none"
                                >
                                    <option value="">Todos os status</option>
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {activeTab === 'projects' ? total : proposals.length} item(s) encontrado(s)
                            </span>
                            <button
                                onClick={() => { setPage(1); form.reset(); }}
                                className="text-sm text-[var(--cps-blue-base)] hover:text-[var(--cps-blue-title-hover)] font-medium"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'projects' ? (
                        loading ? (
                            <div className="text-center py-12 text-gray-500">Carregando projetos...</div>
                        ) : error ? (
                            <div className="text-center py-12 text-red-600">{error}</div>
                        ) : projects.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.map(project => (
                                        <ProjectCard
                                            key={project.id}
                                            project={project}
                                            onViewDetails={setSelectedProject}
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <Pagination
                                        className="mt-6"
                                        page={page}
                                        totalPages={totalPages}
                                        pageSize={pageSize}
                                        onPageChange={(p) => setPage(p)}
                                        onPageSizeChange={(s) => setPageSize(s)}
                                        pageSizeOptions={[6, 9, 12, 24]}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-4">
                                    <Eye size={64} className="mx-auto" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-600 mb-2">
                                    Nenhum projeto encontrado
                                </h3>
                            </div>
                        )
                    ) : (
                        <ProposalList
                            proposals={proposals}
                            loading={loading}
                            error={error}
                            onViewDetails={setSelectedProposal}
                        />
                    )}
                </div>

                {/* Modals */}
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                        onUpdateStatus={handleUpdateStatus}
                        onAddUpdate={handleAddUpdate}
                    />
                )}

                {selectedProposal && (
                    <ProposalModal
                        proposal={selectedProposal}
                        onClose={() => setSelectedProposal(null)}
                        onUpdateStatus={handleProposalStatusUpdate}
                        onAssign={handleAssign}
                    />
                )}
            </main>
        </>
    );
}
