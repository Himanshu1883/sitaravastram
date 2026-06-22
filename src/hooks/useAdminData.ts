import { useState, useCallback } from 'react';
import { products as seedProducts, categories as seedCategories } from '../data/products';
import { defaultCoupons } from '../data/coupons';
import { loadAdminData, saveAdminData } from '../lib/storage';
import type { AdminOrder, ReturnRequest, Notification } from '../types';

const seedOrders: AdminOrder[] = [
  { id: 'SV001', date: '2025-12-15', status: 'delivered', customer: 'Priya Sharma', items: [], subtotal: 2499, discount: 0, shipping: 0, codFee: 0, total: 2499, paymentMethod: 'razorpay', address: { id: '1', name: 'Priya Sharma', phone: '9876543210', line1: 'Mumbai', city: 'Mumbai', state: 'MH', pincode: '400001', isDefault: true } },
  { id: 'SV002', date: '2025-12-14', status: 'shipped', customer: 'Ananya Krishnan', items: [], subtotal: 5499, discount: 0, shipping: 0, codFee: 0, total: 5499, paymentMethod: 'cod', address: { id: '1', name: 'Ananya', phone: '9876543211', line1: 'Bangalore', city: 'Bangalore', state: 'KA', pincode: '560001', isDefault: true } },
  { id: 'SV003', date: '2025-12-14', status: 'confirmed', customer: 'Meera Patel', items: [], subtotal: 6999, discount: 0, shipping: 0, codFee: 0, total: 6999, paymentMethod: 'razorpay', address: { id: '1', name: 'Meera', phone: '9876543212', line1: 'Mumbai', city: 'Mumbai', state: 'MH', pincode: '400002', isDefault: true } },
  { id: 'SV004', date: new Date().toISOString().split('T')[0], status: 'placed', customer: 'Sunita Reddy', items: [], subtotal: 14999, discount: 0, shipping: 0, codFee: 0, total: 14999, paymentMethod: 'cod', address: { id: '1', name: 'Sunita', phone: '9876543213', line1: 'Hyderabad', city: 'Hyderabad', state: 'TS', pincode: '500001', isDefault: true } },
];

const seedReturns: ReturnRequest[] = [
  { id: 'RET001', orderId: 'SV001', customer: 'Priya Sharma', product: 'Cream Polka Dot Suit', reason: 'Size issue', status: 'pending', date: '2025-12-16' },
];

export function useAdminData() {
  const [data, setData] = useState(() =>
    loadAdminData({
      products: [...seedProducts],
      categories: [...seedCategories],
      coupons: [...defaultCoupons],
      orders: seedOrders,
      returns: seedReturns,
      notifications: [] as Notification[],
    })
  );

  const update = useCallback((partial: Partial<typeof data>) => {
    setData(prev => {
      const next = { ...prev, ...partial };
      saveAdminData(next);
      return next;
    });
  }, []);

  return { data, update };
}

export type AdminData = ReturnType<typeof useAdminData>['data'];
