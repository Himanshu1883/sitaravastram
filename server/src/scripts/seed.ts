import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { connectDb, disconnectDb, getGridFSBucket } from '../config/db.js';
import { env } from '../config/env.js';
import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { Coupon } from '../models/Coupon.js';
import { HeroSlide } from '../models/Homepage.js';
import { HomepageBlock } from '../models/Homepage.js';
import { Review } from '../models/Review.js';
import { Order } from '../models/Order.js';
import { ReturnRequest } from '../models/Return.js';
import { Admin } from '../models/Admin.js';
import { hashPassword } from '../middleware/auth.js';
import { uploadUrls, clearUrlCache } from '../services/gridfs.js';
import mongoose from 'mongoose';

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(join(__dirname, '../seed/catalog.json'), 'utf-8'));

const seedOrders = [
  { id: 'SV001', date: '2025-12-15', status: 'delivered' as const, customer: 'Priya Sharma', items: [], subtotal: 2499, discount: 0, shipping: 0, codFee: 0, total: 2499, paymentMethod: 'razorpay' as const, address: { id: '1', name: 'Priya Sharma', phone: '9876543210', line1: 'Mumbai', city: 'Mumbai', state: 'MH', pincode: '400001', isDefault: true } },
  { id: 'SV002', date: '2025-12-14', status: 'shipped' as const, customer: 'Ananya Krishnan', items: [], subtotal: 5499, discount: 0, shipping: 0, codFee: 0, total: 5499, paymentMethod: 'cod' as const, address: { id: '1', name: 'Ananya', phone: '9876543211', line1: 'Bangalore', city: 'Bangalore', state: 'KA', pincode: '560001', isDefault: true } },
  { id: 'SV003', date: '2025-12-14', status: 'confirmed' as const, customer: 'Meera Patel', items: [], subtotal: 6999, discount: 0, shipping: 0, codFee: 0, total: 6999, paymentMethod: 'razorpay' as const, address: { id: '1', name: 'Meera', phone: '9876543212', line1: 'Mumbai', city: 'Mumbai', state: 'MH', pincode: '400002', isDefault: true } },
  { id: 'SV004', date: new Date().toISOString().split('T')[0], status: 'placed' as const, customer: 'Sunita Reddy', items: [], subtotal: 14999, discount: 0, shipping: 0, codFee: 0, total: 14999, paymentMethod: 'cod' as const, address: { id: '1', name: 'Sunita', phone: '9876543213', line1: 'Hyderabad', city: 'Hyderabad', state: 'TS', pincode: '500001', isDefault: true } },
];

const seedReturns = [
  { id: 'RET001', orderId: 'SV001', customer: 'Priya Sharma', product: 'Cream Polka Dot Suit', reason: 'Size issue', status: 'pending' as const, date: '2025-12-16' },
];

async function migrateUrl(url: string | undefined, prefix: string): Promise<string | undefined> {
  if (!url) return undefined;
  if (url.startsWith('/api/media/')) return url;
  const [migrated] = await uploadUrls([url], prefix);
  return migrated;
}

async function seed(force: boolean) {
  await connectDb();
  clearUrlCache();

  const { products, categories, homepageCategories, heroSlides, reviews, fabrics, occasions, instagramPosts, occasionSlugMap, allColors, defaultCoupons } = catalog;

  const existing = await Product.countDocuments();
  if (existing > 0 && !force) {
    console.log(`Database already seeded (${existing} products). Use --force to reset.`);
    await disconnectDb();
    return;
  }

  if (force) {
    console.log('Clearing existing data...');
    const bucket = getGridFSBucket();
    await bucket.drop().catch(() => undefined);
    await Promise.all([
      Product.deleteMany({}),
      Category.deleteMany({}),
      Coupon.deleteMany({}),
      HeroSlide.deleteMany({}),
      HomepageBlock.deleteMany({}),
      Review.deleteMany({}),
      Order.deleteMany({}),
      ReturnRequest.deleteMany({}),
      Admin.deleteMany({}),
    ]);
  }

  console.log('Uploading media to GridFS (this may take a few minutes)...');

  const homepageSlugs = new Set(homepageCategories.map((c: { slug: string }) => c.slug));

  for (const cat of categories) {
    const image = await migrateUrl(cat.image, `cat-${cat.slug}`);
    await Category.create({
      legacyId: cat.id,
      name: cat.name,
      slug: cat.slug,
      image: image || cat.image,
      count: cat.count,
      featured: homepageSlugs.has(cat.slug),
    });
  }

  for (const slide of heroSlides) {
    const image = await migrateUrl(slide.image, `hero-${slide.id}`);
    await HeroSlide.create({
      legacyId: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      description: slide.description,
      image: image || slide.image,
      cta1: slide.cta1,
      cta2: slide.cta2,
      ctaLink: slide.ctaLink,
      badge: slide.badge,
      sortOrder: slide.id,
    });
  }

  const migratedFabrics = await Promise.all(
    fabrics.map(async (f: { image: string; name: string }) => ({
      ...f,
      image: (await migrateUrl(f.image, `fabric-${f.name}`)) || f.image,
    })),
  );
  const migratedOccasions = await Promise.all(
    occasions.map(async (o: { image: string; slug: string }) => ({
      ...o,
      image: (await migrateUrl(o.image, `occasion-${o.slug}`)) || o.image,
    })),
  );
  const migratedInstagram = await Promise.all(
    instagramPosts.map(async (p: { image: string; url: string }, i: number) => ({
      ...p,
      image: (await migrateUrl(p.image, `ig-${i}`)) || p.image,
    })),
  );

  await HomepageBlock.create([
    { key: 'fabrics', data: migratedFabrics },
    { key: 'occasions', data: migratedOccasions },
    { key: 'instagramPosts', data: migratedInstagram },
    { key: 'occasionSlugMap', data: occasionSlugMap },
    { key: 'allColors', data: allColors },
  ]);

  for (const product of products) {
    const images = await uploadUrls(product.images, `product-${product.slug}`);
    const video = product.video ? await migrateUrl(product.video, `video-${product.slug}`) : undefined;
    await Product.create({
      legacyId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      images,
      video,
      category: product.category,
      fabric: product.fabric,
      occasion: product.occasion,
      colors: product.colors,
      sizes: product.sizes,
      rating: product.rating,
      reviewCount: product.reviewCount,
      description: product.description,
      details: product.details,
      includes: product.includes,
      washCare: product.washCare,
      deliveryTime: product.deliveryTime,
      returnPolicy: product.returnPolicy,
      sku: product.sku,
      stock: product.stock,
      newArrival: product.isNew,
      isBestSeller: product.isBestSeller,
      inStock: product.inStock,
      tags: product.tags,
    });
    console.log(`  ✓ ${product.name}`);
  }

  for (const coupon of defaultCoupons) {
    await Coupon.create({
      legacyId: coupon.id,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      expiry: coupon.expiry,
      usageLimit: coupon.usageLimit,
      usedCount: coupon.usedCount,
      active: coupon.active,
    });
  }

  for (const review of reviews) {
    const avatar = review.avatar ? await migrateUrl(review.avatar, `avatar-${review.id}`) : undefined;
    await Review.create({
      legacyId: review.id,
      productId: review.productId,
      author: review.author,
      location: review.location,
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      avatar,
      verified: review.verified,
    });
  }

  for (const order of seedOrders) {
    await Order.create({
      orderId: order.id,
      date: order.date,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      codFee: order.codFee,
      total: order.total,
      paymentMethod: order.paymentMethod,
      address: order.address,
      customer: order.customer,
      phone: order.address.phone,
    });
  }

  for (const ret of seedReturns) {
    await ReturnRequest.create({
      legacyId: ret.id,
      orderId: ret.orderId,
      customer: ret.customer,
      product: ret.product,
      reason: ret.reason,
      status: ret.status,
      date: ret.date,
    });
  }

  const passwordHash = await hashPassword(env.adminPassword);
  await Admin.create({
    email: env.adminEmail,
    passwordHash,
    name: 'Sitara Admin',
  });

  console.log('\nSeed complete!');
  console.log(`  Products: ${products.length}`);
  console.log(`  Categories: ${categories.length}`);
  console.log(`  Admin: ${env.adminEmail}`);
  await disconnectDb();
}

const force = process.argv.includes('--force');
seed(force).catch(err => {
  console.error('Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
