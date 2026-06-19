import { Instagram, Heart } from 'lucide-react';
import { instagramPosts } from '../../data/products';

export default function InstagramFeed() {
  return (
    <section className="py-20 bg-cream-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="font-inter text-xs tracking-[0.25em] uppercase font-semibold text-rosegold-500 mb-3">
            Real Women · Real Style
          </p>
          <h2 className="font-playfair text-3xl lg:text-4xl font-semibold text-navy-700 mb-2">
            @sitaravastram
          </h2>
          <p className="font-inter text-sm text-gray-500 max-w-sm mx-auto">
            Tag us in your looks using{' '}
            <span className="text-rosegold-500 font-medium">#SitaraVastram</span>{' '}
            and get featured on our feed.
          </p>
          <div className="flex items-center gap-3 mt-5 justify-center">
            <div className="h-px w-12 bg-rosegold-500" />
            <div className="w-2 h-2 rotate-45 bg-rosegold-500" />
            <div className="h-px w-12 bg-rosegold-500" />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 lg:grid-cols-8 gap-1 sm:gap-2">
          {instagramPosts.map((post, i) => (
            <a
              key={i}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative overflow-hidden ${i < 2 ? 'col-span-2 row-span-2' : ''}`}
            >
              <div className="aspect-square">
                <img
                  src={post}
                  alt={`Indian woman in ethnic fashion — Sitara Vastram customer`}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-navy-700/0 group-hover:bg-navy-700/50 transition-all duration-300 flex items-center justify-center">
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Heart size={18} className="text-white fill-white" />
                    <Instagram size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-inter font-semibold text-navy-700 border border-navy-700 px-6 py-3 rounded-sm hover:bg-navy-700 hover:text-white transition-all duration-300 group"
          >
            <Instagram size={16} />
            Follow @sitaravastram
          </a>
          <p className="font-inter text-xs text-gray-400 mt-3">50,000+ women following our journey</p>
        </div>
      </div>
    </section>
  );
}
