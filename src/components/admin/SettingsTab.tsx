import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  Loader2,
  CheckCircle2,
  X,
  KeyRound,
} from 'lucide-react';
import {
  adminFetchSettings,
  adminUpdateProfile,
  adminChangePassword,
  type AdminSettings,
} from '../../lib/api';
import { updateUser, selectAuthUser } from '../../store/authSlice';
import AdminPageHeader from './ui/AdminPageHeader';
import AdminCard from './ui/AdminCard';

function userInitials(name?: string, email?: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return 'AD';
}

export default function SettingsTab() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(selectAuthUser);

  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    adminFetchSettings()
      .then(data => {
        setSettings(data);
        setName(data.user.name || '');
        setEmail(data.user.email || '');
        setError(null);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const showProfileToast = (msg: string) => {
    setProfileMsg(msg);
    setTimeout(() => setProfileMsg(''), 4000);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const { user } = await adminUpdateProfile({
        name: name.trim(),
        email: email.trim() || undefined,
      });
      dispatch(updateUser(user));
      setSettings(prev =>
        prev ? { ...prev, user } : prev,
      );
      showProfileToast('Profile updated successfully');
    } catch (err) {
      setProfileMsg(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordMsg('');

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      const res = await adminChangePassword({ currentPassword, newPassword });
      setPasswordMsg(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[40vh]">
        <Loader2 size={28} className="animate-spin text-rosegold-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  const user = settings?.user ?? sessionUser;
  const loginMethod = settings?.loginMethod ?? 'email';
  const canChangePassword = settings?.canChangePassword ?? false;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[800px]">
      <AdminPageHeader
        title="Settings"
        description="Manage your admin account, contact details, and security."
      />

      {profileMsg && (
        <div
          className={`mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${
            profileMsg.includes('success')
              ? 'bg-emerald-50 border border-emerald-100 text-emerald-800'
              : 'bg-red-50 border border-red-100 text-red-700'
          }`}
        >
          {profileMsg.includes('success') ? (
            <CheckCircle2 size={18} className="flex-shrink-0" />
          ) : null}
          <span className="flex-1">{profileMsg}</span>
          <button type="button" onClick={() => setProfileMsg('')}>
            <X size={16} />
          </button>
        </div>
      )}

      <AdminCard padding="md" className="mb-6">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-700 to-navy-500 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
            {userInitials(user?.name, user?.email)}
          </div>
          <div>
            <p className="font-heading text-lg font-semibold text-navy-700">
              {user?.name || 'Admin'}
            </p>
            <p className="text-sm text-gray-500">{user?.email || user?.phone || '—'}</p>
            <span
              className={`inline-flex mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${
                loginMethod === 'email'
                  ? 'bg-violet-50 text-violet-700 ring-violet-100'
                  : 'bg-blue-50 text-blue-700 ring-blue-100'
              }`}
            >
              {loginMethod === 'email' ? 'Email login' : 'Phone OTP login'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} className="text-rosegold-500" />
            <h3 className="font-heading text-base font-semibold text-navy-700">Profile</h3>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Display name
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
              Email address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="admin@sitaravastram.com"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Used for account recovery and notifications</p>
          </div>

          {user?.phone && (
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                Phone number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={`+91 ${user.phone}`}
                  disabled
                  className="input-field pl-10 bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Phone is linked to your OTP login and cannot be changed here
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={savingProfile || !name.trim()}
            className="btn-primary text-sm inline-flex items-center gap-2"
          >
            {savingProfile && <Loader2 size={14} className="animate-spin" />}
            {savingProfile ? 'Saving…' : 'Save profile'}
          </button>
        </form>
      </AdminCard>

      <AdminCard padding="md">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} className="text-rosegold-500" />
          <h3 className="font-heading text-base font-semibold text-navy-700">Security</h3>
        </div>

        {canChangePassword ? (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordMsg && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
                <CheckCircle2 size={16} />
                {passwordMsg}
              </div>
            )}
            {passwordError && (
              <div className="px-3 py-2 rounded-lg bg-red-50 text-red-600 text-sm">{passwordError}</div>
            )}

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                Current password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="input-field pl-10"
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                  New password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="input-field pl-10"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 block mb-1.5">
                  Confirm new password
                </label>
                <div className="relative">
                  <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="input-field pl-10"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-navy-200 text-navy-700 hover:border-rosegold-400 hover:text-rosegold-700 transition-colors disabled:opacity-50"
            >
              {savingPassword && <Loader2 size={14} className="animate-spin" />}
              Update password
            </button>
          </form>
        ) : (
          <div className="rounded-xl bg-cream-100/80 border border-gray-100 px-4 py-4">
            <p className="text-sm text-gray-600">
              You sign in with <span className="font-semibold text-navy-700">phone OTP</span>.
              Password change is not available for this account type.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              To use email & password login, contact support or use the email admin account at{' '}
              <code className="text-rosegold-600">/admin/login</code>.
            </p>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
