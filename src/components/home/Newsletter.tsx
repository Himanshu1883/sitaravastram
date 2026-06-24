import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHomepage } from '../../hooks/useCatalog';

export default function Newsletter() {
  const { t } = useTranslation();
  const { data } = useHomepage();
  const copy = data?.sectionCopy?.newsletter;
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  const perks = ['perk1', 'perk2', 'perk3', 'perk4'] as const;

  return (
    <section className="py-20 bg-navy-700 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-rosegold-500/5 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-rosegold-500/5 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-8 w-32 h-32 rounded-full border border-rosegold-400/10 pointer-events-none" />
      <div className="absolute top-1/4 right-8 w-20 h-20 rounded-full border border-rosegold-400/15 pointer-events-none" />

      <div className="relative section-container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-full bg-rosegold-500/20 border border-rosegold-400/30 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={24} className="text-rosegold-400" />
          </div>

          <p className="font-body text-xs tracking-[0.3em] uppercase font-semibold text-rosegold-400 mb-4">
            {copy?.overline || t('home.joinFamily')}
          </p>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-white leading-tight mb-2">
            {copy?.title1 || t('home.newsletterTitle1')}
          </h2>
          <h2 className="font-heading text-4xl lg:text-5xl font-semibold text-rosegold-300 leading-tight mb-5">
            {copy?.title2 || t('home.newsletterTitle2')}
          </h2>
          <p className="font-body text-base text-white/70 leading-relaxed mb-3 max-w-md mx-auto">
            {copy?.subtitle || t('home.newsletterSubtitle')}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {perks.map(key => (
              <span key={key} className="flex items-center gap-1.5 text-xs font-body text-white/60">
                <span className="w-1 h-1 rounded-full bg-rosegold-400" />
                {t(`home.${key}`)}
              </span>
            ))}
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('home.emailPlaceholder')}
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-sm px-5 py-4 font-body text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-rosegold-400 transition-all"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-rosegold-500 text-white font-body font-semibold text-sm tracking-wider uppercase px-6 py-4 rounded-sm hover:bg-rosegold-600 transition-all duration-300 whitespace-nowrap shadow-rose"
              >
                {t('home.subscribe')}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          ) : (
            <div className="bg-white/10 rounded-sm px-8 py-6 max-w-md mx-auto border border-rosegold-400/30">
              <p className="font-heading text-xl text-white mb-2">{t('home.subscribedTitle')}</p>
              <p className="font-body text-sm text-white/70">
                {t('home.subscribedBody')}{' '}
                <span className="text-rosegold-300 font-medium">{email}</span>
              </p>
            </div>
          )}

          <p className="font-body text-xs text-white/35 mt-5">
            {t('home.newsletterDisclaimer')}
          </p>
        </div>
      </div>
    </section>
  );
}
