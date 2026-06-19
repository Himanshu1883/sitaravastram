import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const features = [
  {
    id: 1,
    eyebrow: 'Heritage Craft',
    title: 'The Art of\nBanarasi Weaves',
    description: 'Hand-woven on ancient looms by master weavers in Varanasi, our silk collection preserves a 2000-year-old tradition. Each saree and suit set carries the soul of a craftswomen who poured her heart into every thread.',
    cta: 'Explore Silk',
    href: '/collections/silk',
    image: 'https://images.pexels.com/photos/4048043/pexels-photo-4048043.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Woman in vibrant pink Banarasi silk saree',
    reverse: false,
    tag: 'Silk Collection',
    stat: '50+ master weavers',
  },
  {
    id: 2,
    eyebrow: 'Bridal Story',
    title: 'Your Wedding\nChapter Begins',
    description: 'From mehendi to vidaai, from sangeet to the mandap — our bridal collection is an ode to Indian womanhood. Each piece is crafted with hand embroidery, intricate zardozi and a love that lasts beyond the celebration.',
    cta: 'Discover Bridal',
    href: '/collections/wedding',
    image: 'https://images.pexels.com/photos/14037486/pexels-photo-14037486.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Women in elegant traditional Indian wedding attire',
    reverse: true,
    tag: 'Wedding',
    stat: '100% customisable',
  },
  {
    id: 3,
    eyebrow: 'Everyday Grace',
    title: 'Cotton That\nBreathes Freedom',
    description: 'Our organic cotton collection is dyed with natural pigments, hand-block printed by women artisans in Jaipur, and designed to last. Sustainable fashion that is kind to you, kind to the weaver, and kind to the planet.',
    cta: 'Shop Cotton',
    href: '/collections/cotton-suits',
    image: 'https://images.pexels.com/photos/33824984/pexels-photo-33824984.jpeg?auto=compress&cs=tinysrgb&w=900',
    imageAlt: 'Woman in yellow salwar kameez in lush greenery',
    reverse: false,
    tag: 'Eco-Friendly Cotton',
    stat: 'Artisan-made',
  },
];

export default function FeaturedCollection() {
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="font-inter text-xs tracking-[0.25em] uppercase font-semibold text-rosegold-500 mb-3">
            Stories of Craft
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-navy-700">
            Featured Collections
          </h2>
          <p className="font-inter text-base text-gray-500 mt-4 max-w-xl mx-auto leading-relaxed">
            Every collection at Sitara Vastram tells a story rooted in India's rich textile heritage — worn by women who carry grace in every step.
          </p>
          <div className="flex items-center gap-3 mt-5 justify-center">
            <div className="h-px w-12 bg-rosegold-500" />
            <div className="w-2 h-2 rotate-45 bg-rosegold-500" />
            <div className="h-px w-12 bg-rosegold-500" />
          </div>
        </div>

        <div className="space-y-24">
          {features.map(feature => (
            <div
              key={feature.id}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${feature.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}
            >
              {/* Image */}
              <div className="relative group overflow-hidden rounded-sm shadow-luxury-lg">
                <div className="aspect-[4/5] lg:aspect-[5/6]">
                  <img
                    src={feature.image}
                    alt={feature.imageAlt}
                    className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/30 via-transparent to-transparent pointer-events-none" />
                {/* Tag */}
                <div className="absolute top-6 left-6">
                  <span className="inline-block bg-white/90 backdrop-blur-sm text-navy-700 text-xs font-inter font-semibold px-4 py-2 rounded-sm tracking-widest uppercase shadow-card">
                    {feature.tag}
                  </span>
                </div>
                {/* Stat badge */}
                <div className="absolute bottom-6 right-6">
                  <span className="inline-block bg-rosegold-500/90 backdrop-blur-sm text-white text-xs font-inter font-medium px-3 py-1.5 rounded-sm">
                    {feature.stat}
                  </span>
                </div>
                {/* Decorative corner */}
                <div className="absolute bottom-0 right-0 w-16 h-16 bg-rosegold-500/20" />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center lg:px-6">
                <p className="font-inter text-xs tracking-[0.3em] uppercase font-semibold text-rosegold-500 mb-4">
                  {feature.eyebrow}
                </p>
                <h3 className="font-playfair text-3xl lg:text-4xl font-semibold text-navy-700 leading-tight mb-6 whitespace-pre-line">
                  {feature.title}
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px w-8 bg-rosegold-500" />
                  <div className="w-1.5 h-1.5 rotate-45 bg-rosegold-500" />
                </div>
                <p className="font-inter text-base text-gray-600 leading-relaxed mb-8">
                  {feature.description}
                </p>
                <Link
                  to={feature.href}
                  className="group inline-flex items-center gap-3 self-start"
                >
                  <span className="font-inter text-sm font-semibold text-navy-700 tracking-widest uppercase group-hover:text-rosegold-500 transition-colors">
                    {feature.cta}
                  </span>
                  <span className="w-10 h-10 rounded-full border border-navy-700 flex items-center justify-center group-hover:bg-rosegold-500 group-hover:border-rosegold-500 transition-all duration-300">
                    <ArrowRight size={16} className="text-navy-700 group-hover:text-white transition-colors" />
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
