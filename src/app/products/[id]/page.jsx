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
    <div className=" min-h-screen bg-gray-50 py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to products
        </Link>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Image Gallery Section */}
            <div className="lg:w-1/2 p-3 lg:p-12 bg-gray-50/50 flex items-center justify-center relative group">
              {discount && discount > 0 && (
                <div
                  className="absolute top-5
                 left-5 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold tracking-wider z-10 shadow-lg shadow-red-500/30 animate-pulse"
                >
                  {discount}% OFF
                </div>
              )}
              <div className="relative w-full max-w-7xl mt-5 h-125 aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl transition-transform duration-700 group-hover:scale-105 flex items-center justify-center">
                <Image
                  src={image}
                  alt="Product Image"
                  width={600}
                  height={600}
                  className="object-contain p-3 w-full h-full"
                  priority
                />
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-4 leading-tight">
                  {title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 mb-6">
                  <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-200 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1.5" />
                    <span className="text-yellow-700">{ratings || '0.0'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">•</span>
                    <span className="hover:text-gray-900 cursor-pointer underline-offset-4 hover:underline transition-all">
                      {reviews || 0} Reviews
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">•</span>
                    <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-200 font-semibold shadow-sm">
                      {sold || 0} Sold
                    </span>
                  </div>
                </div>

                <div className="flex items-end gap-4 mb-8">
                  <div className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
                    ${price?.toFixed(2)}
                  </div>
                  {discount && discount > 0 && (
                    <div className="text-xl text-gray-400 line-through font-medium mb-1">
                      ${(price / (1 - discount / 100)).toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div>
                <CartButton product={product}></CartButton>
              </div>
              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 shadow-sm border border-blue-100">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">1 Year Warranty</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <div className="bg-green-50 p-2.5 rounded-xl text-green-600 shadow-sm border border-green-100">
                    <Truck className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold">Fast & Free Delivery</span>
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
