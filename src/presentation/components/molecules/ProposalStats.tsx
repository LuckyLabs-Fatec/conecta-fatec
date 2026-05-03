import { StatCard } from '@/presentation/components/atoms/StatCard';

interface ProposalStatsProps {
  total: number;
  inAnalysis: number;
  approved: number;
  rejected: number;
}

export const ProposalStats = ({ total, inAnalysis, approved, rejected }: ProposalStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
      <StatCard label="Total" value={total} />
      <StatCard label="Em análise" value={inAnalysis} />
      <StatCard label="Aprovadas" value={approved} />
      <StatCard label="Rejeitadas" value={rejected} />
    </div>
  );
};
