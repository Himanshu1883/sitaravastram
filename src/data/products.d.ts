import type { Product, Category, Review, HeroSlide, InstagramPost } from '../types';
export declare const heroSlides: HeroSlide[];
/** Homepage featured categories (spec example) */
export declare const homepageCategories: Category[];
/** All 13 required product categories */
export declare const categories: Category[];
export declare const occasionSlugMap: Record<string, string>;
export declare const products: Product[];
export declare const reviews: Review[];
export declare const fabrics: {
    name: string;
    icon: string;
    description: string;
    color: string;
    image: string;
}[];
export declare const occasions: {
    name: string;
    description: string;
    image: string;
    slug: string;
}[];
export declare const instagramPosts: InstagramPost[];
export declare const allColors: any[];
