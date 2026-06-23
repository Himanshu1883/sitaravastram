import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, AlertCircle, Loader2, Sparkles, Truck, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Logo from '../ui/Logo';
import {
  closeAuthModal,
  login,
  selectAuth,
} from '../../store/authSlice';
import { sendOtp, verifyOtp } from '../../lib/api';
import {
  normalizeIndianMobile,
  validateIndianMobile,
} from '../../lib/otpAuth';

type AuthStep = 'phone' | 'otp';

const perks = [
  { key: 'perkEarlyAccess', icon: Sparkles },
  { key: 'perkFreeShipping', icon: Truck },
  { key: 'perkEasyReturns', icon: RefreshCw },
] as const;

export default function AuthModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authModalOpen, authRedirect } = useSelector(selectAuth);

  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [notifyOffers, setNotifyOffers] = useState(true);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setPhoneError('');
    setOtpError('');
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    dispatch(closeAuthModal());
  };

  useEffect(() => {
    if (!authModalOpen) resetForm();
  }, [authModalOpen]);

  useEffect(() => {
    if (!authModalOpen) return;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [authModalOpen]);

  const handleSendOtp = async () => {
    const normalized = normalizeIndianMobile(phone);
    if (!validateIndianMobile(normalized)) {
      setPhoneError(t('auth.invalidMobile'));
      return;
    }
    setPhoneError('');
    setLoading(true);
    try {
      await sendOtp(normalized);
      setPhone(normalized);
      setStep('otp');
      setOtp('');
      setOtpError('');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.replace(/\D/g, '').length !== 6) {
      setOtpError(t('auth.otpRequired'));
      return;
    }
    try {
      const { token, user } = await verifyOtp(phone, otp);
      dispatch(login({ phone: user.phone, token }));
      dispatch(closeAuthModal());
      resetForm();
      navigate(authRedirect);
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : t('auth.invalidOtp'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      await sendOtp(phone);
      setOtp('');
      setOtpError('');
    } finally {
      setLoading(false);
    }
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {authModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.button
            type="button"
            aria-label={t('auth.close')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="relative flex w-full max-w-[920px] overflow-hidden rounded-2xl bg-white shadow-luxury-xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              aria-label={t('auth.close')}
              className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy-700 shadow-md transition-colors hover:bg-white sm:right-4 sm:top-4"
            >
              <X size={18} strokeWidth={2} />
            </button>

            {/* Left — brand panel */}
            <div className="hidden w-[42%] flex-col justify-between bg-gradient-to-br from-navy-800 via-navy-700 to-navy-900 p-8 lg:flex">
              <div>
                <Logo size="md" className="mb-8 brightness-0 invert" />
                <h2 className="font-heading text-2xl font-semibold leading-snug text-white">
                  {t('auth.welcome')}
                </h2>
                <p className="mt-2 font-body text-sm leading-relaxed text-white/70">
                  {t('auth.welcomeSub')}
                </p>
              </div>

              <div className="space-y-3">
                {perks.map(({ key, icon: Icon }) => (
                  <div
                    key={key}
                    className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Icon size={14} className="text-rosegold-400" />
                      <span className="font-body text-xs font-bold uppercase tracking-wide text-white">
                        {t(`auth.${key}`)}
                      </span>
                    </div>
                    <p className="font-body text-xs leading-relaxed text-white/65">
                      {t(`auth.${key}Desc`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-10 lg:w-[58%] lg:py-12">
              <div className="lg:hidden mb-6 flex justify-center">
                <Logo size="sm" />
              </div>

              <h1
                id="auth-modal-title"
                className="mb-6 font-heading text-2xl font-bold text-navy-900 sm:text-[1.65rem]"
              >
                {t('auth.loginSignup')}
              </h1>

              {step === 'phone' ? (
                <>
                  <label className="sr-only" htmlFor="auth-phone">
                    {t('auth.enterMobile')}
                  </label>
                  <div
                    className={`flex overflow-hidden border transition-colors ${
                      phoneError ? 'border-red-500' : 'border-navy-900'
                    }`}
                  >
                    <div className="flex flex-shrink-0 items-center gap-2 border-r border-neutral-200 bg-cream-50 px-3 sm:px-4">
                      <span className="text-base leading-none" aria-hidden>
                        🇮🇳
                      </span>
                      <span className="font-body text-sm font-semibold text-navy-900">+91</span>
                    </div>
                    <input
                      id="auth-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={e => {
                        setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                        setPhoneError('');
                      }}
                      onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                      placeholder={t('auth.enterMobile')}
                      className="min-w-0 flex-1 bg-white px-4 py-3.5 font-body text-sm text-navy-900 placeholder:text-gray-400 focus:outline-none sm:text-base"
                      autoFocus
                    />
                  </div>

                  {phoneError && (
                    <div className="mt-3 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2.5">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                      <p className="font-body text-xs text-red-600">{phoneError}</p>
                    </div>
                  )}

                  <label className="mt-5 flex cursor-pointer items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={notifyOffers}
                      onChange={e => setNotifyOffers(e.target.checked)}
                      className="h-4 w-4 rounded-sm border-neutral-300 accent-navy-900"
                    />
                    <span className="font-body text-xs text-gray-600">{t('auth.notifyOffers')}</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-rosegold-500 font-body text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-rosegold-600 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        {t('auth.sendingOtp')}
                      </>
                    ) : (
                      t('auth.submit')
                    )}
                  </button>
                </>
              ) : (
                <>
                  <p className="mb-4 font-body text-sm text-gray-600">
                    {t('auth.otpSentTo', { phone })}
                  </p>

                  <label className="sr-only" htmlFor="auth-otp">
                    {t('auth.enterOtp')}
                  </label>
                  <input
                    id="auth-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      setOtpError('');
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                    placeholder={t('auth.enterOtp')}
                    className={`w-full border bg-white px-4 py-3.5 text-center font-body text-lg tracking-[0.35em] text-navy-900 placeholder:tracking-normal placeholder:text-gray-400 focus:outline-none ${
                      otpError ? 'border-red-500' : 'border-navy-900'
                    }`}
                    autoFocus
                  />

                  <p className="mt-2 text-center font-body text-[11px] text-gray-400">
                    {t('auth.demoOtpHint')}
                  </p>

                  {otpError && (
                    <div className="mt-3 flex items-start gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-2.5">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-red-500" />
                      <p className="font-body text-xs text-red-600">{otpError}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="mt-6 flex h-12 w-full items-center justify-center gap-2 bg-rosegold-500 font-body text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-rosegold-600 disabled:opacity-70"
                  >
                    {loading ? <Loader2 size={18} className="animate-spin" /> : t('auth.verify')}
                  </button>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('phone');
                        setOtp('');
                        setOtpError('');
                      }}
                      className="font-body text-xs font-semibold text-navy-700 hover:text-rosegold-600"
                    >
                      {t('auth.changeNumber')}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="font-body text-xs font-semibold text-navy-700 hover:text-rosegold-600 disabled:opacity-50"
                    >
                      {t('auth.resendOtp')}
                    </button>
                  </div>
                </>
              )}

              <p className="mt-6 font-body text-[11px] leading-relaxed text-gray-500">
                {t('auth.privacyPrefix')}{' '}
                <Link to="/privacy-policy" onClick={handleClose} className="font-medium text-navy-700 underline-offset-2 hover:underline">
                  {t('auth.privacyPolicy')}
                </Link>{' '}
                {t('auth.and')}{' '}
                <Link to="/terms" onClick={handleClose} className="font-medium text-navy-700 underline-offset-2 hover:underline">
                  {t('auth.terms')}
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
