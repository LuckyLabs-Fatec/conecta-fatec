import { Proposal, ProposalStatus } from "@/domain/proposals/types";
import { Button } from "@/presentation/components";
import { Calendar, User, AlertCircle, CheckCircle, XCircle, Eye, BookOpen } from "lucide-react";

interface ProposalCardProps {
    proposal: Proposal;
    onViewDetails: (proposal: Proposal) => void;
}

const statusConfig: Record<ProposalStatus, { label: string; color: string; icon: any }> = {
    pendente: { label: 'Pendente', color: 'bg-gray-100 text-gray-800', icon: AlertCircle },
    em_analise: { label: 'Em Análise', color: 'bg-blue-100 text-blue-800', icon: Eye },
    aguardando_info: { label: 'Aguardando Info', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    aprovada: { label: 'Aprovada', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    rejeitada: { label: 'Rejeitada', color: 'bg-red-100 text-red-800', icon: XCircle },
    atribuida: { label: 'Atribuída', color: 'bg-purple-100 text-purple-800', icon: BookOpen },
};

export const ProposalCard = ({ proposal, onViewDetails }: ProposalCardProps) => {
    const StatusIcon = statusConfig[proposal.status].icon;
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{proposal.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{proposal.description}</p>
                </div>
                <div className="flex flex-col gap-2 ml-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusConfig[proposal.status].color}`}>
                        <StatusIcon size={12} />
                        {statusConfig[proposal.status].label}
                    </span>
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User size={16} />
                    <span>{proposal.submittedBy.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
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
