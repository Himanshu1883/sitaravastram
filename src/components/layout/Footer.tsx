import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Mail,
  MapPin,
  Phone,
  Heart,
  Sparkles,
  ArrowRight,
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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  };

  return (
    <footer className="bg-[#0a0f1f] pb-20 text-white sm:pb-0">
      {/* Newsletter — compact strip */}
      <div className="w-full border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-rosegold-400/30 bg-rosegold-500/15">
              <Sparkles size={18} className="text-rosegold-400" />
            </div>
            <div className="min-w-0">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-rosegold-400">
                {t('home.joinFamily')}
              </p>
              <p className="truncate font-heading text-lg font-semibold text-white sm:text-xl">
                {t('home.newsletterTitle1')}{' '}
                <span className="text-rosegold-300">{t('home.newsletterTitle2')}</span>
              </p>
            </div>
          </div>

          {subscribed ? (
            <p className="font-body text-sm text-white/75 lg:text-right">
              {t('home.subscribedTitle')} — {email}
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:max-w-md lg:flex-shrink-0"
            >
              <div className="relative min-w-0 flex-1">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('home.emailPlaceholder')}
                  className="w-full rounded-lg border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 font-body text-sm text-white placeholder:text-white/35 focus:border-rosegold-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-rosegold-500 px-5 py-2.5 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-rosegold-400"
              >
                {t('home.subscribe')}
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main links — dense grid */}
      <div className="w-full px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-6">
          <div className="col-span-2 lg:col-span-3">
            <Logo
              to="/"
              src={BRAND_LOGO_EMBLEM}
              size="2xl"
              variant="emblem"
              className="mb-3"
              imageClassName="object-contain"
            />
            <p className="mb-4 max-w-xs font-body text-xs leading-relaxed text-white/60 sm:text-sm">
              {t('footer.tagline')}
            </p>
            <div className="mb-4 flex items-center gap-3">
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
                  className="inline-flex transition-transform duration-300 hover:scale-110 hover:opacity-90"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
            <div className="space-y-1.5">
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 font-body text-xs text-white/60 transition-colors hover:text-rosegold-300 sm:text-sm"
              >
                <Phone size={13} className="flex-shrink-0 text-rosegold-400" />
                +91 98765 43210
              </a>
              <a
                href="mailto:care@sitaravastram.com"
                className="flex items-center gap-2 font-body text-xs text-white/60 transition-colors hover:text-rosegold-300 sm:text-sm"
              >
                <Mail size={13} className="flex-shrink-0 text-rosegold-400" />
                care@sitaravastram.com
              </a>
              <p className="flex items-start gap-2 font-body text-xs text-white/60 sm:text-sm">
                <MapPin size={13} className="mt-0.5 flex-shrink-0 text-rosegold-400" />
                123, Textile Hub, Jaipur, Rajasthan — 302001
              </p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-rosegold-400">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-1.5">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="font-body text-xs text-white/60 transition-colors hover:text-rosegold-300 sm:text-sm"
                  >
                    {t(link.labelKey, { defaultValue: link.fallback })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-rosegold-400">
              {t('footer.support')}
            </h4>
            <ul className="space-y-1.5">
              {supportLinks.map(link => (
                <li key={link.labelKey}>
                  {link.href.startsWith('http') ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-xs text-white/60 transition-colors hover:text-rosegold-300 sm:text-sm"
                    >
                      {t(link.labelKey)}
                    </a>
                  ) : (
                    <Link
                      to={link.href}
                      className="font-body text-xs text-white/60 transition-colors hover:text-rosegold-300 sm:text-sm"
                    >
                      {t(link.labelKey)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-[0.12em] text-rosegold-400">
              {t('footer.policies')}
            </h4>
            <ul className="space-y-1.5">
              {policyLinks.map(link => (
                <li key={link.labelKey}>
                  <Link
                    to={link.href}
                    className="font-body text-xs text-white/60 transition-colors hover:text-rosegold-300 sm:text-sm"
                  >
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 hidden lg:col-span-3 lg:block">
            <p className="mb-2 font-heading text-base font-semibold text-white">{t('footer.get10Off')}</p>
            <p className="font-body text-xs leading-relaxed text-white/55">{t('footer.subscribeOffers')}</p>
          </div>
        </div>
      </div>

      {/* Trust badges */}
      <div className="border-y border-white/10 bg-white/[0.02]">
        <div className="w-full px-4 py-3 sm:px-6 lg:px-10">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-white/10">
            {trustBadges.map(({ key, icon: Icon }) => (
              <div
                key={key}
                className="flex items-center justify-center gap-2 px-1 text-center lg:px-3"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-rosegold-400/25 bg-rosegold-500/10">
                  <Icon size={14} className="text-rosegold-400" strokeWidth={1.75} />
                </span>
                <span className="font-body text-[11px] font-medium text-white/75 sm:text-xs">{t(key)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#060a14]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6 lg:px-10">
          <p className="font-body text-[11px] text-white/45">{t('footer.copyright')}</p>
          <p className="flex items-center gap-1.5 font-body text-[11px] text-white/45">
            {t('footer.madeInIndiaPrefix')}
            <Heart size={10} className="fill-rosegold-400 text-rosegold-400" />
            {t('footer.madeInIndiaSuffix')}
          </p>
          <PaymentIcons iconWidth={44} />
        </div>
      </div>
    </footer>
  );
}
