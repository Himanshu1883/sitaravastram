import { Link } from 'react-router-dom';
import type { MegaMenuColumn, MegaMenuPromo, NavItem } from '../../data/nav';
import CatalogImage from '../ui/CatalogImage';

function MegaColumnLinks({
  column,
  onNavigate,
}: {
  column: MegaMenuColumn;
  onNavigate?: () => void;
}) {
  return (
    <div className="min-w-0">
      <h3 className="type-overline text-navy-900 mb-4">
        {column.heading}
      </h3>
      <ul className="space-y-2.5">
        {column.links.map(link => (
          <li key={link.href + link.label}>
            <Link
              to={link.href}
              onClick={onNavigate}
              className="type-body-sm text-navy-700/90 hover:text-rosegold-600 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MegaPromoCard({
  promo,
  onNavigate,
}: {
  promo: MegaMenuPromo;
  onNavigate?: () => void;
}) {
  return (
    <Link to={promo.href} onClick={onNavigate} className="group block text-center min-w-0">
      <div className="mega-arch overflow-hidden mb-4 bg-cream-200 aspect-[3/4] sm:aspect-[4/5]">
        {promo.image && (
          <CatalogImage
            src={promo.image}
            alt={promo.title}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
          />
        )}
      </div>
      <h3 className="type-overline text-navy-900 mb-2">
        {promo.title}
      </h3>
      {promo.description && (
        <p className="type-body-xs text-gray-500 mb-3 px-1">{promo.description}</p>
      )}
      {promo.cta && (
        <span className="inline-block px-5 py-2 type-overline border border-navy-700/30 rounded-full text-navy-700 group-hover:border-rosegold-500 group-hover:text-rosegold-600 transition-colors">
          {promo.cta}
        </span>
      )}
    </Link>
  );
}

function ColumnsMegaMenu({
  columns,
  onNavigate,
}: {
  columns: MegaMenuColumn[];
  onNavigate?: () => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
      {columns.map(column => (
        <div key={column.heading} className="min-w-0">
          {column.image && (
            <Link to={column.links[0]?.href ?? '/collections'} onClick={onNavigate} className="block mb-4 group">
              <div className="aspect-[4/3] overflow-hidden bg-cream-200 rounded-sm">
                <CatalogImage
                  src={column.image}
                  alt={column.heading}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </Link>
          )}
          <h3 className="type-overline text-navy-900 mb-3">
            {column.heading}
          </h3>
          <ul className="space-y-2">
            {column.links.map(link => (
              <li key={link.href + link.label}>
                <Link
                  to={link.href}
                  onClick={onNavigate}
                  className="type-body-sm text-navy-700/85 hover:text-rosegold-600 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EditorialMegaMenu({
  columns,
  promos,
  onNavigate,
}: {
  columns: MegaMenuColumn[];
  promos?: MegaMenuPromo[];
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 xl:gap-10">
        {columns.map(column => (
          <MegaColumnLinks key={column.heading} column={column} onNavigate={onNavigate} />
        ))}
      </div>
      {promos && promos.length > 0 && (
        <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:w-[min(42%,520px)] lg:flex-shrink-0">
          {promos.map(promo => (
            <MegaPromoCard key={promo.title} promo={promo} onNavigate={onNavigate} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MegaMenu({
  item,
  onNavigate,
}: {
  item: NavItem;
  onNavigate?: () => void;
}) {
  if (!item.columns.length) return null;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-b border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.08)] animate-fade-in z-50 max-h-[min(85vh,720px)] overflow-y-auto overscroll-contain">
      <div className="section-container py-8 sm:py-10 lg:py-12">
        {item.megaLayout === 'columns' ? (
          <ColumnsMegaMenu columns={item.columns} onNavigate={onNavigate} />
        ) : (
          <EditorialMegaMenu columns={item.columns} promos={item.promos} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}
