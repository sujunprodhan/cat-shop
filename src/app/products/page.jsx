import Product from '@/components/Product';
import ProductHero from '@/components/layouts/ProductHero';
import ProductSidebar from '@/components/productcard/ProductSidebar';
import { getCategories } from '@/actions/server/product';
import React, { Suspense } from 'react';
import ProductSkeleton from '@/components/skeletons/ProductSkeleton';

const ProductPage = async ({ searchParams }) => {
  const { page, search, sort, category } = (await searchParams) || {};
  const categories = await getCategories();
  
  return (
    <div className="pb-20">
      <ProductHero />
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <Suspense fallback={<div className="h-96 rounded-[2.5rem] bg-white/5 animate-pulse"></div>}>
              <ProductSidebar categories={categories} />
            </Suspense>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <Suspense 
              fallback={
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
                  {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
                </div>
              } 
              key={category + page + search + sort}
            >
              <Product 
                page={page || 1} 
                search={search || ''} 
                sort={sort || ''} 
                category={category || ''}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;