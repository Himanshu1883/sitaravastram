import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SectionHeading from '../ui/SectionHeading';
import { useContentTranslation } from '../../hooks/useContentTranslation';
import { useHomepage } from '../../hooks/useCatalog';
import { mediaUrl } from '../../lib/api';
import { textKey } from '../../lib/translateContent';

export default function ShopByFabric() {
  const { t } = useTranslation();
  const { fabric } = useContentTranslation();
  const { data } = useHomepage();
  const fabrics = data?.fabrics ?? [];
  const copy = data?.sectionCopy?.fabric;

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <SectionHeading
          overline={copy?.overline || t('home.materialStories')}
          title={copy?.title || t('home.shopByFabric')}
          subtitle={copy?.subtitle || t('home.shopByFabricSubtitle')}
          center
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
          {fabrics.map(item => (
            <Link
              key={item.name}
              to={`/collections?fabric=${item.name.toLowerCase()}`}
              className="group flex flex-col items-center gap-3 text-center cursor-pointer"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-500 group-hover:scale-105">
                <img
                  src={mediaUrl(item.image)}
                  alt={fabric(item.name)}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-navy-700/20 group-hover:bg-navy-700/40 transition-all duration-300 rounded-full" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-rosegold-400 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-body font-semibold bg-rosegold-500/80 px-2 py-1 rounded-sm">
                    {t('common.shop')}
                  </span>
                </div>
              </div>
              <div>
                <p className="font-body text-sm font-semibold text-navy-700 group-hover:text-rosegold-500 transition-colors">
                  {fabric(item.name)}
                </p>
                <p className="font-body text-xs text-gray-500 mt-0.5">
                  {t(`fabricDesc.${textKey(item.name)}`, { defaultValue: item.description })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
