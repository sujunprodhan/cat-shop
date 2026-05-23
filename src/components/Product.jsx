import { getProducts } from '@/actions/server/product';
import React from 'react';
import ProductCard from './productcard/ProductCard';
import ProductPagination from './productcard/ProductPagination';
import Link from 'next/link';

const Product = async ({ page = 1, search = '', sort = '', category = '' }) => {
  const currentPage = Number(page);
  const { products, pages } = await getProducts(currentPage, 6, search, sort, category);

  const buildPageUrl = (pageNum) => {
    const params = new URLSearchParams();
    if (pageNum) params.set('page', pageNum);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);
    if (category) params.set('category', category);
    return `?${params.toString()}`;
  };

  return (
    <div className="space-y-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
        {products?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>


      <ProductPagination 
        currentPage={currentPage}
        pages={pages}
        search={search}
        sort={sort}
        category={category}
      />
    </div>
  );
};

export default Product;
