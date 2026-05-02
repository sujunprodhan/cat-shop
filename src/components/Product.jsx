import { getProducts } from '@/actions/server/product';
import React from 'react';
import ProductCard from './productcard/ProductCard';

const Product = async () => {
  const products = JSON.parse(JSON.stringify(await getProducts()));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
      {products?.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default Product;
