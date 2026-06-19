import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { occasions } from '../../data/products';

export default function ShopByOccasion() {
  return (
    <section className="py-20 bg-navy-700 relative overflow-hidden">
      {/* Background circles */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-10 right-10 w-96 h-96 border border-white rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white rounded-full" />
      </div>

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Every Moment, Every Woman"
          title="Dressed for Every Occasion"
          subtitle="From the quiet grace of a workday to the dazzling joy of a wedding — Sitara Vastram has a look that's yours."
          center
          light
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
          {occasions.map((occ, i) => (
            <Link
              key={occ.name}
              to={`/collections/${occ.slug}`}
              className={`group relative overflow-hidden rounded-sm cursor-pointer ${i < 2 ? 'col-span-1 sm:row-span-1' : ''}`}
            >
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={occ.image}
                  alt={`Indian woman in ${occ.name.toLowerCase()} ethnic wear`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />
                <div className="absolute inset-0 bg-rosegold-500/0 group-hover:bg-rosegold-500/15 transition-all duration-500" />

                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-playfair text-lg font-semibold text-white mb-0.5">
                    {occ.name}
                  </h3>
                  <p className="font-inter text-xs text-white/70">{occ.description}</p>
                  <div className="mt-2 overflow-hidden h-0 group-hover:h-6 transition-all duration-300">
                    <span className="flex items-center gap-1 text-xs font-inter font-semibold text-rosegold-300 tracking-wider uppercase">
                      Shop Now <ArrowRight size={11} />
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
