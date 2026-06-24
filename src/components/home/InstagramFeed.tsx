import { Instagram, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useHomepage } from '../../hooks/useCatalog';
import { mediaUrl } from '../../lib/api';

export default function InstagramFeed() {
  const { t } = useTranslation();
  const { data } = useHomepage();
  const instagramPosts = data?.instagramPosts ?? [];
  const meta = data?.instagramMeta;
  const copy = data?.sectionCopy?.instagram;
  const profileUrl = meta?.profileUrl ?? 'https://www.instagram.com/sitaravastram/';
  const handle = meta?.handle ?? copy?.handle ?? '@sitaravastram';
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="font-body text-xs tracking-[0.25em] uppercase font-semibold text-rosegold-500 mb-3">{copy?.overline || t('home.instagramOverline')}</p>
          <h2 className="font-heading text-3xl lg:text-4xl font-semibold text-navy-700 mb-2">{handle}</h2>
          <p className="font-body text-sm text-gray-500 max-w-sm mx-auto">
            {copy?.tagline || t('home.instagramTagline').replace(/<[^>]+>/g, '')}
          </p>
        </div>

        <div className="grid grid-cols-4 lg:grid-cols-8 gap-1 sm:gap-2">
          {instagramPosts.map((post, i) => (
            <a key={i} href={post.url} target="_blank" rel="noopener noreferrer" className={`group relative overflow-hidden ${i < 2 ? 'col-span-2 row-span-2' : ''}`}>
              <div className="aspect-square">
                <img src={mediaUrl(post.image)} alt="Sitara Vastram Instagram" className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-navy-700/0 group-hover:bg-navy-700/50 transition-all duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart size={18} className="text-white fill-white" />
                    <Instagram size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-body font-semibold text-navy-700 border border-navy-700 px-6 py-3 rounded-sm hover:bg-navy-700 hover:text-white transition-all duration-300">
            <Instagram size={16} />{copy?.cta || t('home.followInstagram')}
          </a>
        </div>
      </div>
    </section>
  );
}
