import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  change?: number | null;
  changeLabel?: string;
  icon: LucideIcon;
  iconClassName?: string;
  accent?: 'navy' | 'rose' | 'amber' | 'emerald';
}

const accentStyles = {
  navy: 'bg-navy-50 text-navy-700',
  rose: 'bg-rosegold-50 text-rosegold-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
};

export default function StatCard({
  label,
  value,
  hint,
  change,
  changeLabel,
  icon: Icon,
  iconClassName = '',
  accent = 'navy',
}: StatCardProps) {
  const showChange = change !== undefined && change !== null;
  const isUp = showChange && change >= 0;

  return (
    <div className="admin-card p-5 sm:p-6 group hover:shadow-luxury transition-shadow duration-300">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentStyles[accent]}`}
        >
          <Icon size={20} className={iconClassName} strokeWidth={1.75} />
        </div>
        {showChange && (
          <span
            className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
              isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(change)}%
          </span>
        )}
        {!showChange && changeLabel && (
          <span className="text-xs font-medium text-gray-400">{changeLabel}</span>
        )}
      </div>
      <p className="font-heading text-2xl sm:text-[1.75rem] font-bold text-navy-700 tracking-tight">
        {value}
      </p>
      <p className="font-body text-sm text-gray-500 mt-1">{label}</p>
      {hint && <p className="font-body text-xs text-gray-400 mt-0.5">{hint}</p>}
    </div>
  );
}
