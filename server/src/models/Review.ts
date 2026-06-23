import mongoose, { Schema, type Document } from 'mongoose';

export interface IReview extends Document {
  legacyId: string;
  productId?: string;
  author: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
  verified: boolean;
}

const reviewSchema = new Schema<IReview>(
  {
    legacyId: { type: String, required: true, unique: true },
    productId: String,
    author: { type: String, required: true },
    location: String,
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: String,
    avatar: String,
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Review = mongoose.model<IReview>('Review', reviewSchema);

export function toReviewDto(doc: IReview) {
  return {
    id: doc.legacyId,
    productId: doc.productId,
    author: doc.author,
    location: doc.location,
    rating: doc.rating,
    comment: doc.comment,
    date: doc.date,
    avatar: doc.avatar,
    verified: doc.verified,
  };
}
