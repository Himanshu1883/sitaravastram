import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export default function AdminModal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
}: AdminModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${sizeClass[size]} bg-white rounded-t-2xl sm:rounded-2xl shadow-luxury-lg max-h-[90vh] flex flex-col animate-fade-in`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <div className="min-w-0">
            <h3
              id="admin-modal-title"
              className="font-heading text-lg font-semibold text-navy-700 truncate"
            >
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-1 rounded-xl text-gray-400 hover:text-navy-700 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">{children}</div>

        {footer && (
          <div className="px-5 sm:px-6 py-4 border-t border-gray-100 bg-cream-100/40 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
