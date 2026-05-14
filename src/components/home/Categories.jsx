import React from 'react';
import { ShoppingBag, Beef, Sofa, Ghost } from 'lucide-react';
import Link from 'next/link';

const Categories = () => {
  const cats = [
    { name: 'Cat Food', icon: <Beef size={28} />, items: '120+ Products', color: 'bg-emerald-500' },
    { name: 'Accessories', icon: <ShoppingBag size={28} />, items: '85+ Products', color: 'bg-blue-500' },
    { name: 'Beds & Mats', icon: <Sofa size={28} />, items: '40+ Products', color: 'bg-indigo-500' },
    { name: 'Interactive Toys', icon: <Ghost size={28} />, items: '60+ Products', color: 'bg-rose-500' },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs">Curated Selection</p>
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Categories</span>
            </h2>
          </div>
          <Link href="/products" className="group flex items-center gap-3 text-white font-black uppercase tracking-widest text-xs hover:text-emerald-400 transition-colors">
            View All Collections
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-emerald-500 transition-all">
              →
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cats.map((cat, i) => (
            <Link 
              href={`/products?category=${cat.name.toLowerCase()}`} 
              key={i}
              className="group relative h-72 rounded-[3rem] overflow-hidden bg-white/5 border border-white/10 p-10 flex flex-col justify-between hover:-translate-y-2 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[4rem] group-hover:bg-emerald-500/20 transition-all duration-500 flex items-center justify-center">
                <div className="text-white group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
              </div>
              
              <div className="relative z-10 space-y-2">
                <h3 className="text-2xl font-black text-white leading-tight">{cat.name}</h3>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{cat.items}</p>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500">
                →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
