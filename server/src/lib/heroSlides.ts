import { heroSlideHotspotsSeed, type FeaturedHotspotSeed } from '../seed/marketing.js';

export type ProductHotspotDto = FeaturedHotspotSeed;

export interface HeroSlideDto {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta1: string;
  cta2: string;
  ctaLink: string;
  badge?: string;
  hotspots?: ProductHotspotDto[];
}

type HeroSlideRecord = {
  legacyId: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta1: string;
  cta2: string;
  ctaLink: string;
  badge?: string;
  hotspots?: ProductHotspotDto[];
};

export function resolveHeroSlideHotspots(legacyId: number, hotspots?: ProductHotspotDto[]): ProductHotspotDto[] {
  if (hotspots?.length) return hotspots;
  return heroSlideHotspotsSeed[legacyId] ?? [];
}

export function toHeroSlideDto(slide: HeroSlideRecord): HeroSlideDto {
  return {
    id: slide.legacyId,
    title: slide.title,
    subtitle: slide.subtitle,
    description: slide.description,
    image: slide.image,
    cta1: slide.cta1,
    cta2: slide.cta2,
    ctaLink: slide.ctaLink,
    badge: slide.badge,
    hotspots: resolveHeroSlideHotspots(slide.legacyId, slide.hotspots),
  };
}
