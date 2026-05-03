import { ProposalHeader } from '@/presentation/components/molecules/ProposalHeader';
import { ProposalStats } from '@/presentation/components/molecules/ProposalStats';
import { ProposalFilters } from '@/presentation/components/molecules/ProposalFilters';
import { ProposalList } from '@/presentation/components/organisms/ProposalList';
import { ProposalModal } from '@/presentation/components/organisms/ProposalModal';
import { Proposal } from '@/domain/proposals/types';

interface MyProposalsContainerProps {
  title?: string;
  description?: string;
  proposals: Proposal[];
  filteredProposals: Proposal[];
  loading: boolean;
  error: string | null;
  search: string;
  statusFilter: string;
  counts: {
    total: number;
    em_analise: number;
    aprovada: number;
    rejeitada: number;
  };
  selectedProposal: Proposal | null;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onClearFilters: () => void;
  onViewDetails: (proposal: Proposal | null) => void;
}

export const MyProposalsContainer = ({
  title = 'Minhas Propostas',
  description = 'Consulte as propostas enviadas pela comunidade e acompanhe a evolução de cada uma.',
  proposals,
  filteredProposals,
  loading,
  error,
  search,
  statusFilter,
  counts,
  selectedProposal,
  onSearchChange,
  onStatusChange,
  onRefresh,
  onClearFilters,
  onViewDetails,
}: MyProposalsContainerProps) => {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        <ProposalHeader 
          title={title} 
          description={description} 
          showNewButton={proposals.length > 0 || !error}
        />

        <div className="mb-6">
          <ProposalStats 
            total={counts.total}
            inAnalysis={counts.em_analise}
            approved={counts.aprovada}
            rejected={counts.rejeitada}
          />
        </div>

        <div className="mb-6">
          <ProposalFilters
            search={search}
            statusFilter={statusFilter}
            onSearchChange={onSearchChange}
            onStatusChange={onStatusChange}
            onRefresh={onRefresh}
            onClear={onClearFilters}
            isLoading={loading}
            resultCount={filteredProposals.length}
          />
        </div>

        <div className="mb-8">
          <ProposalList
            proposals={filteredProposals}
            loading={loading}
            error={error}
            onViewDetails={onViewDetails}
          />
        </div>

        {selectedProposal && (
          <ProposalModal
            proposal={selectedProposal}
            onClose={() => onViewDetails(null)}
          />
        )}
      </div>
    </main>
  );
};
