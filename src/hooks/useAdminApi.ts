import { useState, useEffect, useCallback } from 'react';
import type { Product, Category, Coupon, AdminOrder, ReturnRequest, Notification } from '../types';
import { store } from '../store';
import { catalogApi } from '../store/catalogApi';
import {
  adminFetchProducts,
  adminFetchCategories,
  adminFetchCoupons,
  adminFetchOrders,
  adminFetchReturns,
  adminFetchNotifications,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminUpdateInventory,
  adminCreateCategory,
  adminDeleteCategory,
  adminCreateCoupon,
  adminUpdateCoupon,
  adminUpdateOrderStatus,
  adminUpdateReturn,
  adminCreateNotification,
} from '../lib/api';

export interface AdminData {
  products: Product[];
  categories: Category[];
  coupons: Coupon[];
  orders: AdminOrder[];
  returns: ReturnRequest[];
  notifications: Notification[];
}

export function useAdminApi() {
  const [data, setData] = useState<AdminData>({
    products: [],
    categories: [],
    coupons: [],
    orders: [],
    returns: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [products, categories, coupons, orders, returns, notifications] = await Promise.all([
        adminFetchProducts(),
        adminFetchCategories(),
        adminFetchCoupons(),
        adminFetchOrders(),
        adminFetchReturns(),
        adminFetchNotifications(),
      ]);
      setData({ products, categories, coupons, orders, returns, notifications });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const update = useCallback(async (partial: Partial<AdminData>) => {
    setData(prev => ({ ...prev, ...partial }));
  }, []);

  const saveProduct = async (product: Product, isNew: boolean) => {
    const saved = isNew
      ? await adminCreateProduct(product)
      : await adminUpdateProduct(product.id, product);
    setData(prev => ({
      ...prev,
      products: isNew
        ? [...prev.products, saved]
        : prev.products.map(p => (p.id === saved.id ? saved : p)),
    }));
    store.dispatch(catalogApi.util.invalidateTags(['Homepage', 'Products', 'Product']));
    return saved;
  };

  const deleteProduct = async (id: string) => {
    await adminDeleteProduct(id);
    setData(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
  };

  const updateStock = async (id: string, stock: number, inStock: boolean) => {
    const saved = await adminUpdateInventory(id, { stock, inStock });
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => (p.id === id ? saved : p)),
    }));
  };

  const saveCategory = async (category: Category) => {
    const saved = await adminCreateCategory(category);
    setData(prev => ({ ...prev, categories: [...prev.categories, saved] }));
    return saved;
  };

  const deleteCategory = async (id: string) => {
    await adminDeleteCategory(id);
    setData(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
  };

  const saveCoupon = async (coupon: Coupon) => {
    const saved = await adminCreateCoupon(coupon);
    setData(prev => ({ ...prev, coupons: [...prev.coupons, saved] }));
    return saved;
  };

  const toggleCoupon = async (id: string, active: boolean) => {
    const saved = await adminUpdateCoupon(id, { active });
    setData(prev => ({
      ...prev,
      coupons: prev.coupons.map(c => (c.id === id ? saved : c)),
    }));
  };

  const updateOrderStatus = async (id: string, status: AdminOrder['status']) => {
    const saved = await adminUpdateOrderStatus(id, status);
    setData(prev => ({
      ...prev,
      orders: prev.orders.map(o => (o.id === id ? { ...o, ...saved } : o)),
    }));
  };

  const updateReturnStatus = async (id: string, status: ReturnRequest['status']) => {
    const saved = await adminUpdateReturn(id, status);
    setData(prev => ({
      ...prev,
      returns: prev.returns.map(r => (r.id === id ? saved : r)),
    }));
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'sentAt'>) => {
    const saved = await adminCreateNotification(notification);
    setData(prev => ({ ...prev, notifications: [saved, ...prev.notifications] }));
    return saved;
  };

  const importProducts = async (newProducts: Product[]) => {
    const saved = await Promise.all(newProducts.map(p => adminCreateProduct(p)));
    setData(prev => ({ ...prev, products: [...prev.products, ...saved] }));
  };

  return {
    data,
    loading,
    error,
    reload,
    update,
    saveProduct,
    deleteProduct,
    updateStock,
    saveCategory,
    deleteCategory,
    saveCoupon,
    toggleCoupon,
    updateOrderStatus,
    updateReturnStatus,
    createNotification,
    importProducts,
  };
}

export type AdminApi = ReturnType<typeof useAdminApi>;
