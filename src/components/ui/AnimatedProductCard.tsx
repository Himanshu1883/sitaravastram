import { motion, useReducedMotion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from '../../types';

type AnimatedProductCardProps = {
  product: Product;
  index?: number;
  hideColors?: boolean;
  compact?: boolean;
};

export default function AnimatedProductCard({
  product,
  index = 0,
  hideColors = false,
  compact = false,
}: AnimatedProductCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, x: 48 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
      className="h-full"
    >
      <ProductCard product={product} hideColors={hideColors} compact={compact} />
    </motion.div>
  );
}
