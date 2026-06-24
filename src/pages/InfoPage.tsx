import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import { resolveInfoPageKey, type InfoPageKey } from '../lib/infoPages';

type InfoSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

type SizeTable = {
  headers: string[];
  rows: string[][];
};

function SizeGuideTable({ table }: { table: SizeTable }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-sm border border-rosegold-100">
      <table className="w-full min-w-[480px] border-collapse text-left font-body text-sm">
        <thead>
          <tr className="bg-cream-100">
            {table.headers.map(header => (
              <th
                key={header}
                className="border-b border-rosegold-100 px-4 py-3 text-xs font-bold uppercase tracking-wider text-navy-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-rosegold-50 last:border-b-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-gray-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="space-y-4">
      {items.map(item => (
        <div key={item.q} className="rounded-sm border border-rosegold-100 bg-white p-5">
          <h3 className="mb-2 font-heading text-lg font-semibold text-navy-700">{item.q}</h3>
          <p className="font-body text-sm leading-relaxed text-gray-600">{item.a}</p>
        </div>
      ))}
    </div>
  );
}

function ContactBlock() {
  const { t } = useTranslation();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim() && form.email.trim() && form.message.trim()) setSent(true);
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-2">
      <div className="space-y-4 rounded-sm border border-rosegold-100 bg-white p-6">
        <a
          href="tel:+919876543210"
          className="flex items-center gap-3 font-body text-sm text-gray-600 transition-colors hover:text-navy-700"
        >
          <Phone size={18} className="text-rosegold-500" />
          +91 98765 43210
        </a>
        <a
          href="mailto:care@sitaravastram.com"
          className="flex items-center gap-3 font-body text-sm text-gray-600 transition-colors hover:text-navy-700"
        >
          <Mail size={18} className="text-rosegold-500" />
          care@sitaravastram.com
        </a>
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 font-body text-sm text-gray-600 transition-colors hover:text-navy-700"
        >
          <MessageCircle size={18} className="text-rosegold-500" />
          {t('footer.whatsappUs')}
        </a>
        <p className="flex items-start gap-3 font-body text-sm text-gray-600">
          <MapPin size={18} className="mt-0.5 flex-shrink-0 text-rosegold-500" />
          123, Textile Hub, Jaipur, Rajasthan — 302001
        </p>
        <p className="font-body text-xs text-gray-500">{t('infoPages.contact.hours')}</p>
      </div>

      {sent ? (
        <div className="flex items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50 p-8 text-center">
          <p className="font-body text-sm text-emerald-700">{t('infoPages.contact.sent')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-sm border border-rosegold-100 bg-white p-6">
          <input
            type="text"
            required
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder={t('infoPages.contact.namePlaceholder')}
            className="w-full rounded-sm border border-rosegold-200 px-4 py-3 font-body text-sm focus:border-rosegold-500 focus:outline-none"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder={t('infoPages.contact.emailPlaceholder')}
            className="w-full rounded-sm border border-rosegold-200 px-4 py-3 font-body text-sm focus:border-rosegold-500 focus:outline-none"
          />
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            placeholder={t('infoPages.contact.messagePlaceholder')}
            className="w-full resize-none rounded-sm border border-rosegold-200 px-4 py-3 font-body text-sm focus:border-rosegold-500 focus:outline-none"
          />
          <button type="submit" className="btn-primary w-full sm:w-auto">
            {t('infoPages.contact.submit')}
          </button>
        </form>
      )}
    </div>
  );
}

function InfoContent({ pageKey }: { pageKey: InfoPageKey }) {
  const { t } = useTranslation();
  const base = `infoPages.${pageKey}`;
  const sections = t(`${base}.sections`, { returnObjects: true }) as InfoSection[];
  const intro = t(`${base}.intro`, { defaultValue: '' });

  if (pageKey === 'faqs') {
    const items = t(`${base}.items`, { returnObjects: true }) as { q: string; a: string }[];
    return (
      <>
        {intro && <p className="mb-6 font-body text-sm leading-relaxed text-gray-600 sm:text-base">{intro}</p>}
        <FaqList items={Array.isArray(items) ? items : []} />
      </>
    );
  }

  if (pageKey === 'contact') {
    return (
      <>
        {intro && <p className="font-body text-sm leading-relaxed text-gray-600 sm:text-base">{intro}</p>}
        <ContactBlock />
      </>
    );
  }

  const table = t(`${base}.table`, { returnObjects: true, defaultValue: null }) as SizeTable | null;
  const hasTable = table && Array.isArray(table.headers) && Array.isArray(table.rows);

  return (
    <div className="space-y-8">
      {intro && <p className="font-body text-sm leading-relaxed text-gray-600 sm:text-base">{intro}</p>}
      {Array.isArray(sections) &&
        sections.map(section => (
          <section key={section.heading}>
            <h2 className="mb-3 font-heading text-xl font-semibold text-navy-700">{section.heading}</h2>
            {section.paragraphs?.map((p, i) => (
              <p key={i} className="mb-3 font-body text-sm leading-relaxed text-gray-600 last:mb-0 sm:text-base">
                {p}
              </p>
            ))}
            {section.list && section.list.length > 0 && (
              <ul className="mt-2 list-disc space-y-1.5 pl-5 font-body text-sm text-gray-600 sm:text-base">
                {section.list.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      {pageKey === 'sizeGuide' && hasTable && <SizeGuideTable table={table} />}
    </div>
  );
}

export default function InfoPage() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const pageKey = resolveInfoPageKey(pathname);

  if (!pageKey) return <Navigate to="/" replace />;

  const title = t(`infoPages.${pageKey}.title`);
  const subtitle = t(`infoPages.${pageKey}.subtitle`, { defaultValue: '' });

  return (
    <div className="min-h-screen bg-cream-100">
      <div className="section-container py-8 sm:py-12">
        <nav className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-body text-gray-500">
          <Link to="/" className="inline-flex items-center gap-1 transition-colors hover:text-navy-700">
            <Home size={13} />
            {t('product.home')}
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-medium text-navy-700">{title}</span>
        </nav>

        <header className="mb-8 max-w-3xl border-b border-rosegold-100 pb-6">
          <h1 className="font-heading text-3xl font-semibold text-navy-700 sm:text-4xl">{title}</h1>
          {subtitle && (
            <p className="mt-3 font-body text-sm leading-relaxed text-gray-500 sm:text-base">{subtitle}</p>
          )}
        </header>

        <div className="max-w-3xl">
          <InfoContent pageKey={pageKey} />
        </div>
      </div>
    </div>
  );
}
