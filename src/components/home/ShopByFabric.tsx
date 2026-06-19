import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import { fabrics } from '../../data/products';

export default function ShopByFabric() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          overline="Material Stories"
          title="Shop by Fabric"
          subtitle="Every fabric is chosen for how it makes you feel — the weight, the drape, the whisper of cloth against skin."
          center
        />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mt-12">
          {fabrics.map(fabric => (
            <Link
              key={fabric.name}
              to={`/collections?fabric=${fabric.name.toLowerCase()}`}
              className="group flex flex-col items-center gap-3 text-center cursor-pointer"
            >
              <div className="relative w-full aspect-square rounded-full overflow-hidden shadow-card group-hover:shadow-card-hover transition-all duration-500 group-hover:scale-105">
                <img
                  src={fabric.image}
                  alt={`Woman in ${fabric.name} ethnic wear`}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-navy-700/20 group-hover:bg-navy-700/40 transition-all duration-300 rounded-full" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-rosegold-400 transition-all duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xs font-inter font-semibold bg-rosegold-500/80 px-2 py-1 rounded-sm">
                    Shop
                  </span>
                </div>
              </div>
              <div>
                <p className="font-inter text-sm font-semibold text-navy-700 group-hover:text-rosegold-500 transition-colors">
                  {fabric.name}
                </p>
                <p className="font-inter text-xs text-gray-500 mt-0.5">{fabric.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
