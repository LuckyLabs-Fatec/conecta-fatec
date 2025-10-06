'use client';
import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { Calendar, MapPin, Users, Eye, Filter, Search } from "lucide-react";
import Image from "next/image";

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
    status: 'em_analise' | 'em_desenvolvimento' | 'testando' | 'concluido' | 'suspenso';
    priority: 'baixa' | 'media' | 'alta' | 'urgente';
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

// Mock data for demonstration
const mockProjects: Project[] = [
    {
        id: '1',
        title: 'Aplicativo para Coleta Seletiva',
        description: 'Desenvolvimento de aplicativo mobile para facilitar a coleta seletiva no bairro, com mapeamento de pontos de coleta e agendamento.',
        category: 'ambiente',
        location: {
            address: 'Rua das Flores, 123',
            neighborhood: 'Centro',
            city: 'Votorantim'
        },
        status: 'em_desenvolvimento',
        priority: 'alta',
        student: {
            name: 'Ana Silva',
            course: 'Análise e Desenvolvimento de Sistemas',
            semester: '4º semestre'
        },
        startDate: '2024-03-15',
        expectedEndDate: '2024-07-15',
        progress: 65,
        affectedPeople: 'Aproximadamente 500 famílias do bairro Centro',
        images: [
            'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=300&h=200&fit=crop',
            'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop'
        ],
        updates: [
            {
                id: '1',
                date: '2024-06-01',
                message: 'Concluído o desenvolvimento da interface principal do aplicativo',
                author: 'Ana Silva'
            },
            {
                id: '2',
                date: '2024-05-15',
                message: 'Mapeamento de pontos de coleta finalizado',
                author: 'Ana Silva'
            }
        ]
    },
    {
        id: '2',
        title: 'Sistema de Monitoramento de Iluminação Pública',
        description: 'Criação de sistema IoT para monitoramento automático de falhas na iluminação pública com notificações em tempo real.',
        category: 'infraestrutura',
        location: {
            address: 'Av. Principal',
            neighborhood: 'Vila Nova',
            city: 'Votorantim'
        },
        status: 'testando',
        priority: 'media',
        student: {
            name: 'Carlos Oliveira',
            course: 'Sistemas Embarcados',
            semester: '6º semestre'
        },
        startDate: '2024-02-01',
        expectedEndDate: '2024-08-01',
        progress: 85,
        affectedPeople: 'Todos os moradores da Vila Nova (cerca de 1.200 pessoas)',
        images: [
            'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=300&h=200&fit=crop'
        ],
        updates: [
            {
                id: '1',
                date: '2024-06-10',
                message: 'Iniciados os testes de campo com sensores instalados',
                author: 'Carlos Oliveira'
            }
        ]
    },
    {
        id: '3',
        title: 'Plataforma de Carona Solidária',
        description: 'Desenvolvimento de plataforma web para conectar pessoas da comunidade que oferecem e precisam de carona.',
        category: 'transporte',
        location: {
            address: 'Toda a cidade',
            neighborhood: 'Todos os bairros',
            city: 'Votorantim'
        },
        status: 'concluido',
        priority: 'media',
        student: {
            name: 'Marina Santos',
            course: 'Análise e Desenvolvimento de Sistemas',
            semester: '5º semestre'
        },
        startDate: '2024-01-10',
        expectedEndDate: '2024-05-10',
        progress: 100,
        affectedPeople: 'Potencialmente toda a população de Votorantim',
        images: [
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300&h=200&fit=crop'
        ],
        updates: [
            {
                id: '1',
                date: '2024-05-10',
                message: 'Projeto concluído e disponibilizado para a comunidade!',
                author: 'Marina Santos'
            }
        ]
    }
];

const statusConfig = {
    em_analise: { label: 'Em Análise', color: 'bg-gray-100 text-gray-800', dotColor: 'bg-gray-400' },
    em_desenvolvimento: { label: 'Em Desenvolvimento', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-500' },
    testando: { label: 'Testando', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-500' },
    concluido: { label: 'Concluído', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
    suspenso: { label: 'Suspenso', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
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

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        priority: '',
        search: ''
    });

    useEffect(() => {
        // Simulate loading projects
        setProjects(mockProjects);
        setFilteredProjects(mockProjects);
    }, []);

    useEffect(() => {
        let filtered = projects;

        if (filters.status) {
            filtered = filtered.filter(p => p.status === filters.status);
        }
        if (filters.category) {
            filtered = filtered.filter(p => p.category === filters.category);
        }
        if (filters.priority) {
            filtered = filtered.filter(p => p.priority === filters.priority);
        }
        if (filters.search) {
            filtered = filtered.filter(p => 
                p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.student.name.toLowerCase().includes(filters.search.toLowerCase())
            );
        }

        setFilteredProjects(filtered);
    }, [projects, filters]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const ProjectCard = ({ project }: { project: Project }) => (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[project.status].color}`}>
                        {statusConfig[project.status].label}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[project.priority].color}`}>
                        {priorityConfig[project.priority].label}
                    </span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} />
                    <span>{project.student.name} - {project.student.course}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    <span>{project.location.neighborhood}, {project.location.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>Início: {formatDate(project.startDate)} | Previsão: {formatDate(project.expectedEndDate)}</span>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso</span>
                    <span className="text-sm text-gray-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-[#CB2616] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </div>

            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">
                    {categoryConfig[project.category as keyof typeof categoryConfig]}
                </span>
                <Button
                    label="Ver Detalhes"
                    onClick={() => setSelectedProject(project)}
                    variant="secondary"
                    size="small"
                />
            </div>
        </div>
    );

    const ProjectModal = ({ project, onClose }: { project: Project; onClose: () => void }) => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{project.title}</h2>
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
                            <p className="text-gray-600 mb-4">{project.description}</p>

                            <h3 className="font-semibold text-gray-800 mb-2">Localização</h3>
                            <p className="text-gray-600 mb-4">
                                {project.location.address}, {project.location.neighborhood}, {project.location.city}
                            </p>

                            <h3 className="font-semibold text-gray-800 mb-2">Pessoas Beneficiadas</h3>
                            <p className="text-gray-600">{project.affectedPeople}</p>
                        </div>

                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">Estudante Responsável</h3>
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="font-medium">{project.student.name}</p>
                                <p className="text-sm text-gray-600">{project.student.course}</p>
                                <p className="text-sm text-gray-600">{project.student.semester}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <h4 className="font-medium text-gray-700">Status</h4>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[project.status].color}`}>
                                        {statusConfig[project.status].label}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-700">Prioridade</h4>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityConfig[project.priority].color}`}>
                                        {priorityConfig[project.priority].label}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium text-gray-700 mb-2">Progresso: {project.progress}%</h4>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-[#CB2616] h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${project.progress}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {project.images.length > 0 && (
                        <div className="mb-6">
                            <h3 className="font-semibold text-gray-800 mb-3">Imagens do Projeto</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {project.images.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={image}
                                        alt={`Imagem ${index + 1} do projeto`}
                                        className="w-full h-48 object-cover rounded-lg"
                                        width={300}
                                        height={192}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div>
                        <h3 className="font-semibold text-gray-800 mb-3">Atualizações do Projeto</h3>
                        <div className="space-y-3">
                            {project.updates.map(update => (
                                <div key={update.id} className="border-l-4 border-[#CB2616] pl-4 py-2">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-medium">{update.author}</span>
                                        <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
                                    </div>
                                    <p className="text-gray-600">{update.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

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
                            Veja o andamento dos projetos desenvolvidos pelos estudantes da Fatec com base nas sugestões da comunidade.
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
                                    placeholder="Buscar por projeto, estudante..."
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
                                {filteredProjects.length} projeto(s) encontrado(s)
                            </span>
                            <button
                                onClick={() => setFilters({ status: '', category: '', priority: '', search: '' })}
                                className="text-sm text-[#CB2616] hover:text-red-700 font-medium"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </div>

                    {/* Projects Grid */}
                    {filteredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProjects.map(project => (
                                <ProjectCard key={project.id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Eye size={64} className="mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                Nenhum projeto encontrado
                            </h3>
                            <p className="text-gray-500">
                                Tente ajustar os filtros ou limpar a pesquisa.
                            </p>
                        </div>
                    )}
                </div>

                {/* Project Modal */}
                {selectedProject && (
                    <ProjectModal
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </main>
        </>
    );
}
