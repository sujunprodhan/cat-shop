import { getRelatedProducts, getSingleProduct } from '@/actions/server/product';
import ProductCard from '@/components/productcard/ProductCard';
import ProductInfoPanel from '@/components/productcard/ProductInfoPanel';
import ProductTabs from '@/components/producttab/ProductTabs';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductDetails = async ({ params }) => {
  const { id } = await params;
  const product = await getSingleProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-black text-white">Product Not Found</h2>
          <Link href="/products" className="text-emerald-400 hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const { image, description, reviews, ratings, category, discount } = product;
  const relatedProducts = await getRelatedProducts(id, category);

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

        {/* Product Card */}
        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 [data-theme='light']:bg-white [data-theme='light']:border-slate-200">
          <div className="flex flex-col lg:flex-row">
            {/* Image Side */}
            <div className="lg:w-1/2 p-6 lg:p-16 bg-white/5 flex items-center justify-center relative group overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-blue-500/5" />

              {discount && discount > 0 && (
                <div className="absolute top-8 left-8 bg-rose-600 text-white px-6 py-2 rounded-2xl text-xs font-black tracking-[0.2em] z-10 shadow-xl uppercase">
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

            {/* Info Side — Client component for theme-awareness */}
            <ProductInfoPanel product={product} />
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto mt-10">
          <ProductTabs productId={id} description={description} reviews={reviews} ratings={ratings} />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 space-y-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Curated For You</span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">
                  Related <span className="text-emerald-500">Products</span>
                </h2>
              </div>
              <Link href="/products" className="text-slate-400 hover:text-white font-bold text-sm tracking-widest uppercase flex items-center gap-2 group">
                View Collection
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-emerald-500 transition-all">→</div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
