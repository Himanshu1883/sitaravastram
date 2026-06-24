import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  MapPin,
  Phone,
  Heart,
  Sparkles,
  Diamond,
  ArrowRight,
  Gift,
  Shield,
  CreditCard,
  RefreshCw,
  Truck,
  Award,
} from 'lucide-react';
import Logo from '../ui/Logo';
import PaymentIcons from '../ui/PaymentIcons';
import {
  FacebookBrandIcon,
  InstagramBrandIcon,
  PinterestBrandIcon,
  XBrandIcon,
} from '../ui/SocialIcons';
import { BRAND_LOGO_EMBLEM } from '../../lib/brand';

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [miniEmail, setMiniEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const shopLinks = [
    { labelKey: 'categories.new-arrivals', href: '/collections/new-arrivals', fallback: 'New Arrivals' },
    { labelKey: 'categories.best-sellers', href: '/collections/best-sellers', fallback: 'Best Sellers' },
    { labelKey: 'categories.cotton-suits', href: '/collections/cotton-suits', fallback: 'Cotton Suits' },
    { labelKey: 'categories.kurta-sets', href: '/collections/kurta-sets', fallback: 'Kurta Sets' },
    { labelKey: 'categories.silk', href: '/collections/silk', fallback: 'Silk Collection' },
    { labelKey: 'categories.wedding', href: '/collections/wedding', fallback: 'Wedding Collection' },
    { labelKey: 'nav.sale', href: '/sale', fallback: 'Sale' },
  ];

  const supportLinks = [
    { labelKey: 'footer.trackOrder', href: '/account/orders' },
    { labelKey: 'footer.sizeGuide', href: '/size-guide' },
    { labelKey: 'footer.shippingInfo', href: '/shipping' },
    { labelKey: 'footer.returnsExchange', href: '/returns' },
    { labelKey: 'footer.faqs', href: '/faqs' },
    { labelKey: 'footer.contactUs', href: '/contact' },
    { labelKey: 'footer.whatsappUs', href: 'https://wa.me/919876543210' },
  ];

  const policyLinks = [
    { labelKey: 'footer.privacyPolicy', href: '/privacy-policy' },
    { labelKey: 'footer.termsOfService', href: '/terms' },
    { labelKey: 'footer.shippingPolicy', href: '/shipping' },
    { labelKey: 'footer.refundPolicy', href: '/returns' },
    { labelKey: 'footer.cookiePolicy', href: '/cookies' },
  ];

  const trustBadges = [
    { key: 'footer.authentic', icon: Shield },
    { key: 'footer.securePayments', icon: CreditCard },
    { key: 'footer.easyReturns', icon: RefreshCw },
    { key: 'footer.codAvailable', icon: Truck },
    { key: 'footer.premiumQuality', icon: Award },
  ];

  const perks = ['perk1', 'perk2', 'perk3'] as const;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="bg-[#0a0f1f] text-white">
      {/* Newsletter banner */}
      <div className="section-container py-10 lg:py-12">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)_minmax(0,0.95fr)] lg:gap-10 lg:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full border border-rosegold-400/30 bg-rosegold-500/15">
                <Sparkles size={24} className="text-rosegold-400" />
              </div>
              <div>
                <p className="mb-2 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-rosegold-400">
                  {t('home.joinFamily')}
                </p>
                <h2 className="font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  {t('home.newsletterTitle1')}{' '}
                  <span className="text-rosegold-300">{t('home.newsletterTitle2')}</span>
                </h2>
              </div>
            </div>

            <div>
              <p className="mb-5 font-body text-sm leading-relaxed text-white/65">
                {t('home.newsletterSubtitle')}
              </p>
              <ul className="space-y-2.5">
                {perks.map(key => (
                  <li key={key} className="flex items-center gap-2.5 font-body text-sm text-white/80">
                    <Diamond size={12} className="flex-shrink-0 text-rosegold-400" fill="currentColor" />
                    {t(`home.${key}`)}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              {subscribed ? (
                <div className="rounded-xl border border-rosegold-400/30 bg-rosegold-500/10 px-5 py-6 text-center">
                  <p className="font-heading text-lg font-semibold text-white">{t('home.subscribedTitle')}</p>
                  <p className="mt-2 font-body text-sm text-white/70">
                    {t('home.subscribedBody')} {email}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <div className="relative">
                    <Mail
                      size={16}
                      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/35"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t('home.emailPlaceholder')}
                      className="w-full rounded-lg border border-white/15 bg-white/5 py-3.5 pl-11 pr-4 font-body text-sm text-white placeholder:text-white/35 focus:border-rosegold-400 focus:outline-none focus:ring-1 focus:ring-rosegold-400/40"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-rosegold-500 px-5 py-3.5 font-body text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-rosegold-400"
                  >
                    {t('home.subscribe')}
                    <ArrowRight size={16} />
                  </button>
                  <p className="text-center font-body text-[11px] leading-relaxed text-white/40">
                    {t('home.newsletterDisclaimer')}
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main links */}
      <div className="section-container pb-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3">
            <Logo
              to="/"
              src={BRAND_LOGO_EMBLEM}
              size="3xl"
              variant="emblem"
              className="mb-6"
              imageClassName="scale-100 object-contain"
            />
            <p className="mb-6 max-w-xs font-body text-sm leading-relaxed text-white/65">
              {t('footer.tagline')}
            </p>
            <div className="mb-6 flex items-center gap-4">
              {[
                { icon: InstagramBrandIcon, href: 'https://instagram.com/sitaravastram', label: 'Instagram' },
                { icon: FacebookBrandIcon, href: 'https://facebook.com/sitaravastram', label: 'Facebook' },
                { icon: PinterestBrandIcon, href: 'https://pinterest.com/sitaravastram', label: 'Pinterest' },
                { icon: XBrandIcon, href: 'https://x.com/sitaravastram', label: 'X' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex items-center justify-center transition-transform duration-300 hover:scale-110 hover:opacity-90"
                >
                  <Icon size={24} />
                </a>
              ))}
            </div>
            <div className="space-y-2.5">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2.5 font-body text-sm text-white/65 transition-colors hover:text-rosegold-300"
              >
                <Phone size={14} className="flex-shrink-0 text-rosegold-400" />
                +91 98765 43210
              </a>
              <a
                href="mailto:care@sitaravastram.com"
                className="flex items-center gap-2.5 font-body text-sm text-white/65 transition-colors hover:text-rosegold-300"
              >
                <Mail size={14} className="flex-shrink-0 text-rosegold-400" />
                care@sitaravastram.com
              </a>
              <p className="flex items-start gap-2.5 font-body text-sm text-white/65">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-rosegold-400" />
                123, Textile Hub, Jaipur, Rajasthan — 302001
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-rosegold-400">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-2.5">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-white/65 transition-colors hover:text-rosegold-300"
                  >
                    {t(link.labelKey, { defaultValue: link.fallback })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-rosegold-400">
              {t('footer.support')}
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map(link => (
                <li key={link.labelKey}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-white/65 transition-colors hover:text-rosegold-300"
                    >
                      {t(link.labelKey)}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="font-body text-sm text-white/65 transition-colors hover:text-rosegold-300"
                    >
                      {t(link.labelKey)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-5 font-heading text-sm font-semibold uppercase tracking-[0.12em] text-rosegold-400">
              {t('footer.policies')}
            </h4>
            <ul className="space-y-2.5">
              {policyLinks.map(link => (
                <li key={link.labelKey}>
                  <Link
                    to={link.href}
                    className="font-body text-sm text-white/65 transition-colors hover:text-rosegold-300"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-rosegold-500/15">
                <Gift size={20} className="text-rosegold-400" />
              </div>
              <p className="font-heading text-lg font-semibold text-white">{t('footer.get10Off')}</p>
              <p className="mb-4 font-body text-xs text-white/55">{t('footer.subscribeOffers')}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={miniEmail}
                  onChange={e => setMiniEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 font-body text-xs text-white placeholder:text-white/35 focus:border-rosegold-400 focus:outline-none"
                />
                <button
                  type="button"
                  aria-label={t('footer.join')}
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-rosegold-500 text-white transition-colors hover:bg-rosegold-400"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-y border-white/10 bg-white/[0.02]">
        <div className="section-container py-5">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-white/10">
            {trustBadges.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center justify-center gap-2.5 px-2 text-center lg:px-4"
              >
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-rosegold-400/25 bg-rosegold-500/10">
                  <Icon size={16} className="text-rosegold-400" strokeWidth={1.75} />
                </span>
                <span className="font-body text-xs font-medium text-white/75 sm:text-sm">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#060a14]">
        <div className="section-container flex flex-col items-center justify-between gap-4 py-5 sm:flex-row">
          <p className="font-body text-xs text-white/45">{t('footer.copyright')}</p>
          <p className="flex items-center gap-1.5 font-body text-xs text-white/45">
            {t('footer.madeInIndiaPrefix')}
            <Heart size={11} className="fill-rosegold-400 text-rosegold-400" />
            {t('footer.madeInIndiaSuffix')}
          </p>
          <PaymentIcons iconWidth={48} />
        </div>
      </div>
    </footer>
  );
}
