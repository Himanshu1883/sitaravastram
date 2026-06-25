import type { Address, Order } from '../../types';

export function addressesFromOrders(orders: Order[]): Address[] {
  const seen = new Set<string>();
  const result: Address[] = [];

  for (const order of orders) {
    const address = order.address;
    const key = `${address.line1}|${address.pincode}|${address.phone}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(address);
  }

  return result;
}
