'use server'

import { getCart } from "@/actions/server/cart";
import CheckOut from "@/components/cartpage/CheckOut";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

const CheckoutPage = async () => {
  const session = await getServerSession(authOptions);
  const cartItem = await getCart();
  const formattedItems = cartItem?.map((item) => ({ ...item, _id: item._id.toString() }));
  
  return (
    <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight">
            Checkout <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Process</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs mt-4 ml-1">Complete your premium selection</p>
        </div>
        <CheckOut cartItem={formattedItems} session={session}></CheckOut>
      </div>
    </div>
  );
};

export default CheckoutPage;