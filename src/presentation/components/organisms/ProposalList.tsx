import { Proposal } from "@/domain/proposals/types";
import { ProposalCard } from "@/presentation/components/molecules/ProposalCard";
import { Eye } from "lucide-react";

interface ProposalListProps {
    proposals: Proposal[];
    loading: boolean;
    error: string | null;
    onViewDetails: (proposal: Proposal) => void;
}

export const ProposalList = ({ proposals, loading, error, onViewDetails }: ProposalListProps) => {
    if (loading) {
        return <div className="text-center py-12 text-[var(--cps-gray-text)]">Carregando propostas...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-[var(--cps-feedback-cancelled)]">{error}</div>;
    }

    if (proposals.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-[var(--cps-gray-text)] mb-4">
                    <Eye size={64} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-[var(--cps-gray-text)] mb-2">
                    Nenhuma proposta encontrada
                </h3>
                <p className="text-[var(--cps-gray-text)]">
                    Tente ajustar os filtros ou aguarde novas submissões.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {proposals.map(proposal => (
                <ProposalCard
                    key={proposal.id}
                    proposal={proposal}
                    onViewDetails={onViewDetails}
                />
            ))}
        </div>
    );
};
