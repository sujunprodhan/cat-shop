import { Eye, Heart, ShoppingBag, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import CartButton from '../layouts/buttons/CartButton';

const ProductCard = ({ product }) => {
  const { title, image, review, price, sold, _id } = product || {};
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative w-full h-64 bg-gray-50/50 flex items-center justify-center p-6 overflow-hidden">
        <Image
          src={image}
          alt={title || 'Product Image'}
          width={500}
          height={500}
          className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-in-out"
        />
        <button className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-sm   hover:bg-green-50 hover:text-green-600  duration-300 z-10 text-gray-400">
          <Heart size={18} className="transition-colors" />
        </button>
        {/* Badge */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {sold > 100 && (
            <span className="bg-red-500/10 text-red-600 border border-red-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              Hot
            </span>
          )}
          {sold < 20 && (
            <span className="bg-green-500/10 text-green-600 border border-green-500/20 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              New
            </span>
          )}
        </div>
        {/* Quick View Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10">
          <CartButton product={{...product, _id: _id.toString()}}></CartButton>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow:1">
        {/* Rating and Sold */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-yellow-50 px-2 py-1 rounded-md">
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-bold text-yellow-700">{review || '0.0'}</span>
          </div>
          <span className="text-xs font-medium text-gray-400">{sold || 0} Sold</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product?._id}`} className="block group/title mb-auto">
          <h2 className="text-lg font-bold text-gray-900 line-clamp-2 leading-snug group-hover/title:text-green-600 transition-colors">
            {title}
          </h2>
        </Link>

        {/* Price & Action */}
        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Price</p>
            <span className="text-2xl font-extrabold text-green-600 tracking-tight">
              ${Number(price).toFixed(2)}
            </span>
          </div>

          <button>
            {/* view Details Button */}
            <div className="w-full bg-white/90 backdrop-blur text-green-700 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold hover:bg-green-600 hover:text-white transition-colors shadow-lg border border-green-100">
              <Link href={`/products/${product?._id}`}>View Details</Link>
              <ShoppingBag size={20} className="group-hover/btn:scale-110 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
