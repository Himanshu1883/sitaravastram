import { useMemo } from 'react';
import { useContentTranslation } from './useContentTranslation';
import { navItems, type NavItem } from '../data/nav';
import { useGetCategoriesQuery } from '../store/catalogApi';

export function useTranslatedNav(): NavItem[] {
  const { data: categories = [] } = useGetCategoriesQuery();
  const { label, promo } = useContentTranslation();

  return useMemo(() => {
    const imageForSlug = (slug?: string) => {
      if (!slug) return undefined;
      return categories.find(c => c.slug === slug)?.image;
    };

    return navItems.map(item => ({
      ...item,
      label: label(item.label),
      columns: item.columns.map(column => ({
        ...column,
        heading: label(column.heading),
        image: column.imageSlug ? imageForSlug(column.imageSlug) : column.image,
        links: column.links.map(link => ({
          ...link,
          label: label(link.label),
        })),
      })),
      promos: item.promos?.map(p => ({
        ...p,
        title: promo('title', p.title),
        description: p.description ? promo('description', p.description) : undefined,
        cta: p.cta ? promo('cta', p.cta) : undefined,
        image: p.imageSlug ? imageForSlug(p.imageSlug) : p.image,
      })),
    }));
  }, [label, promo, categories]);
}
