import { getSingleProduct } from '@/actions/server/product';
import CartButton from '@/components/layouts/buttons/CartButton';
import ProductTabs from '@/components/producttab/ProductTabs';

import { ArrowLeft, ShieldCheck, Star, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductDetails = async ({ params }) => {
  const { id } = await params;
  const product = await getSingleProduct(id);
  const { image, title, price, discount, description, reviews, sold, ratings } = product;
  

  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-black uppercase tracking-widest text-slate-400 hover:text-emerald-400 mb-10 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-emerald-500/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Back to collection
        </Link>

        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10">
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery Section */}
            <div className="lg:w-1/2 p-6 lg:p-16 bg-white/5 flex items-center justify-center relative group overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              {/* Background Glow for Image */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5"></div>
              
              {discount && discount > 0 && (
                <div className="absolute top-8 left-8 bg-rose-600 text-white px-6 py-2 rounded-2xl text-xs font-black tracking-[0.2em] z-10 shadow-xl shadow-rose-950/20 uppercase">
                  {discount}% OFF
                </div>
              )}
              
              <div className="relative w-full aspect-square rounded-[2rem] overflow-hidden bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-700 group-hover:scale-105 flex items-center justify-center border border-white/10">
                <Image
                  src={image}
                  alt="Product Image"
                  width={600}
                  height={600}
                  className="object-contain p-8 w-full h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  priority
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
              <div className="mb-10">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-[1.1]">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-6 mb-10">
                  <div className="flex items-center bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-500/20 shadow-lg shadow-emerald-950/20">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-2" />
                    <span className="text-emerald-400 font-black">{ratings || '0.0'}</span>
                  </div>
                  <div className="h-4 w-px bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-medium text-sm">
                      <span className="text-white font-bold mr-1">{reviews || 0}</span> Reviews
                    </span>
                  </div>
                  <div className="h-4 w-px bg-white/10"></div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white/5 text-emerald-400 px-4 py-2 rounded-xl border border-white/10 font-black text-xs uppercase tracking-widest">
                      {sold || 0} Sold
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-6 mb-10">
                  <div className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
                    ${price?.toFixed(2)}
                  </div>
                  {discount && discount > 0 && (
                    <div className="text-2xl text-slate-500 line-through font-bold mb-2">
                      ${(price / (1 - discount / 100)).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mb-12">
                <CartButton product={product}></CartButton>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-white/10">
                <div className="flex items-center gap-4 group">
                  <div className="bg-white/5 p-4 rounded-2xl text-emerald-400 shadow-xl border border-white/10 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white uppercase tracking-wider">1 Year Warranty</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Secure Protection</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="bg-white/5 p-4 rounded-2xl text-blue-400 shadow-xl border border-white/10 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white uppercase tracking-wider">Free Delivery</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Worldwide Shipping</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
          <div className="max-w-7xl mx-auto mt-10">
            <ProductTabs
              productId={id}
              description={description}
              reviews={reviews}
              ratings={ratings}
            />
          </div>
      </div>
    </div>
  );
};

export default ProductDetails;
