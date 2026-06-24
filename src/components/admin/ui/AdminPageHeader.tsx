import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function AdminPageHeader({
  title,
  description,
  actions,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 sm:mb-8">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-semibold text-navy-700 tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="font-body text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
