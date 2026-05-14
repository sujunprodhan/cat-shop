import HeroBanner from '@/components/layouts/HeroBanner';
import Product from '@/components/Product';
import ProductSkeleton from '@/components/skeletons/ProductSkeleton';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <div>
      <HeroBanner></HeroBanner>
      <header className="space-y-20 md:w-11/12 mx-auto mt-20 mb-20 px-6">
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        }>
          <Product></Product>
        </Suspense>
      </header>
    </div>
  );
}
