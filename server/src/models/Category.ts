import mongoose, { Schema, type Document } from 'mongoose';

export interface ICategory extends Document {
  legacyId: string;
  name: string;
  slug: string;
  image: string;
  count?: number;
  featured?: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    legacyId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    count: Number,
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);

export function toCategoryDto(doc: ICategory) {
  return {
    id: doc.legacyId,
    name: doc.name,
    slug: doc.slug,
    image: doc.image,
    count: doc.count,
    featured: doc.featured,
  };
}
