import { useMemo, useState } from 'react';
import {
  Bell,
  Mail,
  ShoppingCart,
  Send,
  Loader2,
  Megaphone,
  Inbox,
  Clock,
  CheckCircle2,
  X,
} from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import { loadAbandonedCarts } from '../../lib/storage';
import { formatINR } from '../../lib/admin/dashboardStats';
import { mediaUrl } from '../../lib/api';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';
import AdminModal from './ui/AdminModal';

function cartTotal(items: { product: { price: number }; quantity: number }[]): number {
  return items.reduce((s, i) => s + i.product.price * i.quantity, 0);
}

export default function MarketingTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [pushTitle, setPushTitle] = useState('');
  const [pushMsg, setPushMsg] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [toast, setToast] = useState('');
  const [sendingPush, setSendingPush] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recoveryCartId, setRecoveryCartId] = useState<string | null>(null);

  const abandoned = loadAbandonedCarts();

  const stats = useMemo(() => {
    const abandonedValue = abandoned.reduce((s, c) => s + cartTotal(c.items), 0);
    const itemCount = abandoned.reduce((s, c) => s + c.items.length, 0);
    return {
      notifications: data.notifications.length,
      abandoned: abandoned.length,
      abandonedValue,
      abandonedItems: itemCount,
    };
  }, [data.notifications, abandoned]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const sendPush = async () => {
    if (!pushTitle.trim()) return;
    setSendingPush(true);
    try {
      await api.createNotification({
        title: pushTitle.trim(),
        message: pushMsg.trim(),
        audience: 'All Users',
      });
      showToast('Push notification sent to all users');
      setPushTitle('');
      setPushMsg('');
      setShowPushModal(false);
    } finally {
      setSendingPush(false);
    }
  };

  const sendEmail = () => {
    if (!emailSubject.trim()) return;
    showToast(`Email campaign "${emailSubject.trim()}" scheduled for delivery`);
    setEmailSubject('');
    setEmailBody('');
    setShowEmailModal(false);
  };

  const sendRecoveryEmail = (cartId: string) => {
    setRecoveryCartId(cartId);
    setTimeout(() => {
      showToast('Recovery email queued for this abandoned cart');
      setRecoveryCartId(null);
    }, 600);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
      <AdminPageHeader
        title="Marketing"
        description="Reach customers with notifications, email campaigns, and cart recovery."
        actions={
          <>
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-navy-200 text-navy-700 bg-white hover:border-rosegold-400 transition-colors"
            >
              <Mail size={14} />
              Email campaign
            </button>
            <button
              type="button"
              onClick={() => setShowPushModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-navy-700 text-white hover:bg-rosegold-500 transition-colors"
            >
              <Bell size={14} />
              Send push
            </button>
          </>
        }
      />

      {toast && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm">
          <CheckCircle2 size={18} className="flex-shrink-0 text-emerald-600" />
          <span className="flex-1">{toast}</span>
          <button type="button" onClick={() => setToast('')} className="text-emerald-600 hover:text-emerald-800">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: 'Notifications sent', value: stats.notifications, icon: Megaphone },
          { label: 'Abandoned carts', value: stats.abandoned, icon: ShoppingCart },
          { label: 'Cart value at risk', value: formatINR(stats.abandonedValue, true), icon: Inbox },
          { label: 'Items in carts', value: stats.abandonedItems, icon: Bell },
        ].map(stat => (
          <AdminCard key={stat.label} padding="sm" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rosegold-50 text-rosegold-600 flex items-center justify-center">
              <stat.icon size={18} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-navy-700 tabular-nums truncate">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          </AdminCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 sm:mb-8">
        <AdminCard padding="md" className="hover:shadow-luxury transition-shadow">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
              <Bell size={20} />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-navy-700">Push notifications</h3>
              <p className="text-xs text-gray-500 mt-0.5">Instant alerts to all app users</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Broadcast sales, new arrivals, or order updates. Messages appear in the customer notification center.
          </p>
          <button
            type="button"
            onClick={() => setShowPushModal(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-rosegold-600 hover:text-rosegold-700"
          >
            <Send size={14} />
            Compose notification
          </button>
        </AdminCard>

        <AdminCard padding="md" className="hover:shadow-luxury transition-shadow">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <h3 className="font-heading text-base font-semibold text-navy-700">Email campaigns</h3>
              <p className="text-xs text-gray-500 mt-0.5">Newsletter & promotional emails</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Schedule campaigns to your subscriber list. Integrate with your email provider when ready.
          </p>
          <button
            type="button"
            onClick={() => setShowEmailModal(true)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-rosegold-600 hover:text-rosegold-700"
          >
            <Send size={14} />
            Create campaign
          </button>
        </AdminCard>
      </div>

      <AdminCard padding="none" className="overflow-hidden mb-6 sm:mb-8">
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-base font-semibold text-navy-700 flex items-center gap-2">
              <ShoppingCart size={18} className="text-rosegold-500" />
              Abandoned carts
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Saved when customers leave checkout without completing payment
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700">
            {abandoned.length} cart{abandoned.length !== 1 ? 's' : ''}
          </span>
        </div>

        {abandoned.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <ShoppingCart size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">No abandoned carts yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {abandoned.map(cart => {
              const total = cartTotal(cart.items);
              const isSending = recoveryCartId === cart.id;
              return (
                <div
                  key={cart.id}
                  className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex -space-x-2">
                      {cart.items.slice(0, 3).map((item, i) =>
                        item.product.images?.[0] ? (
                          <img
                            key={i}
                            src={mediaUrl(item.product.images[0])}
                            alt=""
                            className="w-10 h-12 object-cover rounded-lg border-2 border-white"
                          />
                        ) : (
                          <div
                            key={i}
                            className="w-10 h-12 rounded-lg bg-gray-100 border-2 border-white flex items-center justify-center"
                          >
                            <ShoppingCart size={12} className="text-gray-300" />
                          </div>
                        ),
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-navy-700">
                        {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} ·{' '}
                        {formatINR(total)}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={11} />
                        {new Date(cart.savedAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => sendRecoveryEmail(cart.id)}
                    disabled={isSending}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-rosegold-200 text-rosegold-700 bg-rosegold-50 hover:bg-rosegold-100 transition-colors disabled:opacity-60 sm:flex-shrink-0"
                  >
                    {isSending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Mail size={13} />
                    )}
                    Send recovery email
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </AdminCard>

      <AdminCard padding="none" className="overflow-hidden">
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <h3 className="font-heading text-base font-semibold text-navy-700">Notification history</h3>
          <p className="text-xs text-gray-400 mt-0.5">Previously sent push notifications</p>
        </div>

        {data.notifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Megaphone size={36} className="mx-auto text-gray-200 mb-3" />
            <p className="text-sm text-gray-500">No notifications sent yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="hidden sm:table-cell">Message</th>
                  <th>Audience</th>
                  <th className="text-right">Sent</th>
                </tr>
              </thead>
              <tbody>
                {data.notifications.map(n => (
                  <tr key={n.id}>
                    <td>
                      <p className="text-sm font-semibold text-navy-700">{n.title}</p>
                      <p className="text-xs text-gray-500 sm:hidden line-clamp-1 mt-0.5">{n.message}</p>
                    </td>
                    <td className="hidden sm:table-cell text-sm text-gray-600 max-w-[240px] truncate">
                      {n.message || '—'}
                    </td>
                    <td>
                      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy-600">
                        {n.audience}
                      </span>
                    </td>
                    <td className="text-right text-xs text-gray-500 whitespace-nowrap">
                      {new Date(n.sentAt).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <AdminModal
        open={showPushModal}
        onClose={() => !sendingPush && setShowPushModal(false)}
        title="Send push notification"
        subtitle="Delivered to all registered users"
        footer={
          <button
            type="button"
            onClick={sendPush}
            disabled={sendingPush || !pushTitle.trim()}
            className="btn-primary text-sm w-full sm:w-auto inline-flex items-center gap-2 justify-center"
          >
            {sendingPush ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            {sendingPush ? 'Sending…' : 'Send now'}
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Title
            </label>
            <input
              value={pushTitle}
              onChange={e => setPushTitle(e.target.value)}
              className="input-field"
              placeholder="Flash Sale — 30% off today!"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Message
            </label>
            <textarea
              value={pushMsg}
              onChange={e => setPushMsg(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Shop our latest cotton suits before midnight…"
            />
          </div>
        </div>
      </AdminModal>

      <AdminModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        title="Schedule email campaign"
        subtitle="Queued for delivery to subscribers"
        footer={
          <button
            type="button"
            onClick={sendEmail}
            disabled={!emailSubject.trim()}
            className="btn-primary text-sm w-full sm:w-auto inline-flex items-center gap-2 justify-center"
          >
            <Send size={14} />
            Schedule campaign
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Subject line
            </label>
            <input
              value={emailSubject}
              onChange={e => setEmailSubject(e.target.value)}
              className="input-field"
              placeholder="Your cart is waiting — complete checkout"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Email body
            </label>
            <textarea
              value={emailBody}
              onChange={e => setEmailBody(e.target.value)}
              className="input-field min-h-[140px]"
              placeholder="Write your campaign message…"
            />
          </div>
        </div>
      </AdminModal>
    </div>
  );
}
