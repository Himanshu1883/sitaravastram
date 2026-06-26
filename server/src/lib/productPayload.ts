import { validateProductCustomFields } from './validateProductCustomFields.js';

export function buildProductWritePayload(body: Record<string, unknown>) {
  const customFields = validateProductCustomFields(body.customFields);

  return {
    name: body.name,
    slug: body.slug,
    price: body.price,
    originalPrice: body.originalPrice,
    discount: body.discount,
    images: body.images ?? [],
    video: body.video,
    category: body.category,
    fabric: body.fabric,
    occasion: body.occasion ?? [],
    colors: body.colors ?? [],
    sizes: body.sizes ?? [],
    showColorSelector: body.showColorSelector ?? false,
    showSizeSelector: body.showSizeSelector ?? false,
    rating: body.rating,
    reviewCount: body.reviewCount,
    description: body.description ?? '',
    details: body.details ?? [],
    includes: body.includes ?? [],
    washCare: body.washCare,
    deliveryTime: body.deliveryTime,
    returnPolicy: body.returnPolicy,
    sku: body.sku,
    stock: body.stock ?? 0,
    newArrival: body.isNew ?? body.newArrival,
    isBestSeller: body.isBestSeller,
    inStock: body.inStock ?? true,
    tags: body.tags ?? [],
    customFields,
  };
}
