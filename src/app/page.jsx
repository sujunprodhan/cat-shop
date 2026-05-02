import HeroBanner from "@/components/layouts/HeroBanner";
import Product from "@/components/Product";
import Image from "next/image";

export default function Home() {
  return (
    <div>
        <HeroBanner></HeroBanner>
      <header className="space-y-20 md:w-11/12 mx-auto mt-20 mb-20">
      <Product></Product>
      </header>
    </div>
  );
}
