'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Header } from '@/presentation/components';
import { MyProposalsContainer } from '@/presentation/components/organisms/MyProposalsContainer';
import { useAuth } from '@/presentation/hooks/useAuth';
import { useMyProposals } from '@/presentation/hooks/useMyProposals';
import { Proposal } from '@/domain/proposals/types';

export default function MinhasPropostasPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  const isCommunityUser = (user?.user_metadata?.role ?? user?.role ?? '').toLowerCase() === 'comunidade';

  const { proposals, loading, error, refetch } = useMyProposals({
    enabled: isAuthenticated && isCommunityUser,
    authorEmail: user?.email,
  });

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.replace('/autenticacao');
      return;
    }

    if (!isCommunityUser) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, isCommunityUser, router]);

  const filteredProposals = useMemo(() => {
    const q = search.trim().toLowerCase();

    return proposals.filter((proposal) => {
      if (q && !(proposal.title.toLowerCase().includes(q) || proposal.description.toLowerCase().includes(q))) {
        return false;
      }

      if (statusFilter && proposal.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [proposals, search, statusFilter]);

  const counts = useMemo(() => ({
    em_analise: proposals.filter((proposal) => proposal.status === 'em_analise').length,
    aprovada: proposals.filter((proposal) => proposal.status === 'aprovada').length,
    rejeitada: proposals.filter((proposal) => proposal.status === 'rejeitada').length,
    total: proposals.length,
  }), [proposals]);

  if (isLoading || !isAuthenticated || !isCommunityUser) {
    return null;
  }

  return (
    <>
      <Header />
      <MyProposalsContainer
        proposals={proposals}
        filteredProposals={filteredProposals}
        loading={loading}
        error={error}
        search={search}
        statusFilter={statusFilter}
        counts={counts}
        selectedProposal={selectedProposal}
        onSearchChange={setSearch}
        onStatusChange={setStatusFilter}
        onRefresh={refetch}
        onClearFilters={() => {
          setSearch('');
          setStatusFilter('');
        }}
        onViewDetails={setSelectedProposal}
      />
    </>
  );
}
