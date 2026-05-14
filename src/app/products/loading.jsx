import ProductSkeleton from '@/components/skeletons/ProductSkeleton';
import React from 'react';

const Loading = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
        {[...Array(6)].map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default Loading;
