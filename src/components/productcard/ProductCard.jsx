'use client';

import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import CartButton from '../layouts/buttons/CartButton';
import { toggleFavorite } from '@/actions/server/favorite';
import { useFavorites } from '@/provider/FavoriteProvider';
import { useTheme } from '@/provider/ThemeProvider';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const { title, image, ratings, reviews, price, sold, _id } = product || {};
  const { isFavorite, updateFavorites } = useFavorites();
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const reviewCount = Array.isArray(reviews) ? reviews.length : 0;

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const res = await toggleFavorite(_id.toString());
    if (res.success) {
      updateFavorites();
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: res.message,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#fff' : '#0f172a',
        confirmButtonColor: '#10b981',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: res.message,
        background: isDark ? '#0f172a' : '#ffffff',
        color: isDark ? '#fff' : '#0f172a',
        confirmButtonColor: '#10b981',
      });
    }
  };

  const favorited = isFavorite(_id);

  /* ── Theme classes ── */
  const cardBg    = isDark
    ? 'bg-white/5 border-white/10 hover:border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-emerald-500/10'
    : 'bg-white border-slate-200 hover:border-emerald-400/50 shadow-md hover:shadow-emerald-200';
  const imgBg     = isDark ? 'bg-white/5' : 'bg-slate-50';
  const titleCls  = isDark ? 'text-white group-hover:text-emerald-400'   : 'text-slate-900 group-hover:text-emerald-600';
  const borderT   = isDark ? 'border-white/5' : 'border-slate-100';
  const metaCls   = isDark ? 'text-slate-500' : 'text-slate-400';
  const shopBtnBg = isDark
    ? 'bg-white/5 border-white/10 text-white hover:bg-emerald-600 hover:border-emerald-600'
    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600';
  const heartOff  = isDark
    ? 'bg-slate-950/50 text-white hover:text-rose-500 hover:bg-slate-900'
    : 'bg-white/80 text-slate-500 hover:text-rose-500 hover:bg-rose-50';

  return (
    <div className={`group relative rounded-3xl overflow-hidden backdrop-blur-2xl border transition-all duration-500 flex flex-col h-full ${cardBg}`}>
      <div className={`relative w-full h-72 flex items-center justify-center p-8 overflow-hidden ${imgBg}`}>
        {/* Hover glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Image
          src={image}
          alt={title || 'Product Image'}
          width={500}
          height={500}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out drop-shadow-[0_10px_20px_rgba(0,0,0,0.3)]"
        />

        {/* Favorite button */}
        <button
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 z-20 ${
            favorited
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-110'
              : heartOff
          }`}
        >
          <Heart size={18} className={favorited ? 'fill-white' : 'transition-colors'} />
        </button>



        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <CartButton product={{ ...product, _id: _id.toString() }} />
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Rating & sold */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-black text-emerald-500">{ratings || '0.0'}</span>
            </div>
            <span className={`text-[10px] font-bold ${metaCls}`}>({reviewCount})</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/products/${product?._id}`} className="block mb-auto">
          <h2 className={`text-lg font-bold line-clamp-2 leading-snug transition-colors duration-300 ${titleCls}`}>
            {title}
          </h2>
        </Link>

        {/* Price & action */}
        <div className={`flex items-end justify-between mt-6 pt-6 border-t ${borderT}`}>
          <div className="space-y-1">
            <p className={`text-[10px] font-black uppercase tracking-widest ${metaCls}`}>Price</p>
            <span className="text-2xl font-black text-emerald-500 tracking-tight">
              ${Number(price).toFixed(2)}
            </span>
          </div>

          <Link
            href={`/products/${product?._id}`}
            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 group/btn ${shopBtnBg}`}
          >
            <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
