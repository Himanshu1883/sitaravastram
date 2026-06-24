import { Link, useLocation } from 'react-router-dom';
import { useContentTranslation } from '../../hooks/useContentTranslation';
import { useHomepage } from '../../hooks/useCatalog';
import CatalogImage from '../ui/CatalogImage';

export default function CategoryStrip() {
  const location = useLocation();
  const { category } = useContentTranslation();
  const { data } = useHomepage();
  const homepageCategories = data?.homepageCategories ?? [];

  return (
    <div className="relative z-20 h-[6.5rem] shrink-0 overflow-hidden border-t border-black/[0.04] bg-[#f3f3f3] sm:h-28 lg:h-[7.5rem]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[#f3f3f3] to-transparent lg:hidden" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[#f3f3f3] to-transparent lg:hidden" />
      <div className="flex h-full w-full items-center px-2 sm:px-3 lg:px-4">
        <div className="flex h-full w-full items-center gap-5 overflow-x-auto scroll-smooth py-2 snap-x snap-mandatory [scrollbar-width:none] sm:gap-8 lg:justify-center lg:gap-10 lg:overflow-x-visible lg:snap-none lg:py-2.5 [&::-webkit-scrollbar]:hidden">
          {homepageCategories.map(cat => {
            const href = `/collections/${cat.slug}`;
            const active = location.pathname === href;
            const name = category(cat.slug, cat.name);

            return (
              <Link
                key={cat.id}
                to={href}
                className="group flex w-[64px] flex-shrink-0 snap-center flex-col items-center gap-2 sm:w-[72px] lg:w-[80px]"
              >
                <div
                  className={`relative h-[56px] w-[56px] overflow-hidden rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)] ring-2 transition-all duration-300 sm:h-[64px] sm:w-[64px] lg:h-[72px] lg:w-[72px] ${
                    active
                      ? 'ring-rosegold-500 shadow-[0_3px_12px_rgba(201,149,106,0.3)]'
                      : 'ring-white group-hover:ring-rosegold-200 group-hover:shadow-[0_3px_12px_rgba(0,0,0,0.12)]'
                  }`}
                >
                  <CatalogImage
                    src={cat.image}
                    alt={name}
                    priority
                    variant="thumb"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <span
                  className={`type-overline max-w-full text-center text-[10px] leading-tight line-clamp-2 transition-colors sm:text-[11px] lg:text-xs ${
                    active ? 'text-rosegold-600' : 'text-navy-800 group-hover:text-rosegold-600'
                  }`}
                >
                  {name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
