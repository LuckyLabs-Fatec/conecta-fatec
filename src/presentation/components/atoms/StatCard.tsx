interface StatCardProps {
  label: string;
  value: number;
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="rounded-[30px] bg-white p-4 shadow-[var(--cps-shadow-1)] ring-1 ring-[var(--cps-gray-light)]">
      <div className="text-sm text-[var(--cps-gray-text)]">{label}</div>
      <div className="text-2xl font-bold text-[var(--cps-blue-base)]">{value}</div>
    </div>
  );
};
