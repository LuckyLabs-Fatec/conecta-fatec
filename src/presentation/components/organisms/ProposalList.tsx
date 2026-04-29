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
        return <div className="text-center py-12 text-gray-500">Carregando propostas...</div>;
    }

    if (error) {
        return <div className="text-center py-12 text-red-600">{error}</div>;
    }

    if (proposals.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <Eye size={64} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                    Nenhuma proposta encontrada
                </h3>
                <p className="text-gray-500">
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
