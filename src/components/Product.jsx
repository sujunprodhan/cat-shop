import { getProducts } from '@/actions/server/product';
import React from 'react';
import ProductCard from './productcard/ProductCard';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Product = async ({ page = 1, search = '', sort = '', category = '' }) => {
  const currentPage = Number(page);
  const { products, pages } = await getProducts(currentPage, 6, search, sort, category);

  const buildPageUrl = (pageNum) => {
    const params = new URLSearchParams();
    if (pageNum) params.set('page', pageNum);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (category) params.set('category', category);
    return `?${params.toString()}`;
  };

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Premium Pagination Bar */}
      {pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-10 border-t border-white/5">
          <div className="flex items-center gap-4">
            <Link
              href={buildPageUrl(currentPage - 1)}
              scroll={false}
              className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-500 active:scale-95 flex items-center gap-2 group ${currentPage <= 1 ? 'pointer-events-none opacity-20' : ''}`}
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
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all duration-300 border ${isActive ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-110' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'}`}
                  >
                    {pageNum}
                  </Link>
                );
              })}
            </div>

            <Link
              href={buildPageUrl(currentPage + 1)}
              scroll={false}
              className={`p-4 rounded-2xl bg-white/5 border border-white/10 text-white transition-all duration-300 hover:bg-emerald-600 hover:border-emerald-500 active:scale-95 flex items-center gap-2 group ${currentPage >= pages ? 'pointer-events-none opacity-20' : ''}`}
            >
              <span className="text-xs font-black uppercase tracking-widest hidden sm:inline">Next Selection</span>
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
            Page <span className="text-emerald-400">{currentPage}</span> of {pages}
          </p>
        </div>
      )}
    </div>
  );
};

export default Product;
