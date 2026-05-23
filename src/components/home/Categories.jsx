'use client';

import React from 'react';
import { ShoppingBag, Beef, Sofa, Ghost } from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/provider/ThemeProvider';

const Categories = ({ counts = {} }) => {
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const getCount = (key) => counts[key] || 0;

  const cats = [
    { name: 'Cat Food',    icon: <Beef size={28} />,        items: `${getCount('cat food')} Products` },
    { name: 'Accessories', icon: <ShoppingBag size={28} />, items: `${getCount('accessories')} Products`  },
    { name: 'Beds & Mats', icon: <Sofa size={28} />,        items: `${getCount('beds & mats')} Products`  },
    { name: 'Interactive', icon: <Ghost size={28} />,       items: `${getCount('interactive')} Products`  },
  ];

  const headingCls  = isDark ? 'text-white'    : 'text-slate-900';
  const subLinkCls  = isDark
    ? 'text-white hover:text-emerald-400'
    : 'text-slate-700 hover:text-emerald-600';
  const borderCls   = isDark ? 'border-white/10 hover:border-emerald-400' : 'border-slate-300 hover:border-emerald-400';
  const cardBg      = isDark
    ? 'bg-white/5 border-white/10 hover:border-emerald-500/30'
    : 'bg-white border-slate-200 hover:border-emerald-400/60 shadow-md';
  const iconCorner  = isDark ? 'bg-white/5' : 'bg-slate-100';
  const iconText    = isDark ? 'text-white' : 'text-slate-700';
  const catName     = isDark ? 'text-white' : 'text-slate-900';
  const catItems    = isDark ? 'text-slate-500' : 'text-slate-400';
  const arrowBtn    = isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-700';

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <p className="text-emerald-400 font-black uppercase tracking-[0.4em] text-xs">Curated Selection</p>
            <h2 className={`text-5xl lg:text-6xl font-black tracking-tighter ${headingCls}`}>
              Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Categories</span>
            </h2>
          </div>
          <Link
            href="/products"
            className={`group flex items-center gap-3 font-black uppercase tracking-widest text-xs transition-colors ${subLinkCls}`}
          >
            View All Collections
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center group-hover:border-emerald-500 transition-all ${borderCls}`}>
              →
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cats.map((cat, i) => (
            <Link
              href={`/products?category=${encodeURIComponent(cat.name.toLowerCase())}`}
              key={i}
              className={`group relative h-72 rounded-[3rem] overflow-hidden border p-10 flex flex-col justify-between hover:-translate-y-2 transition-all duration-500 ${cardBg}`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] group-hover:bg-emerald-500/20 transition-all duration-500 flex items-center justify-center ${iconCorner}`}>
                <div className={`group-hover:scale-110 transition-transform ${iconText}`}>
                  {cat.icon}
                </div>
              </div>

              <div className="relative z-10 space-y-2">
                <h3 className={`text-2xl font-black leading-tight ${catName}`}>{cat.name}</h3>
                <p className={`text-xs font-black uppercase tracking-widest ${catItems}`}>{cat.items}</p>
              </div>

              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500 ${arrowBtn}`}>
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
