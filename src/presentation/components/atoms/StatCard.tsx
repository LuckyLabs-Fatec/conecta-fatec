interface StatCardProps {
  label: string;
  value: number;
}

export const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-100">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};
