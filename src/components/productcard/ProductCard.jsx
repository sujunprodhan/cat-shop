'use client';

import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import CartButton from '../layouts/buttons/CartButton';
import { toggleFavorite } from '@/actions/server/favorite';
import { useFavorites } from '@/provider/FavoriteProvider';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const { title, image, ratings, reviews, price, sold, _id } = product || {};
  const { isFavorite, updateFavorites } = useFavorites();
  
  // Calculate review count correctly
  const reviewCount = Array.isArray(reviews) ? reviews.length : (reviews || 0);
  
  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const res = await toggleFavorite(_id.toString());
    if (res.success) {
      updateFavorites();
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#0f172a',
        color: '#fff',
        iconColor: '#10b981',
      });
      Toast.fire({
        icon: 'success',
        title: res.message
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: res.message,
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    }
  };

  const favorited = isFavorite(_id);

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-emerald-500/10 transition-all duration-500 flex flex-col h-full hover:border-emerald-500/30">
      <div className="relative w-full h-72 bg-white/5 flex items-center justify-center p-8 overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <Image
          src={image}
          alt={title || 'Product Image'}
          width={500}
          height={500}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-in-out drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
        />
        <button 
          onClick={handleToggleFavorite}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border border-white/10 transition-all duration-300 z-20 ${
            favorited 
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-110' 
              : 'bg-slate-950/50 text-white hover:text-rose-500 hover:bg-slate-900'
          }`}
        >
          <Heart size={18} className={favorited ? 'fill-white' : 'transition-colors'} />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {sold > 100 && (
            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
              Hot
            </span>
          )}
          {sold < 20 && (
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
              New
            </span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <CartButton product={{ ...product, _id: _id.toString() }}></CartButton>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        {/* Rating and Sold */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs font-black text-emerald-400">{ratings || '0.0'}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-500">({reviewCount})</span>
          </div>
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{sold || 0} Sold</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product?._id}`} className="block mb-auto">
          <h2 className="text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors duration-300">
            {title}
          </h2>
        </Link>

        {/* Price & Action */}
        <div className="flex items-end justify-between mt-6 pt-6 border-t border-white/5">
          <div className="space-y-1">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Price</p>
            <span className="text-2xl font-black text-emerald-400 tracking-tight">
              ${Number(price).toFixed(2)}
            </span>
          </div>

          <Link 
            href={`/products/${product?._id}`}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-emerald-600 hover:border-emerald-600 transition-all duration-300 group/btn"
          >
            <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
