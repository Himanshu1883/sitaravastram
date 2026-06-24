import mongoose, { Schema, type Document } from 'mongoose';

export interface IHeroSlide extends Document {
  legacyId: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta1: string;
  cta2: string;
  ctaLink: string;
  badge?: string;
  hotspots?: { productSlug: string; x: number; y: number }[];
  sortOrder: number;
}

const heroSlideSchema = new Schema<IHeroSlide>(
  {
    legacyId: { type: Number, required: true, unique: true },
    title: String,
    subtitle: String,
    description: String,
    image: String,
    cta1: String,
    cta2: String,
    ctaLink: String,
    badge: String,
    hotspots: [
      {
        productSlug: String,
        x: Number,
        y: Number,
      },
    ],
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const HeroSlide = mongoose.model<IHeroSlide>('HeroSlide', heroSlideSchema);

export interface IHomepageBlock extends Document {
  key: string;
  data: unknown;
}

const homepageBlockSchema = new Schema<IHomepageBlock>(
  {
    key: { type: String, required: true, unique: true },
    data: Schema.Types.Mixed,
  },
  { timestamps: true },
);

export const HomepageBlock = mongoose.model<IHomepageBlock>('HomepageBlock', homepageBlockSchema);
