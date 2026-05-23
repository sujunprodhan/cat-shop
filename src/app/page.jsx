import HeroBanner from '@/components/layouts/HeroBanner';
import Product from '@/components/Product';
import ProductSkeleton from '@/components/skeletons/ProductSkeleton';
import Features from '@/components/home/Features';
import Categories from '@/components/home/Categories';
import PromoBanner from '@/components/home/PromoBanner';
import ProductsSectionHeading from '@/components/home/ProductsSectionHeading';
import { Suspense } from 'react';
import { getCategoryCounts } from '@/actions/server/product';

export default async function Home({ searchParams }) {
  const { page } = (await searchParams) || {};
  const counts = await getCategoryCounts();

  return (
    <div className="space-y-10 md:space-y-20 pb-20">
      <HeroBanner></HeroBanner>
      
      <Features />
      
      <Categories counts={counts} />
      
      <section className="max-w-7xl mx-auto px-6 space-y-16">
        <ProductsSectionHeading />

        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        }>
          <Product page={page || 1}></Product>
        </Suspense>
      </section>

      <PromoBanner />
    </div>
  );
}
