import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category } from '../types';
import { API_BASE, type HomepageData } from '../lib/api';
import { preloadHomepageImages, preloadProductCatalog, preloadProductDetail } from '../lib/preloadImages';

export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE || '' }),
  tagTypes: ['Homepage', 'Products', 'Product', 'Categories'],
  keepUnusedDataFor: 3600,
  refetchOnMountOrArgChange: 120,
  endpoints: builder => ({
    getHomepage: builder.query<HomepageData, void>({
      query: () => '/api/homepage',
      providesTags: ['Homepage'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          preloadHomepageImages(data);
        } catch {
          /* ignore */
        }
      },
    }),
    getProducts: builder.query<Product[], Record<string, string> | void>({
      query: params => {
        const qs = params && Object.keys(params).length ? `?${new URLSearchParams(params)}` : '';
        return `/api/products${qs}`;
      },
      providesTags: ['Products'],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          preloadProductCatalog(data);
        } catch {
          /* ignore */
        }
      },
    }),
    getProduct: builder.query<Product, string>({
      query: slug => `/api/products/${slug}`,
      providesTags: (_result, _err, slug) => [{ type: 'Product', id: slug }],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          preloadProductDetail(data);
        } catch {
          /* ignore */
        }
      },
    }),
    getCategories: builder.query<Category[], boolean | void>({
      query: featured => `/api/categories${featured === true ? '?featured=true' : ''}`,
      providesTags: ['Categories'],
    }),
  }),
});

export const {
  useGetHomepageQuery,
  useGetProductsQuery,
  useGetProductQuery,
  useGetCategoriesQuery,
} = catalogApi;
