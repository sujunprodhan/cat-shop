import HeroBanner from '@/components/layouts/HeroBanner';
import Product from '@/components/Product';
import Test from '@/components/Test';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

export default async function Home() {
  return (
    <div>
      <HeroBanner></HeroBanner>
      <header className="space-y-20 md:w-11/12 mx-auto mt-20 mb-20">
        <Product></Product>
      </header>
    </div>
  );
}
