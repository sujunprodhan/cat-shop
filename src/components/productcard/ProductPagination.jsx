'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';

const ProductPagination = ({ currentPage, pages, search, sort, category }) => {
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const buildPageUrl = (pageNum) => {
    const params = new URLSearchParams();
    if (pageNum) params.set('page', pageNum);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (category) params.set('category', category);
    return `?${params.toString()}`;
  };

  if (pages <= 1) return null;

  const btnBg = isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-white';
  const borderT = isDark ? 'border-white/5' : 'border-slate-200';
  const activeCls = 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110';
  const inactiveCls = isDark 
    ? 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10' 
    : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50';

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-8 py-10 border-t ${borderT}`}>
      <div className="flex items-center gap-4">
        <Link
          href={buildPageUrl(currentPage - 1)}
          scroll={false}
          className={`p-4 rounded-2xl border transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-500 active:scale-95 flex items-center gap-2 group ${btnBg} ${currentPage <= 1 ? 'pointer-events-none opacity-20' : ''}`}
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Prev Selection</span>
        </Link>

        <div className="flex items-center gap-2 px-6">
          {[...Array(pages)].map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <Link
                key={pageNum}
                href={buildPageUrl(pageNum)}
                scroll={false}
                className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all duration-300 border ${isActive ? activeCls : inactiveCls}`}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        <Link
          href={buildPageUrl(currentPage + 1)}
          scroll={false}
          className={`p-4 rounded-2xl border transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-500 active:scale-95 flex items-center gap-2 group ${btnBg} ${currentPage >= pages ? 'pointer-events-none opacity-20' : ''}`}
        >
          <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Next Selection</span>
          <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
        Page <span className="text-emerald-500">{currentPage}</span> of {pages}
      </p>
    </div>
  );
};

export default ProductPagination;
