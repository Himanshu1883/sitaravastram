import { useMemo } from 'react';
import { useContentTranslation } from './useContentTranslation';
import { navItems, type NavItem } from '../data/nav';

export function useTranslatedNav(): NavItem[] {
  const { label, promo } = useContentTranslation();

  return useMemo(
    () =>
      navItems.map(item => ({
        ...item,
        label: label(item.label),
        columns: item.columns.map(column => ({
          ...column,
          heading: label(column.heading),
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
        })),
      })),
    [label, promo],
  );
}
