import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Twitter, MapPin, Phone, Mail, Heart } from 'lucide-react';

const shopLinks = [
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Cotton Suits', href: '/collections/cotton-suits' },
  { label: 'Kurta Sets', href: '/collections/kurta-sets' },
  { label: 'Silk Collection', href: '/collections/silk' },
  { label: 'Wedding Collection', href: '/collections/wedding' },
  { label: 'Sale', href: '/sale' },
];

const supportLinks = [
  { label: 'Track My Order', href: '/account/orders' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Shipping Info', href: '/shipping' },
  { label: 'Returns & Exchange', href: '/returns' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'WhatsApp Us', href: 'https://wa.me/919876543210' },
];

const policyLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Refund Policy', href: '/returns' },
  { label: 'Cookie Policy', href: '/cookies' },
];

export default function Footer() {
  return (
    <footer className="bg-navy-700 text-white">
      {/* Main Footer */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <img
              src="/assets/images/sitaravastram_logo.webp"
              alt="Sitara Vastram"
              className="h-16 w-auto mb-5 brightness-0 invert"
            />
            <p className="font-inter text-sm text-white/70 leading-relaxed mb-6 max-w-xs">
              Rooted in the timeless traditions of Indian craft, Sitara Vastram brings premium ethnic fashion to every woman — from the daily grace of cotton to the splendour of bridal silk.
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
              <a href="tel:+919876543210" className="flex items-center gap-2.5 text-sm font-inter text-white/70 hover:text-rosegold-300 transition-colors">
                <Phone size={14} className="text-rosegold-400 flex-shrink-0" />
                +91 98765 43210
              </a>
              <a href="mailto:care@sitaravastram.com" className="flex items-center gap-2.5 text-sm font-inter text-white/70 hover:text-rosegold-300 transition-colors">
                <Mail size={14} className="text-rosegold-400 flex-shrink-0" />
                care@sitaravastram.com
              </a>
              <p className="flex items-start gap-2.5 text-sm font-inter text-white/70">
                <MapPin size={14} className="text-rosegold-400 flex-shrink-0 mt-0.5" />
                123, Textile Hub, Jaipur, Rajasthan — 302001
              </p>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-playfair text-base font-semibold text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-rosegold-500 after:mt-2">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm font-inter text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-playfair text-base font-semibold text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-rosegold-500 after:mt-2">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map(link => (
                <li key={link.label}>
                  {link.href.startsWith('http') ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm font-inter text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-sm font-inter text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Policies + Newsletter */}
          <div>
            <h4 className="font-playfair text-base font-semibold text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-rosegold-500 after:mt-2">Policies</h4>
            <ul className="space-y-2.5 mb-8">
              {policyLinks.map(link => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm font-inter text-white/70 hover:text-rosegold-300 transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="bg-white/5 rounded-sm p-4 border border-white/10">
              <p className="font-playfair text-sm font-semibold text-white mb-1">Get 10% Off</p>
              <p className="text-xs font-inter text-white/60 mb-3">Subscribe for exclusive offers</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 rounded-sm px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-rosegold-400"
                />
                <button className="px-3 py-2 bg-rosegold-500 text-white text-xs font-medium rounded-sm hover:bg-rosegold-600 transition-colors whitespace-nowrap">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-white/10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-10">
            {['100% Authentic', 'Secure Payments', 'Easy Returns', 'COD Available', 'Premium Quality'].map(badge => (
              <div key={badge} className="flex items-center gap-2 text-xs font-inter text-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-rosegold-400" />
                {badge}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 bg-navy-950">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-inter text-white/50">
            © 2025 Sitara Vastram. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs font-inter text-white/50">
            Made with <Heart size={11} className="text-rosegold-400 fill-rosegold-400" /> in India
          </p>
          <div className="flex items-center gap-3">
            {['Visa', 'Mastercard', 'UPI', 'RazorPay', 'COD'].map(method => (
              <span key={method} className="text-xs font-inter text-white/50 bg-white/10 px-2 py-0.5 rounded-sm">
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
