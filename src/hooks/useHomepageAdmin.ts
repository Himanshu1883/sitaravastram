import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  adminFetchHomepage,
  adminSaveHeroSlides,
  adminSaveHomepageBlock,
  adminUpdateHomepageCategory,
  adminSaveHomepageReviews,
  type AdminHomepageData,
} from '../lib/api';
import { catalogApi } from '../store/catalogApi';
import type { Category, HeroSlide, Review } from '../types';
import type { FeaturedCollectionItem, SectionCopy, InstagramMeta } from '../lib/api';

export function useHomepageAdmin() {
  const dispatch = useDispatch();
  const [data, setData] = useState<AdminHomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const invalidateStorefront = useCallback(() => {
    dispatch(catalogApi.util.invalidateTags(['Homepage']));
  }, [dispatch]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminFetchHomepage();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load homepage data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const saveHero = async (slides: HeroSlide[]) => {
    setSaving(true);
    try {
      const { heroSlides } = await adminSaveHeroSlides(slides);
      setData(prev => (prev ? { ...prev, heroSlides } : prev));
      invalidateStorefront();
      return heroSlides;
    } finally {
      setSaving(false);
    }
  };

  const saveBlock = async (key: string, blockData: unknown) => {
    setSaving(true);
    try {
      await adminSaveHomepageBlock(key, blockData);
      setData(prev => {
        if (!prev) return prev;
        if (key === 'sectionCopy') return { ...prev, sectionCopy: blockData as SectionCopy };
        if (key === 'instagramMeta') return { ...prev, instagramMeta: blockData as InstagramMeta };
        if (key === 'fabrics') return { ...prev, fabrics: blockData as AdminHomepageData['fabrics'] };
        if (key === 'occasions') return { ...prev, occasions: blockData as AdminHomepageData['occasions'] };
        if (key === 'featuredCollections') {
          return { ...prev, featuredCollections: blockData as FeaturedCollectionItem[] };
        }
        if (key === 'instagramPosts') {
          return { ...prev, instagramPosts: blockData as AdminHomepageData['instagramPosts'] };
        }
        return prev;
      });
      invalidateStorefront();
    } finally {
      setSaving(false);
    }
  };

  const saveCategory = async (
    id: string,
    updates: { name?: string; image?: string; featured?: boolean },
  ) => {
    setSaving(true);
    try {
      const { category } = await adminUpdateHomepageCategory(id, updates);
      setData(prev =>
        prev
          ? {
              ...prev,
              categories: prev.categories.map(c => (c.id === id ? category : c)),
            }
          : prev,
      );
      invalidateStorefront();
      return category as Category;
    } finally {
      setSaving(false);
    }
  };

  const saveReviews = async (reviews: Review[]) => {
    setSaving(true);
    try {
      const { reviews: saved } = await adminSaveHomepageReviews(reviews);
      setData(prev => (prev ? { ...prev, reviews: saved } : prev));
      invalidateStorefront();
      return saved;
    } finally {
      setSaving(false);
    }
  };

  return {
    data,
    loading,
    error,
    saving,
    reload,
    saveHero,
    saveBlock,
    saveCategory,
    saveReviews,
  };
}
