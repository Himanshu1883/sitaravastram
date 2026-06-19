import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { categories } from '../../data/products';

export default function CategorySection() {
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <SectionHeading
            overline="Explore"
            title="Shop by Category"
            subtitle="From everyday cotton to wedding-day silk — everything a woman needs to feel like herself."
          />
          <Link to="/collections" className="group flex items-center gap-2 text-sm font-inter font-medium text-rosegold-500 hover:text-navy-700 transition-colors whitespace-nowrap mb-10 sm:mb-0">
            All Categories
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {categories.map((category, i) => (
            <Link
              key={category.id}
              to={`/collections/${category.slug}`}
              className={`group relative overflow-hidden rounded-sm shadow-card hover:shadow-card-hover transition-all duration-500 ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : ''}`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? 'aspect-square sm:aspect-auto sm:h-full min-h-[420px]' : 'aspect-[3/4]'}`}>
                <img
                  src={category.image}
                  alt={`${category.name} — Indian women's ethnic fashion`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/85 via-navy-900/20 to-transparent" />
                <div className="absolute inset-0 bg-rosegold-500/0 group-hover:bg-rosegold-500/10 transition-all duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                  <h3 className={`font-playfair font-semibold text-white leading-tight mb-1 transition-transform duration-300 group-hover:-translate-y-1 ${i === 0 ? 'text-2xl lg:text-3xl' : 'text-base lg:text-lg'}`}>
                    {category.name}
                  </h3>
                  {category.count && (
                    <p className="font-inter text-xs text-white/70">{category.count} styles</p>
                  )}
                  <div className="overflow-hidden h-0 group-hover:h-7 transition-all duration-300 mt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-inter font-semibold text-rosegold-300 tracking-wider uppercase">
                      Shop Now <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
