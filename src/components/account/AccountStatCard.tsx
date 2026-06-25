export default function AccountStatCard({
  label,
  value,
  tone = 'navy',
}: {
  label: string;
  value: string | number;
  tone?: 'navy' | 'emerald' | 'rosegold';
}) {
  const valueColor =
    tone === 'emerald'
      ? 'text-emerald-600'
      : tone === 'rosegold'
        ? 'text-rosegold-500'
        : 'text-navy-700';

  return (
    <div className="rounded-2xl border border-rosegold-100/70 bg-white p-4 text-center shadow-[0_10px_36px_rgba(27,42,74,0.05)] sm:p-5">
      <p className={`font-heading text-2xl font-bold tabular-nums sm:text-3xl ${valueColor}`}>
        {value}
      </p>
      <p className="mt-1 font-body text-xs text-gray-500">{label}</p>
    </div>
  );
}
