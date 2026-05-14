import React from 'react';

const ProductDetailsSkeleton = () => {
  return (
    <div className="min-h-screen relative py-12 px-4 sm:px-6 lg:px-8 animate-pulse">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button Skeleton */}
        <div className="h-8 bg-white/5 w-48 rounded-full mb-10"></div>

        <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section Skeleton */}
            <div className="lg:w-1/2 p-16 bg-white/5 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-white/10">
              <div className="w-full aspect-square rounded-[2rem] bg-white/10"></div>
            </div>

            {/* Content Section Skeleton */}
            <div className="lg:w-1/2 p-8 lg:p-16 space-y-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="h-14 bg-white/10 rounded-2xl w-full"></div>
                <div className="h-14 bg-white/10 rounded-2xl w-3/4"></div>
                
                <div className="flex items-center gap-6 pt-4">
                  <div className="h-10 bg-emerald-500/10 w-24 rounded-xl"></div>
                  <div className="h-6 bg-white/5 w-32 rounded-lg"></div>
                  <div className="h-10 bg-white/5 w-24 rounded-xl"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="h-16 bg-white/10 rounded-3xl w-1/2"></div>
                <div className="h-16 bg-emerald-600/20 rounded-2xl w-full"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-10 border-t border-white/10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/10 rounded w-2/3"></div>
                    <div className="h-3 bg-white/5 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
