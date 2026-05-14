import Product from '@/components/Product';
import ProductHero from '@/components/layouts/ProductHero';
import React from 'react';

const ProductPage = async ({ searchParams }) => {
  const { page, search, sort } = (await searchParams) || {};
  
  return (
    <div className="pb-20">
      <ProductHero />
      <div className="max-w-7xl mx-auto px-6">
        <Product page={page || 1} search={search || ''} sort={sort || ''}></Product>
      </div>
    </div>
  );
};

export default ProductPage;