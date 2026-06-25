import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Phone, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NavItem } from '../../data/nav';
import CurrencySelector from '../ui/CurrencySelector';

function AccordionPanel({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      <div className="min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

function MobileNavAccordion({
  items,
  onClose,
  onAccount,
  onToggleLanguage,
  languageLabel,
  accountBadgeCount = 0,
}: {
  items: NavItem[];
  onClose: () => void;
  onAccount: () => void;
  onToggleLanguage: () => void;
  languageLabel: string;
  accountBadgeCount?: number;
}) {
  const { t } = useTranslation();
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [openColumn, setOpenColumn] = useState<string | null>(null);

  const toggleNav = (href: string) => {
    setOpenNav(prev => (prev === href ? null : href));
    setOpenColumn(null);
  };

  const toggleColumn = (key: string) => {
    setOpenColumn(prev => (prev === key ? null : key));
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto py-2 px-2 [scrollbar-width:thin]">
        {items.map(item => {
          const hasColumns = item.columns.length > 0;
          const isOpen = openNav === item.href;
          const isSale = item.href === '/sale';

          if (!hasColumns) {
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`mb-1 flex w-full items-center rounded-sm px-3 py-3 text-base font-body font-bold transition-colors hover:bg-cream-100 ${
                  isSale ? 'text-red-500' : 'text-navy-800'
                }`}
              >
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.href} className="mb-1 border-b border-rosegold-100/80 last:border-b-0">
              <button
                type="button"
                onClick={() => toggleNav(item.href)}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between gap-3 rounded-sm px-3 py-3 text-left text-base font-body font-bold transition-colors hover:bg-cream-100 ${
                  isSale ? 'text-red-500' : 'text-navy-800'
                }`}
              >
                <span>{item.label}</span>
                <ChevronDown
                  size={18}
                  strokeWidth={2.25}
                  className={`flex-shrink-0 text-navy-600 transition-transform duration-300 ease-out ${
                    isOpen ? 'rotate-180 text-rosegold-600' : ''
                  }`}
                />
              </button>

              <AccordionPanel open={isOpen}>
                <div className="pb-2 pl-1 pr-1">
                  {item.columns.map(column => {
                    const columnKey = `${item.href}::${column.heading}`;
                    const columnOpen = openColumn === columnKey;

                    return (
                      <div key={columnKey} className="mt-1">
                        <button
                          type="button"
                          onClick={() => toggleColumn(columnKey)}
                          aria-expanded={columnOpen}
                          className="flex w-full items-center justify-between gap-2 rounded-sm px-3 py-2.5 text-left transition-colors hover:bg-cream-50"
                        >
                          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-navy-700">
                            {column.heading}
                          </span>
                          <ChevronDown
                            size={15}
                            strokeWidth={2.25}
                            className={`flex-shrink-0 text-gray-500 transition-transform duration-300 ease-out ${
                              columnOpen ? 'rotate-180 text-rosegold-600' : ''
                            }`}
                          />
                        </button>

                        <AccordionPanel open={columnOpen}>
                          <div className="space-y-0.5 pb-2 pl-3 pr-2">
                            {column.links.map(link => (
                              <Link
                                key={link.href + link.label}
                                to={link.href}
                                onClick={onClose}
                                className="block rounded-sm py-2 pl-2 text-sm font-medium text-navy-700 transition-colors hover:bg-cream-100 hover:text-rosegold-600"
                              >
                                {link.label}
                              </Link>
                            ))}
                          </div>
                        </AccordionPanel>
                      </div>
                    );
                  })}
                </div>
              </AccordionPanel>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-rosegold-200/40 px-5 pb-6 pt-4">
        <div className="flex gap-2">
          <CurrencySelector variant="menu" className="min-w-0 flex-1" />
          <button
            type="button"
            onClick={onToggleLanguage}
            className="flex-1 rounded-sm border border-rosegold-200 py-2 text-xs font-body font-semibold text-navy-700"
          >
            {languageLabel}
          </button>
        </div>
        <button type="button" className="btn-primary relative block w-full text-center" onClick={onAccount}>
          {t('nav.myAccount')}
          {accountBadgeCount > 0 && (
            <span className="absolute -top-1.5 right-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-rosegold-600 ring-2 ring-rosegold-500">
              {accountBadgeCount > 9 ? '9+' : accountBadgeCount}
            </span>
          )}
        </button>
        <a
          href="tel:+919876543210"
          className="flex items-center justify-center gap-2 text-sm font-body font-medium text-navy-700 transition-colors hover:text-rosegold-500"
        >
          <Phone size={16} />
          +91 98765 43210
        </a>
      </div>
    </>
  );
}

export default function MobileMenu({
  open,
  items,
  onClose,
  onAccount,
  onToggleLanguage,
  languageLabel,
  accountBadgeCount = 0,
}: {
  open: boolean;
  items: NavItem[];
  onClose: () => void;
  onAccount: () => void;
  onToggleLanguage: () => void;
  languageLabel: string;
  accountBadgeCount?: number;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[99] lg:hidden" role="dialog" aria-modal="true" aria-label={t('nav.menu')}>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            className="absolute left-0 top-0 flex h-full w-[min(100vw-3rem,22rem)] flex-col bg-white shadow-luxury-xl"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-rosegold-200/40 px-5 py-4">
              <span className="font-heading text-lg font-bold text-navy-800">{t('nav.menu')}</span>
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm p-2 text-navy-700 transition-colors hover:bg-cream-100 hover:text-rosegold-500"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <MobileNavAccordion
              items={items}
              onClose={onClose}
              onAccount={() => {
                onClose();
                onAccount();
              }}
              onToggleLanguage={onToggleLanguage}
              languageLabel={languageLabel}
              accountBadgeCount={accountBadgeCount}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
