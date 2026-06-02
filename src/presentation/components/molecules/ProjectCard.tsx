import { Project, ProjectStatus } from "@/domain/projects/types";
import { Button } from "@/presentation/components";
import { Calendar, Users } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; dotColor?: string }> = {
  em_analise: { label: 'Em Análise', color: 'bg-[var(--cps-gray-hover)] text-[var(--cps-blue-base)]', dotColor: 'bg-[var(--cps-blue-base)]' },
  em_desenvolvimento: { label: 'Em Desenvolvimento', color: 'bg-[var(--cps-silver-base)] text-[var(--cps-blue-base)]', dotColor: 'bg-[var(--cps-blue-highlight)]' },
  testando: { label: 'Testando', color: 'bg-[var(--cps-feedback-progress-light)] text-[var(--cps-feedback-progress)]', dotColor: 'bg-[var(--cps-feedback-progress)]' },
  concluido: { label: 'Concluído', color: 'bg-[var(--cps-feedback-done-light)] text-[var(--cps-feedback-done)]', dotColor: 'bg-[var(--cps-feedback-done)]' },
  suspenso: { label: 'Suspenso', color: 'bg-[var(--cps-feedback-cancelled-light)] text-[var(--cps-feedback-cancelled)]', dotColor: 'bg-[var(--cps-feedback-cancelled)]' },
  aprovado: { label: 'Aprovado', color: 'bg-[var(--cps-feedback-done-light)] text-[var(--cps-feedback-done)]', dotColor: 'bg-[var(--cps-feedback-done)]' },
  rejeitado: { label: 'Rejeitado', color: 'bg-[var(--cps-feedback-cancelled-light)] text-[var(--cps-feedback-cancelled)]', dotColor: 'bg-[var(--cps-feedback-cancelled)]' },
  aguardando_revisao: { label: 'Aguardando Revisão', color: 'bg-[var(--cps-feedback-progress-light)] text-[var(--cps-feedback-progress)]', dotColor: 'bg-[var(--cps-feedback-progress)]' },
  pendente: { label: 'Pendente', color: 'bg-[var(--cps-gray-hover)] text-[var(--cps-blue-base)]', dotColor: 'bg-[var(--cps-blue-base)]' },
};

export const ProjectCard = ({ project, onViewDetails }: ProjectCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="bg-white rounded-[30px] shadow-[var(--cps-shadow-1)] border border-[var(--cps-gray-light)] p-6 hover:shadow-[var(--cps-shadow-1)] transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-[var(--cps-blue-base)] mb-2">{project.title}</h3>
          <p className="text-[var(--cps-gray-text)] text-sm mb-3 line-clamp-2">{project.description}</p>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig[project.status].color}`}>
            {statusConfig[project.status].label}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {project.student && (
          <div className="flex items-center gap-2 text-sm text-[var(--cps-gray-text)]">
            <Users size={16} />
            <span>{project.student.name} - {project.student.course}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-[var(--cps-gray-text)]">
          <Calendar size={16} />
          <span>Início: {formatDate(project.startDate)} | Previsão: {formatDate(project.expectedEndDate)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-[var(--cps-gray-text)]">Progresso</span>
          <span className="text-sm text-[var(--cps-violeta-base-aux)]">{project.progress}%</span>
        </div>
        <div className="w-full bg-[var(--cps-gray-hover)] rounded-full h-2">
          <div
            className="bg-[var(--cps-blue-base)] h-2 rounded-full transition-all duration-300"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      <div className="flex justify-end items-center">
        <Button
          label="Ver Detalhes"
          onClick={() => onViewDetails(project)}
          variant="secondary"
          size="small"
        />
      </div>
    </div>
  );
};
