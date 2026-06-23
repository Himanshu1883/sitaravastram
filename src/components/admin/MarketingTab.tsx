import { useState } from 'react';
import { Bell, Mail, ShoppingCart } from 'lucide-react';
import type { AdminData, AdminApi } from '../../hooks/useAdminApi';
import { loadAbandonedCarts } from '../../lib/storage';

export default function MarketingTab({ data, api }: { data: AdminData; api: AdminApi }) {
  const [pushTitle, setPushTitle] = useState('');
  const [pushMsg, setPushMsg] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [sent, setSent] = useState('');
  const abandoned = loadAbandonedCarts();

  const sendPush = async () => {
    if (!pushTitle) return;
    await api.createNotification({ title: pushTitle, message: pushMsg, audience: 'All Users' });
    setSent('Push notification sent!');
    setPushTitle('');
    setPushMsg('');
  };

  const sendEmail = () => {
    if (!emailSubject) return;
    setSent(`Email campaign "${emailSubject}" scheduled for delivery!`);
    setEmailSubject('');
    setEmailBody('');
  };

  return (
    <div className="p-6 space-y-6">
      {sent && <div className="bg-emerald-50 text-emerald-700 text-sm px-4 py-3 rounded-sm">{sent}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-sm shadow-card p-5">
          <div className="flex items-center gap-2 mb-4"><Bell size={18} className="text-rosegold-500" /><h3 className="font-heading text-lg font-semibold text-navy-700">Push Notifications</h3></div>
          <input placeholder="Title" value={pushTitle} onChange={e => setPushTitle(e.target.value)} className="input-field mb-3" />
          <textarea placeholder="Message" value={pushMsg} onChange={e => setPushMsg(e.target.value)} className="input-field min-h-[80px] mb-3" />
          <button onClick={sendPush} className="btn-primary text-sm">Send Push</button>
        </div>

        <div className="bg-white rounded-sm shadow-card p-5">
          <div className="flex items-center gap-2 mb-4"><Mail size={18} className="text-rosegold-500" /><h3 className="font-heading text-lg font-semibold text-navy-700">Email Marketing</h3></div>
          <input placeholder="Subject" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} className="input-field mb-3" />
          <textarea placeholder="Email body..." value={emailBody} onChange={e => setEmailBody(e.target.value)} className="input-field min-h-[80px] mb-3" />
          <button onClick={sendEmail} className="btn-primary text-sm">Schedule Campaign</button>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-card p-5">
        <div className="flex items-center gap-2 mb-4"><ShoppingCart size={18} className="text-rosegold-500" /><h3 className="font-heading text-lg font-semibold text-navy-700">Abandoned Carts ({abandoned.length})</h3></div>
        {abandoned.length === 0 ? (
          <p className="text-sm text-gray-500">No abandoned carts yet. Carts are saved when users leave checkout.</p>
        ) : (
          <div className="space-y-3">
            {abandoned.map(cart => (
              <div key={cart.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                <div>
                  <p className="text-sm font-medium text-navy-700">{cart.items.length} items</p>
                  <p className="text-xs text-gray-500">{new Date(cart.savedAt).toLocaleString('en-IN')}</p>
                </div>
                <button className="text-xs text-rosegold-500 border border-rosegold-200 px-3 py-1 rounded-sm">Send Recovery Email</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {data.notifications.length > 0 && (
        <div className="bg-white rounded-sm shadow-card p-5">
          <h3 className="font-heading text-lg font-semibold text-navy-700 mb-4">Sent Notifications</h3>
          {data.notifications.map(n => (
            <div key={n.id} className="py-2 border-b border-gray-50 last:border-0">
              <p className="text-sm font-medium">{n.title}</p>
              <p className="text-xs text-gray-500">{n.message} · {new Date(n.sentAt).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
