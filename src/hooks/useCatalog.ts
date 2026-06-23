import type { HomepageData } from '../lib/api';
import {
  useGetHomepageQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
} from '../store/catalogApi';

function rtkErrorMessage(error: unknown): string | null {
  if (!error) return null;
  if (typeof error === 'object' && error !== null && 'status' in error) {
    return `Request failed (${String((error as { status: unknown }).status)})`;
  }
  return 'Request failed';
}

export function useProducts(params?: Record<string, string>) {
  const { data, isLoading, isFetching, error } = useGetProductsQuery(params ?? undefined);
  return {
    products: data ?? [],
    loading: isLoading || isFetching,
    error: rtkErrorMessage(error),
  };
}

export function useProduct(slug: string | undefined) {
  const { data, isLoading, isFetching, error } = useGetProductQuery(slug ?? '', { skip: !slug });
  return {
    product: data ?? null,
    loading: isLoading || isFetching,
    error: rtkErrorMessage(error),
  };
}

export function useCategories(featured?: boolean) {
  const { data, isLoading, isFetching } = useGetCategoriesQuery(featured);
  return {
    categories: data ?? [],
    loading: isLoading || isFetching,
  };
}

export function useHomepage() {
  const { data, isLoading, error, refetch } = useGetHomepageQuery();
  return {
    data: (data ?? null) as HomepageData | null,
    loading: isLoading && !data,
    error: rtkErrorMessage(error),
    reload: refetch,
  };
}

export type { HomepageData };
