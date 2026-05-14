import React from 'react';

const ProductSkeleton = () => {
  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 p-6 space-y-6 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-72 bg-white/10 rounded-[2rem]"></div>
      
      {/* Content Skeleton */}
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-4 bg-emerald-500/10 rounded-lg w-16"></div>
          <div className="h-3 bg-white/5 rounded-lg w-12"></div>
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-white/10 rounded-lg w-full"></div>
          <div className="h-6 bg-white/10 rounded-lg w-2/3"></div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="flex justify-between items-end pt-6 border-t border-white/5">
        <div className="space-y-2">
          <div className="h-3 bg-white/5 rounded-lg w-10"></div>
          <div className="h-8 bg-emerald-500/10 rounded-lg w-20"></div>
        </div>
        <div className="h-12 w-12 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
