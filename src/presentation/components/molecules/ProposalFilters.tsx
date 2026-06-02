import { Search, Filter } from 'lucide-react';

interface ProposalFiltersProps {
  search: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onRefresh: () => void;
  onClear: () => void;
  isLoading?: boolean;
  resultCount: number;
}

export const ProposalFilters = ({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
  onRefresh,
  onClear,
  isLoading = false,
  resultCount,
}: ProposalFiltersProps) => {
  return (
    <div className="rounded-[30px] bg-white p-4 shadow-[var(--cps-shadow-1)] ring-1 ring-[var(--cps-gray-light)]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_240px]">
        <div>
          <label htmlFor="search-input" className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--cps-gray-text)]">
            <Search size={16} />
            Pesquisar
          </label>
          <input
            id="search-input"
            type="text"
            placeholder="Buscar por título ou descrição"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            className="w-full rounded-[30px] border border-[var(--cps-gray-light)] px-3 py-2 outline-none transition-colors focus:border-[var(--cps-blue-base)] focus:ring-2 focus:ring-[var(--cps-blue-base)]/20"
          />
        </div>

        <div>
          <label htmlFor="status-select" className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--cps-gray-text)]">
            <Filter size={16} />
            Status
          </label>
          <select
            id="status-select"
            value={statusFilter}
            onChange={(event) => onStatusChange(event.target.value)}
            className="w-full rounded-[30px] border border-[var(--cps-gray-light)] px-3 py-2 outline-none transition-colors focus:border-[var(--cps-blue-base)] focus:ring-2 focus:ring-[var(--cps-blue-base)]/20"
          >
            <option value="">Todos os status</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em análise</option>
            <option value="aguardando_info">Aguardando info</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
            <option value="atribuida">Atribuída</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--cps-gray-text)]">
          {resultCount} proposta(s) encontrada(s)
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="text-sm font-medium text-[var(--cps-blue-base)] transition-colors hover:text-[var(--cps-blue-text-hover)] disabled:opacity-50"
          >
            {isLoading ? 'Atualizando...' : 'Atualizar'}
          </button>
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-medium text-[var(--cps-blue-base)] transition-colors hover:text-[var(--cps-blue-text-hover)]"
          >
            Limpar filtros
          </button>
        </div>
      </div>
    </div>
  );
};
