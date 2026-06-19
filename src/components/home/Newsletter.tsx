import { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="py-20 bg-navy-700 relative overflow-hidden">
      {/* Decorative rings */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-rosegold-500/5 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-rosegold-500/5 translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 left-8 w-32 h-32 rounded-full border border-rosegold-400/10 pointer-events-none" />
      <div className="absolute top-1/4 right-8 w-20 h-20 rounded-full border border-rosegold-400/15 pointer-events-none" />

      <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-14 h-14 rounded-full bg-rosegold-500/20 border border-rosegold-400/30 flex items-center justify-center mx-auto mb-6">
            <Sparkles size={24} className="text-rosegold-400" />
          </div>

          <p className="font-inter text-xs tracking-[0.3em] uppercase font-semibold text-rosegold-400 mb-4">
            Join the Sitara Family
          </p>
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-white leading-tight mb-2">
            Get 10% Off Your
          </h2>
          <h2 className="font-playfair text-4xl lg:text-5xl font-semibold text-rosegold-300 leading-tight mb-5">
            First Order
          </h2>
          <p className="font-inter text-base text-white/70 leading-relaxed mb-3 max-w-md mx-auto">
            Subscribe for early access to new collections, exclusive festive lookbooks, styling tips, and special offers curated for the modern Indian woman.
          </p>

          {/* Perks */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['New Collections First', 'Exclusive Deals', 'Styling Inspiration', 'Festival Lookbooks'].map(perk => (
              <span key={perk} className="flex items-center gap-1.5 text-xs font-inter text-white/60">
                <span className="w-1 h-1 rounded-full bg-rosegold-400" />
                {perk}
              </span>
            ))}
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-white/10 border border-white/20 rounded-sm px-5 py-4 font-inter text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-rosegold-400 transition-all"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-rosegold-500 text-white font-inter font-semibold text-sm tracking-wider uppercase px-6 py-4 rounded-sm hover:bg-rosegold-600 transition-all duration-300 whitespace-nowrap shadow-rose"
              >
                Subscribe
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          ) : (
            <div className="bg-white/10 rounded-sm px-8 py-6 max-w-md mx-auto border border-rosegold-400/30">
              <p className="font-playfair text-xl text-white mb-2">You're part of the family!</p>
              <p className="font-inter text-sm text-white/70">
                Your 10% off code has been sent to{' '}
                <span className="text-rosegold-300 font-medium">{email}</span>
              </p>
            </div>
          )}

          <p className="font-inter text-xs text-white/35 mt-5">
            No spam, ever. Unsubscribe at any time. We respect your inbox.
          </p>
        </div>
      </div>
    </section>
  );
}
