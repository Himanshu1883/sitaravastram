import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { textKey } from '../lib/translateContent';

export function useContentTranslation() {
  const { t, i18n } = useTranslation();

  const label = useCallback(
    (value: string) => t(`labels.${textKey(value)}`, { defaultValue: value }),
    [t],
  );

  const category = useCallback(
    (slug: string, name: string) => t(`categories.${slug}`, { defaultValue: name }),
    [t],
  );

  const fabric = useCallback(
    (name: string) => t(`fabrics.${textKey(name)}`, { defaultValue: name }),
    [t],
  );

  const occasion = useCallback(
    (name: string) => t(`occasions.${textKey(name)}`, { defaultValue: name }),
    [t],
  );

  const hero = useCallback(
    (id: number, field: string, value: string) =>
      t(`hero.${id}.${field}`, { defaultValue: value }),
    [t],
  );

  const promo = useCallback(
    (field: string, value: string) => t(`labels.${textKey(value)}`, { defaultValue: value }),
    [t],
  );

  return { t, i18n, label, category, fabric, occasion, hero, promo };
}
