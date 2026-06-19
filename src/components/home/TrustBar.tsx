import { Truck, RefreshCw, Shield, Star, CreditCard } from 'lucide-react';

const trustItems = [
  { icon: Truck, label: 'Free Shipping', sublabel: 'Orders above ₹999' },
  { icon: RefreshCw, label: 'Easy Returns', sublabel: '7-day hassle-free' },
  { icon: Shield, label: 'Secure Payments', sublabel: 'SSL encrypted' },
  { icon: Star, label: '50,000+ Women', sublabel: 'Trust Sitara Vastram' },
  { icon: CreditCard, label: 'COD Available', sublabel: 'Pan India delivery' },
];

export default function TrustBar() {
  return (
    <section className="bg-white border-y border-rosegold-200/40 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-rosegold-100">
          {trustItems.map(({ icon: Icon, label, sublabel }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row items-center gap-3 px-4 py-5 text-center sm:text-left group hover:bg-cream-100 transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-cream-200 flex items-center justify-center flex-shrink-0 group-hover:bg-rosegold-100 transition-colors">
                <Icon size={18} className="text-rosegold-500" />
              </div>
              <div>
                <p className="font-inter text-xs font-semibold text-navy-700 leading-tight">{label}</p>
                <p className="font-inter text-xs text-gray-500 mt-0.5">{sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
