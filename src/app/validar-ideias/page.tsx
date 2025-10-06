'use client';
import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, User, AlertCircle, CheckCircle, XCircle, Eye, Filter, Search, Users, BookOpen } from "lucide-react";
import Image from "next/image";

interface IdeaSuggestion {
    id: string;
    title: string;
    description: string;
    category: string;
    location: {
        address: string;
        neighborhood: string;
        city: string;
    };
    priority: 'baixa' | 'media' | 'alta' | 'urgente';
    status: 'pendente' | 'aprovada' | 'rejeitada' | 'em_analise' | 'atribuida';
    submittedBy: {
        name: string;
        email: string;
        phone?: string;
    };
    submittedAt: string;
    affectedPeople: string;
    images: string[];
    mediatorNotes?: string;
    assignedTo?: {
        class: string;
        semester: string;
        course: string;
        professor: string;
    };
    coordinatorNotes?: string;
}

// Mock data for demonstration
const mockIdeas: IdeaSuggestion[] = [
    {
        id: '1',
        title: 'Semáforos Inteligentes para Redução de Trânsito',
        description: 'Implementação de sistema de semáforos inteligentes que se adaptam ao fluxo de trânsito em tempo real, reduzindo congestionamentos nos horários de pico.',
        category: 'transporte',
        location: {
            address: 'Cruzamento da Av. Principal com Rua Comercial',
            neighborhood: 'Centro',
            city: 'Votorantim'
        },
        priority: 'alta',
        status: 'pendente',
        submittedBy: {
            name: 'Maria Fernanda Santos',
            email: 'maria.santos@email.com',
            phone: '(15) 99887-6543'
        },
        submittedAt: '2024-12-15T14:30:00Z',
        affectedPeople: 'Aproximadamente 2.000 pessoas que transitam pela região diariamente',
        images: [
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=300&fit=crop'
        ]
    },
    {
        id: '2',
        title: 'App de Monitoramento da Qualidade do Ar',
        description: 'Desenvolvimento de aplicativo móvel para monitoramento em tempo real da qualidade do ar na cidade, com alertas para grupos de risco.',
        category: 'ambiente',
        location: {
            address: 'Toda a cidade',
            neighborhood: 'Todos os bairros',
            city: 'Votorantim'
        },
        priority: 'media',
        status: 'aprovada',
        submittedBy: {
            name: 'João Carlos Oliveira',
            email: 'joao.oliveira@email.com'
        },
        submittedAt: '2024-12-10T09:15:00Z',
        affectedPeople: 'Toda a população de Votorantim, especialmente idosos e crianças',
        images: [
            'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=300&fit=crop'
        ],
        mediatorNotes: 'Ideia muito relevante para saúde pública. Recomendo aprovação.',
        assignedTo: {
            class: '4º ADS',
            semester: '4º semestre',
            course: 'Análise e Desenvolvimento de Sistemas',
            professor: 'Prof. Dr. Ricardo Silva'
        },
        coordinatorNotes: 'Projeto aprovado para desenvolvimento na disciplina de Projeto Integrador.'
    },
    {
        id: '3',
        title: 'Sistema de Denúncia de Irregularidades Urbanas',
        description: 'Plataforma online para cidadãos reportarem buracos, iluminação defeituosa, lixo acumulado e outras irregularidades urbanas.',
        category: 'infraestrutura',
        location: {
            address: 'Toda a cidade',
            neighborhood: 'Todos os bairros',
            city: 'Votorantim'
        },
        priority: 'alta',
        status: 'em_analise',
        submittedBy: {
            name: 'Ana Paula Costa',
            email: 'ana.costa@email.com',
            phone: '(15) 98765-4321'
        },
        submittedAt: '2024-12-12T16:45:00Z',
        affectedPeople: 'Todos os moradores da cidade',
        images: [
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop'
        ],
        mediatorNotes: 'Analisando viabilidade técnica e recursos necessários.'
    }
];

const statusConfig = {
    pendente: { label: 'Pendente', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    em_analise: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800', icon: Eye },
    aprovada: { label: 'Aprovada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejeitada: { label: 'Rejeitada', color: 'bg-red-100 text-red-800', icon: XCircle },
    atribuida: { label: 'Atribuída', color: 'bg-purple-100 text-purple-800', icon: BookOpen },
};

const priorityConfig = {
    baixa: { label: 'Baixa', color: 'bg-green-100 text-green-800' },
    media: { label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
    alta: { label: 'Alta', color: 'bg-orange-100 text-orange-800' },
    urgente: { label: 'Urgente', color: 'bg-red-100 text-red-800' },
};

const categoryConfig = {
    infraestrutura: 'Infraestrutura',
    seguranca: 'Segurança',
    ambiente: 'Meio Ambiente',
    transporte: 'Transporte',
    saude: 'Saúde',
    educacao: 'Educação',
    tecnologia: 'Tecnologia',
    outros: 'Outros'
};

export default function ValidateIdeasPage() {
    const { user, canAccessIdeaValidation, canAssignToClasses } = useAuth();
    const router = useRouter();
    const [ideas, setIdeas] = useState<IdeaSuggestion[]>([]);
    const [filteredIdeas, setFilteredIdeas] = useState<IdeaSuggestion[]>([]);
    const [selectedIdea, setSelectedIdea] = useState<IdeaSuggestion | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        priority: '',
        search: ''
    });

    useEffect(() => {
        if (!canAccessIdeaValidation()) {
            router.push('/');
            return;
        }
        
        // Load ideas
        setIdeas(mockIdeas);
        setFilteredIdeas(mockIdeas);
    }, [canAccessIdeaValidation, router]);

    useEffect(() => {
        let filtered = ideas;

        if (filters.status) {
            filtered = filtered.filter(idea => idea.status === filters.status);
        }
        if (filters.category) {
            filtered = filtered.filter(idea => idea.category === filters.category);
        }
        if (filters.priority) {
            filtered = filtered.filter(idea => idea.priority === filters.priority);
        }
        if (filters.search) {
            filtered = filtered.filter(idea => 
                idea.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                idea.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                idea.submittedBy.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredIdeas(filtered);
    }, [ideas, filters]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleStatusChange = (ideaId: string, newStatus: IdeaSuggestion['status'], notes?: string) => {
        setIdeas(prev => prev.map(idea => 
            idea.id === ideaId 
                ? { 
                    ...idea, 
                    status: newStatus,
                    ...(user?.role === 'mediador' && { mediatorNotes: notes }),
                    ...(user?.role === 'coordenacao' && { coordinatorNotes: notes })
                }
                : idea
        ));
        setSelectedIdea(null);
    };

    const handleClassAssignment = (ideaId: string, assignmentData: IdeaSuggestion['assignedTo']) => {
        setIdeas(prev => prev.map(idea => 
            idea.id === ideaId 
                ? { 
                    ...idea, 
                    status: 'atribuida',
                    assignedTo: assignmentData
                }
                : idea
        ));
        setSelectedIdea(null);
    };

    const IdeaCard = ({ idea }: { idea: IdeaSuggestion }) => {
        const StatusIcon = statusConfig[idea.status].icon;
        
        return (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">{idea.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{idea.description}</p>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[idea.status].color}`}>
                            <StatusIcon size={12} />
                            {statusConfig[idea.status].label}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[idea.priority].color}`}>
                            {priorityConfig[idea.priority].label}
                        </span>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User size={16} />
                        <span>{idea.submittedBy.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{idea.location.neighborhood}, {idea.location.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={16} />
                        <span>{formatDate(idea.submittedAt)}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                        {categoryConfig[idea.category as keyof typeof categoryConfig]}
                    </span>
                    <Button
                        label="Analisar"
                        onClick={() => setSelectedIdea(idea)}
                        variant="secondary"
                        size="small"
                    />
                </div>
            </div>
        );
    };

    const IdeaModal = ({ idea, onClose }: { idea: IdeaSuggestion; onClose: () => void }) => {
        const [action, setAction] = useState<'approve' | 'reject' | 'assign' | null>(null);
        const [notes, setNotes] = useState('');
        const [assignmentData, setAssignmentData] = useState({
            class: '',
            semester: '',
            course: '',
            professor: ''
        });

        const handleSubmit = () => {
            if (action === 'assign' && canAssignToClasses()) {
                handleClassAssignment(idea.id, assignmentData);
            } else if (action === 'approve') {
                handleStatusChange(idea.id, 'aprovada', notes);
            } else if (action === 'reject') {
                handleStatusChange(idea.id, 'rejeitada', notes);
            }
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">{idea.title}</h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <h3 className="font-semibold text-gray-800 mb-2">Descrição</h3>
                                <p className="text-gray-600 mb-4">{idea.description}</p>

                                <h3 className="font-semibold text-gray-800 mb-2">Localização</h3>
                                <p className="text-gray-600 mb-4">
                                    {idea.location.address}, {idea.location.neighborhood}, {idea.location.city}
                                </p>

                                <h3 className="font-semibold text-gray-800 mb-2">Pessoas Beneficiadas</h3>
                                <p className="text-gray-600 mb-4">{idea.affectedPeople}</p>

                                <h3 className="font-semibold text-gray-800 mb-2">Submetida por</h3>
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="font-medium">{idea.submittedBy.name}</p>
                                    <p className="text-sm text-gray-600">{idea.submittedBy.email}</p>
                                    {idea.submittedBy.phone && (
                                        <p className="text-sm text-gray-600">{idea.submittedBy.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="font-medium text-gray-700">Status</h4>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[idea.status].color}`}>
                                            {statusConfig[idea.status].label}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-700">Prioridade</h4>
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[idea.priority].color}`}>
                                            {priorityConfig[idea.priority].label}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2">Data de Submissão</h4>
                                    <p className="text-gray-600">{formatDate(idea.submittedAt)}</p>
                                </div>

                                {idea.mediatorNotes && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Notas do Mediador</h4>
                                        <p className="text-gray-600 bg-blue-50 p-3 rounded-lg">{idea.mediatorNotes}</p>
                                    </div>
                                )}

                                {idea.coordinatorNotes && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Notas da Coordenação</h4>
                                        <p className="text-gray-600 bg-green-50 p-3 rounded-lg">{idea.coordinatorNotes}</p>
                                    </div>
                                )}

                                {idea.assignedTo && (
                                    <div className="mb-4">
                                        <h4 className="font-medium text-gray-700 mb-2">Atribuição</h4>
                                        <div className="bg-purple-50 p-3 rounded-lg">
                                            <p className="font-medium">{idea.assignedTo.class}</p>
                                            <p className="text-sm text-gray-600">{idea.assignedTo.course}</p>
                                            <p className="text-sm text-gray-600">Professor: {idea.assignedTo.professor}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {idea.images.length > 0 && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-3">Imagens</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {idea.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            src={image}
                                            alt={`Imagem ${index + 1} da ideia`}
                                            className="w-full h-48 object-cover rounded-lg"
                                            width={300}
                                            height={192}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Section */}
                        {(user?.role === 'mediador' || user?.role === 'coordenacao') && idea.status !== 'atribuida' && (
                            <div className="border-t pt-6">
                                <h3 className="font-semibold text-gray-800 mb-4">Ações</h3>
                                
                                {!action && (
                                    <div className="flex gap-3 flex-wrap">
                                        <Button
                                            label="Aprovar"
                                            onClick={() => setAction('approve')}
                                            variant="primary"
                                            size="medium"
                                        />
                                        <Button
                                            label="Rejeitar"
                                            onClick={() => setAction('reject')}
                                            variant="secondary"
                                            size="medium"
                                        />
                                        {canAssignToClasses() && idea.status === 'aprovada' && (
                                            <Button
                                                label="Atribuir à Turma"
                                                onClick={() => setAction('assign')}
                                                variant="primary"
                                                size="medium"
                                            />
                                        )}
                                    </div>
                                )}

                                {(action === 'approve' || action === 'reject') && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {action === 'approve' ? 'Notas de Aprovação' : 'Motivo da Rejeição'}
                                            </label>
                                            <textarea
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                                rows={4}
                                                placeholder={action === 'approve' ? 'Adicione observações sobre a aprovação...' : 'Explique o motivo da rejeição...'}
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                label={action === 'approve' ? 'Confirmar Aprovação' : 'Confirmar Rejeição'}
                                                onClick={handleSubmit}
                                                variant="primary"
                                                size="medium"
                                            />
                                            <Button
                                                label="Cancelar"
                                                onClick={() => setAction(null)}
                                                variant="secondary"
                                                size="medium"
                                            />
                                        </div>
                                    </div>
                                )}

                                {action === 'assign' && (
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-2">Turma</label>
                                                <select
                                                    id="class-select"
                                                    value={assignmentData.class}
                                                    onChange={(e) => setAssignmentData(prev => ({ ...prev, class: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                                >
                                                    <option value="">Selecione a turma</option>
                                                    <option value="3º ADS">3º ADS</option>
                                                    <option value="4º ADS">4º ADS</option>
                                                    <option value="5º ADS">5º ADS</option>
                                                    <option value="6º ADS">6º ADS</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label htmlFor="course-input" className="block text-sm font-medium text-gray-700 mb-2">Curso</label>
                                                <input
                                                    id="course-input"
                                                    type="text"
                                                    value={assignmentData.course}
                                                    onChange={(e) => setAssignmentData(prev => ({ ...prev, course: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                                    placeholder="Ex: Análise e Desenvolvimento de Sistemas"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="professor-input" className="block text-sm font-medium text-gray-700 mb-2">Professor Responsável</label>
                                            <input
                                                id="professor-input"
                                                type="text"
                                                value={assignmentData.professor}
                                                onChange={(e) => setAssignmentData(prev => ({ ...prev, professor: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                                placeholder="Ex: Prof. Dr. João Silva"
                                            />
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                label="Atribuir à Turma"
                                                onClick={handleSubmit}
                                                variant="primary"
                                                size="medium"
                                            />
                                            <Button
                                                label="Cancelar"
                                                onClick={() => setAction(null)}
                                                variant="secondary"
                                                size="medium"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!canAccessIdeaValidation()) {
        return null;
    }

    return (
        <>
            <Header />
            <main className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Validar Ideias
                        </h1>
                        <p className="text-gray-600">
                            {user?.role === 'mediador' 
                                ? 'Analise e faça a triagem das ideias submetidas pela comunidade.'
                                : 'Gerencie e atribua projetos aprovados às turmas.'
                            }
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                                <label htmlFor="search-input" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Search size={16} className="inline mr-1" />
                                    Pesquisar
                                </label>
                                <input
                                    id="search-input"
                                    type="text"
                                    placeholder="Buscar por título, descrição..."
                                    value={filters.search}
                                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                />
                            </div>

                            <div>
                                <label htmlFor="status-select" className="block text-sm font-medium text-gray-700 mb-2">
                                    <Filter size={16} className="inline mr-1" />
                                    Status
                                </label>
                                <select
                                    id="status-select"
                                    value={filters.status}
                                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                >
                                    <option value="">Todos os status</option>
                                    {Object.entries(statusConfig).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                                <select
                                    id="category-select"
                                    value={filters.category}
                                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                >
                                    <option value="">Todas as categorias</option>
                                    {Object.entries(categoryConfig).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="priority-select" className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                                <select
                                    id="priority-select"
                                    value={filters.priority}
                                    onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#CB2616] focus:border-[#CB2616] outline-none"
                                >
                                    <option value="">Todas as prioridades</option>
                                    {Object.entries(priorityConfig).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                {filteredIdeas.length} ideia(s) encontrada(s)
                            </span>
                            <button
                                onClick={() => setFilters({ status: '', category: '', priority: '', search: '' })}
                                className="text-sm text-[#CB2616] hover:text-red-700 font-medium"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </div>

                    {/* Ideas Grid */}
                    {filteredIdeas.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredIdeas.map(idea => (
                                <IdeaCard key={idea.id} idea={idea} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Users size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                Nenhuma ideia encontrada
                            </h3>
                            <p className="text-gray-500">
                                Tente ajustar os filtros ou aguarde novas submissões.
                            </p>
                        </div>
                    )}
                </div>

                {/* Idea Modal */}
                {selectedIdea && (
                    <IdeaModal
                        idea={selectedIdea}
                        onClose={() => setSelectedIdea(null)}
                    />
                )}
            </main>
        </>
    );
}
