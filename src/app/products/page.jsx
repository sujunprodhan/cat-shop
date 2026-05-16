import Product from '@/components/Product';
import ProductHero from '@/components/layouts/ProductHero';
import ProductSidebar from '@/components/productcard/ProductSidebar';
import { getCategories } from '@/actions/server/product';
import React from 'react';

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
            <ProductSidebar categories={categories} />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-9">
            <Product 
              page={page || 1} 
              search={search || ''} 
              sort={sort || ''} 
              category={category || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;