import mongoose, { Schema, type Document } from 'mongoose';

export type CustomFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'boolean'
  | 'list'
  | 'url'
  | 'image'
  | 'video';

export interface IProductCustomField {
  id: string;
  label: string;
  key: string;
  type: CustomFieldType;
  value: unknown;
  showOnStorefront: boolean;
  order: number;
}

export interface IProduct extends Document {
  legacyId: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  video?: string;
  category: string;
  fabric: string;
  occasion: string[];
  colors: string[];
  sizes: string[];
  showColorSelector?: boolean;
  showSizeSelector?: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  details: string[];
  includes: string[];
  washCare: string;
  deliveryTime: string;
  returnPolicy: string;
  sku: string;
  stock?: number;
  newArrival?: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  tags: string[];
  customFields?: IProductCustomField[];
}

const customFieldSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    key: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'textarea', 'number', 'boolean', 'list', 'url', 'image', 'video'],
      required: true,
    },
    value: Schema.Types.Mixed,
    showOnStorefront: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    legacyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    discount: Number,
    images: [String],
    video: String,
    category: { type: String, required: true },
    fabric: { type: String, required: true },
    occasion: [String],
    colors: [String],
    sizes: [String],
    showColorSelector: { type: Boolean, default: false },
    showSizeSelector: { type: Boolean, default: false },
    rating: { type: Number, default: 4.5 },
    reviewCount: { type: Number, default: 0 },
    description: { type: String, default: '' },
    details: [String],
    includes: [String],
    washCare: String,
    deliveryTime: String,
    returnPolicy: String,
    sku: { type: String, required: true },
    stock: { type: Number, default: 0 },
    newArrival: Boolean,
    isBestSeller: Boolean,
    inStock: { type: Boolean, default: true },
    tags: [String],
    customFields: [customFieldSchema],
  },
  { timestamps: true },
);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, fabric: 1, price: 1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);

export function toProductDto(doc: IProduct) {
  return {
    id: doc.legacyId,
    name: doc.name,
    slug: doc.slug,
    price: doc.price,
    originalPrice: doc.originalPrice,
    discount: doc.discount,
    images: doc.images,
    video: doc.video,
    category: doc.category,
    fabric: doc.fabric,
    occasion: doc.occasion,
    colors: doc.colors,
    sizes: doc.sizes,
    showColorSelector: doc.showColorSelector ?? false,
    showSizeSelector: doc.showSizeSelector ?? false,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    description: doc.description,
    details: doc.details,
    includes: doc.includes,
    washCare: doc.washCare,
    deliveryTime: doc.deliveryTime,
    returnPolicy: doc.returnPolicy,
    sku: doc.sku,
    stock: doc.stock,
    isNew: doc.newArrival,
    isBestSeller: doc.isBestSeller,
    inStock: doc.inStock,
    tags: doc.tags,
    customFields: (doc.customFields ?? [])
      .slice()
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(f => ({
        id: f.id,
        label: f.label,
        key: f.key,
        type: f.type,
        value: f.value,
        showOnStorefront: f.showOnStorefront ?? true,
        order: f.order ?? 0,
      })),
  };
}
