'use client';
import { useState, useEffect } from 'react';
import { Header, useToast } from "@/presentation/components";
import { Filter, Search, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectsFiltersSchema, type ProjectsFiltersFormValues } from "@/domain/projects/schemas/filters.schema";
import { usePagination } from "@/presentation/hooks/usePagination";
import { Pagination } from "@/presentation/components";
import { Project, ProjectStatus } from "@/domain/projects/types";
import { ProjectCard } from "@/presentation/components/molecules/ProjectCard";
import { ProjectModal } from "@/presentation/components/organisms/ProjectModal";
import { Proposal, ProposalStatus } from "@/domain/proposals/types";
import { ProposalList } from "@/presentation/components/organisms/ProposalList";
import { ProposalModal } from "@/presentation/components/organisms/ProposalModal";
import { DashboardTabs } from "@/presentation/components/organisms/DashboardTabs";
import { useAuth } from "@/presentation/hooks/useAuth";

const API_PROJECTS = '/api/projetos';
const API_PROPOSALS = '/api/ideias-simples';

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

export default function ProjectsPage() {
    const { user } = useAuth();
    const { show } = useToast();
    const [activeTab, setActiveTab] = useState<'proposals' | 'projects'>('projects');

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
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                if (activeTab === 'projects') {
                    const params = new URLSearchParams({
                        page: String(page),
                        pageSize: String(pageSize),
                    });
                    if (filters.status) params.set('status', filters.status);
                    if (filters.search) params.set('search', filters.search);

                    const res = await fetch(`${API_PROJECTS}?${params.toString()}`, { signal: controller.signal });
                    if (!res.ok) throw new Error('Falha ao carregar projetos');
                    const data = await res.json();
                    setProjects(data.data as Project[]);
                    setTotals(Number(data.total), Number(data.totalPages));
                } else {
                    const res = await fetch(API_PROPOSALS, { signal: controller.signal });
                    if (!res.ok) throw new Error('Falha ao carregar propostas');
                    const data = await res.json();

                    const mappedProposals: Proposal[] = data.map((item: any) => ({
                        id: item.id,
                        title: item.titulo,
                        description: item.descricao,
                        status: item.status,
                        submittedBy: {
                            name: item.autor || 'Anônimo',
                            email: 'N/A',
                        },
                        submittedAt: item.created_at || new Date().toISOString(),
                        images: item.anexos ? (Array.isArray(item.anexos) ? item.anexos.map((a: any) => a.url) : []) : [],
                        mediatorNotes: '',
                        coordinatorNotes: '',
                    }));

                    let filtered = mappedProposals;
                    if (filters.search) {
                        const q = filters.search.toLowerCase();
                        filtered = filtered.filter(p =>
                            p.title.toLowerCase().includes(q) ||
                            p.description.toLowerCase().includes(q)
                        );
                    }
                    if (filters.status) {
                        filtered = filtered.filter(p => p.status === filters.status);
                    }

                    setProposals(filtered);
                    setTotals(filtered.length, Math.ceil(filtered.length / pageSize));
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
        return () => controller.abort();
    }, [page, pageSize, filters.status, filters.search, setTotals, activeTab]);

    const handleUpdateStatus = async (newStatus: ProjectStatus) => {
        if (selectedProject) {
            try {
                const res = await fetch(API_PROJECTS, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: selectedProject.id, status: newStatus }),
                });

                if (!res.ok) throw new Error('Falha ao atualizar status');

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
                const res = await fetch(API_PROPOSALS, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: selectedProposal.id,
                        status,
                        mediatorNotes: message
                    }),
                });

                if (!res.ok) throw new Error('Falha ao atualizar proposta');

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
                const res = await fetch(API_PROPOSALS, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: selectedProposal.id,
                        status: 'atribuida',
                        assignedTo: assignmentData
                    }),
                });

                if (!res.ok) throw new Error('Falha ao atribuir proposta');

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
