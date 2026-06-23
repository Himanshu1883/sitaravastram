/** Trending search terms — keys map to `search.trending.*` in locales */
export const trendingSearchKeys = [
  'cottonSuits',
  'kurtaSets',
  'silk',
  'partyWear',
  'wedding',
  'dupattas',
  'printedSuits',
  'festive',
] as const;

export type TrendingSearchKey = (typeof trendingSearchKeys)[number];

/** English default terms used for actual product search */
export const trendingSearchTerms: Record<TrendingSearchKey, string> = {
  cottonSuits: 'Cotton Suits',
  kurtaSets: 'Kurta Sets',
  silk: 'Silk',
  partyWear: 'Party Wear',
  wedding: 'Wedding',
  dupattas: 'Dupattas',
  printedSuits: 'Printed Suits',
  festive: 'Festive',
};
