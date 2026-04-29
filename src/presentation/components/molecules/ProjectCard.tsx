import { Project, ProjectStatus } from "@/domain/projects/types";
import { Button } from "@/presentation/components";
import { Calendar, Users } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onViewDetails: (project: Project) => void;
}

const statusConfig: Record<ProjectStatus, { label: string; color: string; dotColor?: string }> = {
  em_analise: { label: 'Em Análise', color: 'bg-gray-100 text-gray-800', dotColor: 'bg-gray-400' },
  em_desenvolvimento: { label: 'Em Desenvolvimento', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-500' },
  testando: { label: 'Testando', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-500' },
  concluido: { label: 'Concluído', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
  suspenso: { label: 'Suspenso', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
  aprovado: { label: 'Aprovado', color: 'bg-emerald-100 text-emerald-800', dotColor: 'bg-emerald-500' },
  rejeitado: { label: 'Rejeitado', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
  aguardando_revisao: { label: 'Aguardando Revisão', color: 'bg-orange-100 text-orange-800', dotColor: 'bg-orange-500' },
  pendente: { label: 'Pendente', color: 'bg-gray-100 text-gray-800', dotColor: 'bg-gray-400' },
};

export const ProjectCard = ({ project, onViewDetails }: ProjectCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
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
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {project.student && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{project.student.name} - {project.student.course}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Início: {formatDate(project.startDate)} | Previsão: {formatDate(project.expectedEndDate)}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progresso</span>
          <span className="text-sm text-[var(--cps-violeta-base-aux)]">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[var(--cps-violeta-base-aux)] h-2 rounded-full transition-all duration-300"
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
