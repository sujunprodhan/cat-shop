'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Filter, Sparkles } from 'lucide-react';

const ProductSidebar = ({ categories = [] }) => {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');
  const currentSort = searchParams.get('sort');
  const currentSearch = searchParams.get('search');

  const buildUrl = (category) => {
    const params = new URLSearchParams(searchParams);
    if (category) {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    params.set('page', '1'); // Reset to page 1 on filter change
    return `/products?${params.toString()}`;
  };

  return (
    <div className="space-y-10 sticky top-28">
      {/* Category Section */}
      <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[80px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <Filter size={18} />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase">Categories</h3>
          </div>

          <div className="space-y-2">
            <Link
              href={buildUrl('')}
              className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 group/link ${!currentCategory ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <span className="text-sm font-bold uppercase tracking-widest">All Products</span>
              {!currentCategory && <ChevronRight size={16} className="text-white" />}
            </Link>

            {categories.map((category) => {
              const isActive = currentCategory === category;
              return (
                <Link
                  key={category}
                  href={buildUrl(category)}
                  className={`flex items-center justify-between w-full px-5 py-4 rounded-2xl transition-all duration-300 group/link ${isActive ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className="text-sm font-bold uppercase tracking-widest truncate max-w-[150px]">{category}</span>
                  {isActive && <ChevronRight size={16} className="text-white" />}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Featured Badge/Promo */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
            <Sparkles size={12} className="text-emerald-100" />
            <span className="text-[8px] font-black uppercase tracking-widest text-white">Member Exclusive</span>
          </div>
          <h4 className="text-2xl font-black text-white leading-tight">Join Our Cat Lovers Club</h4>
          <p className="text-emerald-100/70 text-xs font-medium leading-relaxed">Get 15% off your first order and exclusive access to new feline collections.</p>
          <button className="w-full py-4 bg-white text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-50 transition-colors shadow-lg">
            Join Now
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-400 rounded-full blur-3xl opacity-50 animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductSidebar;
