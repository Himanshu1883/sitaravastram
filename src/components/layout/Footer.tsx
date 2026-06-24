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
  ChevronDown,
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

type FooterLink = {
  labelKey: string;
  href: string;
  fallback?: string;
  external?: boolean;
};

function FooterLinkGroup({
  title,
  links,
  defaultOpen = false,
}: {
  title: string;
  links: FooterLink[];
  defaultOpen?: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);

  const linkClass =
    'block py-2 font-body text-sm text-white/60 transition-colors hover:text-rosegold-300 md:py-1.5 md:text-xs lg:text-sm';

  return (
    <div className="border-b border-white/10 md:border-0">
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left md:pointer-events-none md:cursor-default md:py-0"
      >
        <h4 className="font-heading text-xs font-semibold uppercase tracking-[0.12em] text-rosegold-400">
          {title}
        </h4>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-white/40 transition-transform duration-200 md:hidden ${
            open ? 'rotate-180' : ''
          }`}
          aria-hidden
        />
      </button>

      <ul
        className={`space-y-0 overflow-hidden transition-[max-height] duration-300 ease-out md:!max-h-none md:space-y-1.5 ${
          open ? 'max-h-[520px] pb-4' : 'max-h-0 md:max-h-none'
        }`}
      >
        {links.map(link => (
          <li key={link.labelKey}>
            {link.external || link.href.startsWith('http') ? (
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {t(link.labelKey, { defaultValue: link.fallback })}
              </a>
            ) : (
              <Link to={link.href} className={linkClass}>
                {t(link.labelKey, { defaultValue: link.fallback })}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const shopLinks: FooterLink[] = [
    { labelKey: 'categories.new-arrivals', href: '/collections/new-arrivals', fallback: 'New Arrivals' },
    { labelKey: 'categories.best-sellers', href: '/collections/best-sellers', fallback: 'Best Sellers' },
    { labelKey: 'categories.cotton-suits', href: '/collections/cotton-suits', fallback: 'Cotton Suits' },
    { labelKey: 'categories.kurta-sets', href: '/collections/kurta-sets', fallback: 'Kurta Sets' },
    { labelKey: 'categories.silk', href: '/collections/silk', fallback: 'Silk Collection' },
    { labelKey: 'categories.wedding', href: '/collections/wedding', fallback: 'Wedding Collection' },
    { labelKey: 'nav.sale', href: '/sale', fallback: 'Sale' },
  ];

  const supportLinks: FooterLink[] = [
    { labelKey: 'footer.trackOrder', href: '/account/orders' },
    { labelKey: 'footer.sizeGuide', href: '/size-guide' },
    { labelKey: 'footer.shippingInfo', href: '/shipping' },
    { labelKey: 'footer.returnsExchange', href: '/returns' },
    { labelKey: 'footer.faqs', href: '/faqs' },
    { labelKey: 'footer.contactUs', href: '/contact' },
    { labelKey: 'footer.whatsappUs', href: 'https://wa.me/919876543210', external: true },
  ];

  const policyLinks: FooterLink[] = [
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
    <footer className="bg-[#0a0f1f] pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] text-white sm:pb-0">
      {/* Newsletter */}
      <div className="w-full border-b border-white/10 px-4 py-5 sm:px-6 lg:px-10 lg:py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex min-w-0 items-start gap-3 sm:items-center">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-rosegold-400/30 bg-rosegold-500/15 sm:h-10 sm:w-10">
              <Sparkles size={16} className="text-rosegold-400 sm:hidden" />
              <Sparkles size={18} className="hidden text-rosegold-400 sm:block" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-rosegold-400 sm:tracking-[0.2em]">
                {t('home.joinFamily')}
              </p>
              <p className="mt-0.5 font-heading text-base font-semibold leading-snug text-white sm:text-xl">
                {t('home.newsletterTitle1')}{' '}
                <span className="text-rosegold-300">{t('home.newsletterTitle2')}</span>
              </p>
            </div>
          </div>

          {subscribed ? (
            <p className="break-all font-body text-sm text-white/75 lg:max-w-md lg:text-right">
              {t('home.subscribedTitle')} — {email}
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex w-full flex-col gap-2.5 sm:flex-row sm:items-stretch lg:max-w-md lg:flex-shrink-0"
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
                  className="w-full rounded-lg border border-white/15 bg-white/5 py-3 pl-10 pr-3 font-body text-base text-white placeholder:text-white/35 focus:border-rosegold-400 focus:outline-none sm:py-2.5 sm:text-sm"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-[44px] flex-shrink-0 items-center justify-center gap-2 rounded-lg bg-rosegold-500 px-5 py-3 font-body text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-rosegold-400 sm:min-h-0 sm:py-2.5"
              >
                {t('home.subscribe')}
                <ArrowRight size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main links */}
      <div className="w-full px-4 py-5 sm:px-6 sm:py-6 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-8 lg:gap-y-6">
          {/* Brand */}
          <div className="mb-6 border-b border-white/10 pb-6 lg:col-span-3 lg:mb-0 lg:border-0 lg:pb-0">
            <Logo
              to="/"
              src={BRAND_LOGO_EMBLEM}
              size="2xl"
              variant="emblem"
              className="mb-3"
              imageClassName="h-14 w-auto object-contain sm:h-16"
            />
            <p className="mb-4 max-w-md font-body text-sm leading-relaxed text-white/60">
              {t('footer.tagline')}
            </p>

            <div className="mb-4 rounded-sm border border-white/10 bg-white/[0.03] p-3 md:hidden">
              <p className="font-heading text-sm font-semibold text-white">{t('footer.get10Off')}</p>
              <p className="mt-1 font-body text-xs leading-relaxed text-white/55">
                {t('footer.subscribeOffers')}
              </p>
            </div>

            <div className="mb-4 flex flex-wrap items-center gap-3">
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
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center transition-transform duration-300 hover:scale-110 hover:opacity-90 md:min-h-0 md:min-w-0"
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>

            <div className="space-y-2.5">
              <a
                href="tel:+919876543210"
                className="flex min-h-[44px] items-center gap-2.5 font-body text-sm text-white/60 transition-colors hover:text-rosegold-300 md:min-h-0 md:text-xs lg:text-sm"
              >
                <Phone size={14} className="flex-shrink-0 text-rosegold-400" />
                +91 98765 43210
              </a>
              <a
                href="mailto:care@sitaravastram.com"
                className="flex min-h-[44px] items-center gap-2.5 break-all font-body text-sm text-white/60 transition-colors hover:text-rosegold-300 md:min-h-0 md:text-xs lg:text-sm"
              >
                <Mail size={14} className="flex-shrink-0 text-rosegold-400" />
                care@sitaravastram.com
              </a>
              <p className="flex items-start gap-2.5 font-body text-sm leading-relaxed text-white/60 md:text-xs lg:text-sm">
                <MapPin size={14} className="mt-0.5 flex-shrink-0 text-rosegold-400" />
                123, Textile Hub, Jaipur, Rajasthan — 302001
              </p>
            </div>
          </div>

          {/* Link columns — accordion on mobile, grid on tablet+ */}
          <div className="md:grid md:grid-cols-3 md:gap-8 lg:contents">
            <div className="lg:col-span-2">
              <FooterLinkGroup title={t('footer.shop')} links={shopLinks} defaultOpen />
            </div>
            <div className="lg:col-span-2">
              <FooterLinkGroup title={t('footer.support')} links={supportLinks} />
            </div>
            <div className="lg:col-span-2">
              <FooterLinkGroup title={t('footer.policies')} links={policyLinks} />
            </div>

            <div className="hidden lg:col-span-3 lg:block">
              <p className="mb-2 font-heading text-base font-semibold text-white">{t('footer.get10Off')}</p>
              <p className="font-body text-xs leading-relaxed text-white/55">{t('footer.subscribeOffers')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust badges — horizontal scroll on mobile */}
      <div className="border-y border-white/10 bg-white/[0.02]">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-5 lg:divide-x lg:divide-white/10 [&::-webkit-scrollbar]:hidden">
              {trustBadges.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="flex min-w-[9.5rem] flex-shrink-0 snap-start items-center gap-2.5 rounded-sm border border-white/10 bg-white/[0.02] px-3 py-2.5 sm:min-w-0 sm:flex-shrink sm:justify-center sm:rounded-none sm:border-0 sm:bg-transparent sm:px-2 sm:py-0 lg:px-3"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-rosegold-400/25 bg-rosegold-500/10">
                    <Icon size={14} className="text-rosegold-400" strokeWidth={1.75} />
                  </span>
                  <span className="text-left font-body text-[11px] font-medium leading-tight text-white/75 sm:text-center sm:text-xs">
                    {t(key)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-[#060a14]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-5 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-3 sm:px-6 sm:py-4 lg:px-10">
          <p className="order-2 text-center font-body text-[11px] leading-relaxed text-white/45 sm:order-1 sm:text-left">
            {t('footer.copyright')}
          </p>
          <p className="order-1 flex items-center justify-center gap-1.5 text-center font-body text-[11px] text-white/45 sm:order-2">
            {t('footer.madeInIndiaPrefix')}
            <Heart size={10} className="fill-rosegold-400 text-rosegold-400" />
            {t('footer.madeInIndiaSuffix')}
          </p>
          <div className="order-3 w-full sm:order-3 sm:w-auto">
            <PaymentIcons iconWidth={40} className="mx-auto max-w-full sm:gap-2.5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
