'use client';

import { useTheme } from '@/provider/ThemeProvider';
import CartButton from '@/components/layouts/buttons/CartButton';
import { ShieldCheck, Truck, Star } from 'lucide-react';
import Link from 'next/link';

/**
 * Client wrapper that renders the theme-aware product info panel.
 * The parent server component passes all needed data as props.
 */
const ProductInfoPanel = ({ product }) => {
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const { title, price, discount, reviews, sold, ratings } = product;
  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  /* ── Theme tokens ── */
  const heading  = isDark ? 'text-white'    : 'text-slate-900';
  const subText  = isDark ? 'text-slate-400' : 'text-slate-600';
  const muted    = isDark ? 'text-slate-500' : 'text-slate-400';
  const divider  = isDark ? 'bg-white/10'   : 'bg-slate-200';
  const soldBadge = isDark
    ? 'bg-white/5 text-emerald-400 border border-white/10'
    : 'bg-emerald-50 text-emerald-600 border border-emerald-200';
  const borderT  = isDark ? 'border-white/10' : 'border-slate-200';
  const trustIcon = isDark
    ? 'bg-white/5 border border-white/10 group-hover:bg-emerald-500 group-hover:text-white'
    : 'bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white';
  const trustIconBlue = isDark
    ? 'bg-white/5 border border-white/10 group-hover:bg-blue-500 group-hover:text-white'
    : 'bg-blue-50 border border-blue-100 group-hover:bg-blue-500 group-hover:text-white';

  return (
    <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
      <div className="mb-10">
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1] ${heading}`}>
          {title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 mb-10">
          <div className="flex items-center bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-950/20">
            <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
            <span className="text-emerald-500 font-black">{ratings || '0.0'}</span>
          </div>
          <div className={`h-4 w-px ${divider}`} />
          <div className="flex items-center gap-2">
            <span className={`font-medium text-sm ${subText}`}>
              <span className={`font-bold mr-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{reviewCount}</span> Reviews
            </span>
          </div>
        </div>

        <div className="flex items-end gap-6 mb-10">
          <div className={`text-5xl lg:text-6xl font-black tracking-tighter ${heading}`}>
            ${price?.toFixed(2)}
          </div>
          {discount && discount > 0 && (
            <div className={`text-2xl line-through font-bold mb-2 ${muted}`}>
              ${(price / (1 - discount / 100)).toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <CartButton product={product} />
      </div>

      {/* Trust Badges */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t ${borderT}`}>
        <div className="flex items-center gap-4 group">
          <div className={`p-4 rounded-2xl text-emerald-400 shadow-xl transition-all duration-300 ${trustIcon}`}>
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>1 Year Warranty</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${muted}`}>Secure Protection</span>
          </div>
        </div>
        <div className="flex items-center gap-4 group">
          <div className={`p-4 rounded-2xl text-blue-400 shadow-xl transition-all duration-300 ${trustIconBlue}`}>
            <Truck className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className={`text-sm font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>Free Delivery</span>
            <span className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${muted}`}>Worldwide Shipping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPanel;
