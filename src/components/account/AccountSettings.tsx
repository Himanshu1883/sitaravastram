import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import type { AuthUser } from '../../types/auth';
import { updateProfile } from '../../lib/api';
import { openAuthModal, updateUser } from '../../store/authSlice';

export default function AccountSettings({
  user,
  isSignedIn,
}: {
  user: AuthUser | null;
  isSignedIn: boolean;
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
  }, [user?.name, user?.email]);

  const handleSave = async () => {
    if (!isSignedIn || !name.trim()) return;
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      const { user: updated } = await updateProfile({
        name: name.trim(),
        email: email.trim() || undefined,
      });
      dispatch(updateUser(updated));
      setSaved(true);
    } catch {
      setError(t('account.saveError'));
    } finally {
      setSaving(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="rounded-2xl border border-rosegold-100/70 bg-white p-6 shadow-[0_10px_36px_rgba(27,42,74,0.05)]">
        <h2 className="font-heading text-2xl font-semibold text-navy-700">
          {t('account.profileSettings')}
        </h2>
        <p className="mt-2 font-body text-sm text-gray-600">{t('account.signInForOrders')}</p>
        <button
          type="button"
          onClick={() => dispatch(openAuthModal('/account/settings'))}
          className="btn-primary mt-6"
        >
          {t('account.signInOtp')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 font-heading text-2xl font-semibold text-navy-700">
        {t('account.profileSettings')}
      </h2>

      <div className="rounded-2xl border border-rosegold-100/70 bg-white p-6 shadow-[0_10px_36px_rgba(27,42,74,0.05)]">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
              {t('account.fullName')}
            </label>
            <input
              className="input-field"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('account.fullNamePlaceholder')}
            />
          </div>
          <div>
            <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
              {t('account.email')}
            </label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-body text-xs font-medium text-gray-600">
              {t('account.phone')}
            </label>
            <input
              className="input-field bg-cream-50 text-gray-500"
              value={user?.phone ? `+91 ${user.phone}` : ''}
              readOnly
            />
            <p className="mt-1 font-body text-[11px] text-gray-400">{t('account.phoneReadonly')}</p>
          </div>
        </div>

        {error && <p className="mt-4 font-body text-sm text-red-500">{error}</p>}
        {saved && (
          <p className="mt-4 font-body text-sm text-emerald-600">{t('account.saved')}</p>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !name.trim()}
          className="btn-primary mt-6 inline-flex items-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 size={16} className="animate-spin" />}
          {t('account.saveChanges')}
        </button>
      </div>
    </div>
  );
}
