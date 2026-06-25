import { Bell, CheckCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../hooks/useNotifications';
import AccountEmptyState from './AccountEmptyState';

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function AccountNotifications() {
  const { t } = useTranslation();
  const { items, unreadCount, markOneRead, markAllRead } = useNotifications();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-navy-700">
            {t('account.notifications')}
          </h2>
          {unreadCount > 0 && (
            <p className="mt-1 font-body text-sm text-gray-500">
              {t('account.unreadCount', { count: unreadCount })}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllRead} className="btn-outline-navy text-xs">
            <CheckCheck size={14} />
            {t('account.markAllRead')}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <AccountEmptyState
          icon={<Bell size={28} />}
          title={t('account.noNotifications')}
          description={t('account.noNotificationsSubtitle')}
        />
      ) : (
        <ul className="space-y-3">
          {items.map(note => (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => !note.read && markOneRead(note.id)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  note.read
                    ? 'border-rosegold-100/70 bg-white'
                    : 'border-rosegold-200 bg-cream-50/80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-navy-700">{note.title}</p>
                    <p className="mt-1 font-body text-sm leading-relaxed text-gray-600">
                      {note.message}
                    </p>
                    <p className="mt-2 font-body text-xs text-gray-400">{formatWhen(note.createdAt)}</p>
                    {note.orderId && (
                      <Link
                        to="/account/orders"
                        onClick={e => e.stopPropagation()}
                        className="mt-2 inline-block font-body text-xs font-semibold text-rosegold-600 hover:underline"
                      >
                        {t('account.viewOrder')}
                      </Link>
                    )}
                  </div>
                  {!note.read && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-rosegold-500" />
                  )}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
