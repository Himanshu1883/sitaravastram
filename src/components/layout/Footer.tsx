import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail, Heart } from 'lucide-react';
import Logo from '../ui/Logo';

export default function Footer() {
  const { t } = useTranslation();

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
    'footer.authentic',
    'footer.securePayments',
    'footer.easyReturns',
    'footer.codAvailable',
    'footer.premiumQuality',
  ];

  return (
    <footer className="bg-navy-700 text-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo to="/" size="xl" variant="emblem" className="mb-5" />
            <p className="font-body text-sm text-white/70 leading-relaxed mb-6 max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="flex items-center gap-3 mb-6">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Youtube, href: '#', label: 'YouTube' },
                { icon: Twitter, href: '#', label: 'Twitter' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-sm bg-white/10 hover:bg-rosegold-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              <a href="tel:+919876543210" className="flex items-center gap-2.5 text-sm font-body text-white/70 hover:text-rosegold-300 transition-colors">
                <Phone size={14} className="text-rosegold-400 flex-shrink-0" />
                +91 98765 43210
              </a>
              <a href="mailto:care@sitaravastram.com" className="flex items-center gap-2.5 text-sm font-body text-white/70 hover:text-rosegold-300 transition-colors">
                <Mail size={14} className="text-rosegold-400 flex-shrink-0" />
                care@sitaravastram.com
              </a>
              <p className="flex items-start gap-2.5 text-sm font-body text-white/70">
                <MapPin size={14} className="text-rosegold-400 flex-shrink-0 mt-0.5" />
                123, Textile Hub, Jaipur, Rajasthan — 302001
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-rosegold-500 after:mt-2">{t('footer.shop')}</h4>
            <ul className="space-y-2.5">
              {shopLinks.map(link => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm font-body text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                    {t(link.labelKey, { defaultValue: link.fallback })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-rosegold-500 after:mt-2">{t('footer.support')}</h4>
            <ul className="space-y-2.5">
              {supportLinks.map(link => (
                <li key={link.labelKey}>
                  {link.href.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-body text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                      {t(link.labelKey)}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-sm font-body text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                      {t(link.labelKey)}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-base font-semibold text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-rosegold-500 after:mt-2">{t('footer.policies')}</h4>
            <ul className="space-y-2.5 mb-8">
              {policyLinks.map(link => (
                <li key={link.labelKey}>
                  <Link to={link.href} className="text-sm font-body text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="bg-white/5 rounded-sm p-4 border border-white/10">
              <p className="font-heading text-sm font-semibold text-white mb-1">{t('footer.get10Off')}</p>
              <p className="text-xs font-body text-white/60 mb-3">{t('footer.subscribeOffers')}</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder={t('footer.emailPlaceholder')}
                  className="flex-1 bg-white/10 border border-white/20 rounded-sm px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-rosegold-400"
                />
                <button className="px-3 py-2 bg-rosegold-500 text-white text-xs font-medium rounded-sm hover:bg-rosegold-600 transition-colors whitespace-nowrap">
                  {t('footer.join')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {trustBadges.map(key => (
              <div key={key} className="flex items-center gap-2 text-xs font-body text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-rosegold-400" />
                {t(key)}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-navy-950">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-white/50">{t('footer.copyright')}</p>
          <p className="flex items-center gap-1.5 text-xs font-body text-white/50">
            {t('footer.madeInIndiaPrefix')}
            <Heart size={11} className="text-rosegold-400 fill-rosegold-400" />
            {t('footer.madeInIndiaSuffix')}
          </p>
          <div className="flex items-center gap-3">
            {['Visa', 'Mastercard', 'UPI', 'RazorPay', 'COD'].map(method => (
              <span key={method} className="text-xs font-body text-white/50 bg-white/10 px-2 py-0.5 rounded-sm">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
