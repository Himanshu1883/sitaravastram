import type { ReactNode } from 'react';

export default function AccountEmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-rosegold-100/70 bg-white px-6 py-14 text-center shadow-[0_10px_36px_rgba(27,42,74,0.05)]">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cream-100 text-rosegold-400">
        {icon}
      </div>
      <h3 className="font-heading text-xl font-semibold text-navy-700">{title}</h3>
      {description && (
        <p className="mx-auto mt-2 max-w-sm font-body text-sm text-gray-500">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
