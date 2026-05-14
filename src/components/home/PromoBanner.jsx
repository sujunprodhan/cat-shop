import React from 'react';
import Link from 'next/link';
import { Sparkles, Send } from 'lucide-react';

const PromoBanner = () => {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative rounded-[4rem] bg-emerald-600 overflow-hidden group">
          {/* Background Patterns */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150"></div>
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between p-12 lg:p-24 gap-12">
            <div className="space-y-8 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white font-black uppercase tracking-[0.3em] text-[10px]">
                <Sparkles size={14} className="text-emerald-300" /> Season Launch Sale
              </div>
              <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                GET <span className="text-emerald-950">20% OFF</span> ON YOUR FIRST ORDER
              </h2>
              <p className="text-emerald-100 font-bold text-lg max-w-lg">
                Join the CATSHOP community today and treat your companion to the luxury they deserve.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/products" className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-transform shadow-2xl">
                  Shop Now
                </Link>
                <div className="relative group/input">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="bg-emerald-700/50 border border-white/10 rounded-2xl px-8 py-5 text-white placeholder:text-emerald-200 outline-none w-full sm:w-80 focus:ring-4 focus:ring-white/10 transition-all"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white rounded-xl text-emerald-600 hover:scale-110 transition-transform">
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="relative h-[400px] w-full lg:w-[500px] hidden lg:block">
              {/* Decorative Floating Cards */}
              <div className="absolute top-10 left-10 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-bounce duration-[3000ms]">
                <p className="text-white font-black text-xs uppercase tracking-widest">Premium Quality</p>
              </div>
              <div className="absolute bottom-10 right-10 p-6 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-pulse">
                <p className="text-white font-black text-xs uppercase tracking-widest">Fast Delivery</p>
              </div>
              {/* Central Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/20 blur-[80px] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
