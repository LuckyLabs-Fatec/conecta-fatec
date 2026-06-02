import { Proposal, ProposalStatus } from "@/domain/proposals/types";
import { Button } from "@/presentation/components";
import { Calendar, User, AlertCircle, CheckCircle, XCircle, Eye, BookOpen } from "lucide-react";

interface ProposalCardProps {
    proposal: Proposal;
    onViewDetails: (proposal: Proposal) => void;
}

const statusConfig: Record<ProposalStatus, { label: string; color: string; icon: any }> = {
    pendente: { label: 'Pendente', color: 'bg-[var(--cps-gray-hover)] text-[var(--cps-blue-base)]', icon: AlertCircle },
    em_analise: { label: 'Em Análise', color: 'bg-[var(--cps-silver-base)] text-[var(--cps-blue-base)]', icon: Eye },
    aguardando_info: { label: 'Aguardando Info', color: 'bg-[var(--cps-feedback-progress-light)] text-[var(--cps-feedback-progress)]', icon: AlertCircle },
    aprovada: { label: 'Aprovada', color: 'bg-[var(--cps-feedback-done-light)] text-[var(--cps-feedback-done)]', icon: CheckCircle },
    rejeitada: { label: 'Rejeitada', color: 'bg-[var(--cps-feedback-cancelled-light)] text-[var(--cps-feedback-cancelled)]', icon: XCircle },
    atribuida: { label: 'Atribuída', color: 'bg-[var(--cps-gray-hover)] text-[var(--cps-violeta-base-aux)]', icon: BookOpen },
};

const fallbackStatusConfig = statusConfig.pendente;

const resolveStatusConfig = (status: string) => {
    return status in statusConfig
        ? statusConfig[status as ProposalStatus]
        : fallbackStatusConfig;
};

export const ProposalCard = ({ proposal, onViewDetails }: ProposalCardProps) => {
    const currentStatus = resolveStatusConfig(proposal.status);
    const StatusIcon = currentStatus.icon;
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="bg-white rounded-[30px] shadow-[var(--cps-shadow-1)] border border-[var(--cps-gray-light)] p-6 hover:shadow-[var(--cps-shadow-1)] transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[var(--cps-blue-base)] mb-2">{proposal.title}</h3>
                    <p className="text-[var(--cps-gray-text)] text-sm mb-3 line-clamp-2">{proposal.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${currentStatus.color}`}>
                        <StatusIcon size={12} />
                        {currentStatus.label}
                    </span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-[var(--cps-gray-text)]">
                    <User size={16} />
                    <span>{proposal.submittedBy.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--cps-gray-text)]">
                    <Calendar size={16} />
                    <span>{formatDate(proposal.submittedAt)}</span>
                </div>
            </div>

            <div className="flex justify-end items-center">
                <Button
                    label="Ver Detalhes"
                    onClick={() => onViewDetails(proposal)}
                    variant="secondary"
                    size="small"
                />
            </div>
        </div>
    );
};
