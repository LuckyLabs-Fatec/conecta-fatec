import { useState } from 'react';
import { Project, ProjectStatus } from "@/domain/projects/types";
import { useAuth } from "@/presentation/hooks/useAuth";
import Image from "next/image";
import { Button } from "@/presentation/components";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onUpdateStatus?: (status: ProjectStatus) => void;
  onAddUpdate?: (message: string) => void;
}

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  em_analise: { label: 'Em Análise', color: 'bg-[var(--cps-gray-hover)] text-[var(--cps-blue-base)]' },
  em_desenvolvimento: { label: 'Em Desenvolvimento', color: 'bg-[var(--cps-silver-base)] text-[var(--cps-blue-base)]' },
  testando: { label: 'Testando', color: 'bg-[var(--cps-feedback-progress-light)] text-[var(--cps-feedback-progress)]' },
  concluido: { label: 'Concluído', color: 'bg-[var(--cps-feedback-done-light)] text-[var(--cps-feedback-done)]' },
  suspenso: { label: 'Suspenso', color: 'bg-[var(--cps-feedback-cancelled-light)] text-[var(--cps-feedback-cancelled)]' },
  aprovado: { label: 'Aprovado', color: 'bg-[var(--cps-feedback-done-light)] text-[var(--cps-feedback-done)]' },
  rejeitado: { label: 'Rejeitado', color: 'bg-[var(--cps-feedback-cancelled-light)] text-[var(--cps-feedback-cancelled)]' },
  aguardando_revisao: { label: 'Aguardando Revisão', color: 'bg-[var(--cps-feedback-progress-light)] text-[var(--cps-feedback-progress)]' },
  pendente: { label: 'Pendente', color: 'bg-[var(--cps-gray-hover)] text-[var(--cps-blue-base)]' },
};

export const ProjectModal = ({ project, onClose, onUpdateStatus, onAddUpdate }: ProjectModalProps) => {
  const { hasPermission } = useAuth();
  const [newUpdate, setNewUpdate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(project.status);
  const [activeTab, setActiveTab] = useState<'details' | 'assignment'>('details');

  const isCoordinator = hasPermission('coordenador');
  const isMediator = hasPermission('mediador');
  const isCommunity = hasPermission('comunidade');

  const canEditStatus = isCoordinator || isMediator;
  const canAddUpdate = isCoordinator || isMediator || isCommunity;
  const canAssign = isCoordinator && project.status === 'aprovado';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleAddUpdate = () => {
    if (onAddUpdate && newUpdate.trim()) {
      onAddUpdate(newUpdate);
      setNewUpdate('');
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ProjectStatus;
    setSelectedStatus(newStatus);
    if (onUpdateStatus) {
      onUpdateStatus(newStatus);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-[30px] max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[var(--cps-shadow-2)]"
        role="document"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-[var(--cps-blue-base)]">{project.title}</h2>
            <button
              onClick={onClose}
              className="text-[var(--cps-gray-text)] hover:text-[var(--cps-gray-text)] text-xl font-bold"
              aria-label="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Tabs for Coordinator */}
          {canAssign && (
            <div className="flex border-b border-[var(--cps-gray-light)] mb-6">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-[var(--cps-blue-base)] border-b-2 border-[var(--cps-blue-base)]' : 'text-[var(--cps-gray-text)] hover:text-[var(--cps-gray-text)]'}`}
                onClick={() => setActiveTab('details')}
              >
                Detalhes
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'assignment' ? 'text-[var(--cps-blue-base)] border-b-2 border-[var(--cps-blue-base)]' : 'text-[var(--cps-gray-text)] hover:text-[var(--cps-gray-text)]'}`}
                onClick={() => setActiveTab('assignment')}
              >
                Atribuição
              </button>
            </div>
          )}

          {activeTab === 'details' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-[var(--cps-blue-base)] mb-2">Descrição</h3>
                  <p className="text-[var(--cps-gray-text)] mb-4">{project.description}</p>
                </div>

                <div>
                  {project.student && (
                    <>
                      <h3 className="font-semibold text-[var(--cps-blue-base)] mb-2">Estudante Responsável</h3>
                      <div className="bg-[var(--cps-silver-base)] p-4 rounded-[30px] mb-4">
                        <p className="font-medium">{project.student.name}</p>
                        <p className="text-sm text-[var(--cps-gray-text)]">{project.student.course}</p>
                        <p className="text-sm text-[var(--cps-gray-text)]">{project.student.semester}</p>
                      </div>
                    </>
                  )}

                  <div className="mb-4">
                    <h4 className="font-medium text-[var(--cps-gray-text)]">Status</h4>
                    {canEditStatus ? (
                      <select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-[var(--cps-gray-light)] focus:outline-none focus:ring-[var(--cps-blue-base)] focus:border-[var(--cps-blue-base)] sm:text-sm rounded-[24px]"
                      >
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <option key={key} value={key}>{config.label}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusConfig[project.status].color}`}>
                        {statusConfig[project.status].label}
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-[var(--cps-gray-text)] mb-2">Progresso: {project.progress}%</h4>
                    <div className="w-full bg-[var(--cps-gray-hover)] rounded-full h-3">
                      <div
                        className="bg-[var(--cps-red-base)] h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {project.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-[var(--cps-blue-base)] mb-3">Imagens do Projeto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {project.images.map((image, index) => (
                      <Image
                        key={index}
                        src={image}
                        alt={`Imagem ${index + 1} do projeto`}
                        className="w-full h-48 object-cover rounded-[30px]"
                        width={300}
                        height={192}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-[var(--cps-blue-base)] mb-3">Atualizações do Projeto</h3>
                <div className="space-y-3 mb-6">
                  {project.updates.map(update => (
                    <div key={update.id} className="border-l-4 border-[var(--cps-red-base)] pl-4 py-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{update.author}</span>
                        <span className="text-sm text-[var(--cps-gray-text)]">{formatDate(update.date)}</span>
                      </div>
                      <p className="text-[var(--cps-gray-text)]">{update.message}</p>
                    </div>
                  ))}
                </div>

                {canAddUpdate && (
                  <div className="bg-[var(--cps-silver-base)] p-4 rounded-[30px]">
                    <h4 className="font-medium text-[var(--cps-blue-base)] mb-2">Adicionar Nova Informação</h4>
                    <textarea
                      value={newUpdate}
                      onChange={(e) => setNewUpdate(e.target.value)}
                      className="w-full p-2 border border-[var(--cps-gray-light)] rounded-[30px] mb-2 focus:ring-2 focus:ring-[var(--cps-blue-base)] focus:border-[var(--cps-blue-base)] outline-none"
                      rows={3}
                      placeholder="Digite aqui novas informações ou atualizações..."
                    />
                    <div className="flex justify-end">
                      <Button
                        label="Enviar Atualização"
                        onClick={handleAddUpdate}
                        variant="secondary"
                        size='medium'
                        disabled={!newUpdate.trim()}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'assignment' && (
            <div>
              <h3 className="font-semibold text-[var(--cps-blue-base)] mb-4">Atribuição de Responsáveis</h3>
              <div className="bg-[var(--cps-feedback-progress-light)] border border-[var(--cps-feedback-progress-light)] p-4 rounded-[30px] mb-4">
                <p className="text-[var(--cps-feedback-progress)] text-sm">
                  Funcionalidade de atribuição em desenvolvimento. Aqui será possível selecionar coordenadores, mediadores e estudantes para o projeto.
                </p>
              </div>
              {/* Placeholder for assignment UI */}
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 border border-[var(--cps-gray-light)] rounded-[30px]">
                  <h4 className="font-medium text-[var(--cps-gray-text)] mb-2">Atribuir Mediador</h4>
                  <select className="w-full p-2 border border-[var(--cps-gray-light)] rounded-[30px]">
                    <option>Selecione um mediador...</option>
                  </select>
                </div>
                <div className="p-4 border border-[var(--cps-gray-light)] rounded-[30px]">
                  <h4 className="font-medium text-[var(--cps-gray-text)] mb-2">Atribuir Estudantes</h4>
                  <select className="w-full p-2 border border-[var(--cps-gray-light)] rounded-[30px]">
                    <option>Selecione estudantes...</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
