import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

interface ProposalHeaderProps {
  title: string;
  description: string;
  showNewButton?: boolean;
}

export const ProposalHeader = ({ 
  title, 
  description, 
  showNewButton = true 
}: ProposalHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[var(--cps-blue-base)]">{title}</h1>
        <p className="mt-2 text-[var(--cps-gray-text)]">{description}</p>
      </div>

      {showNewButton && (
        <Link
          href="/submeter-proposta"
          className="inline-flex items-center gap-2 rounded-[30px] bg-[var(--cps-blue-base)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--cps-blue-text-hover)]"
        >
          <PlusCircle size={18} />
          Nova proposta
        </Link>
      )}
    </div>
  );
};
