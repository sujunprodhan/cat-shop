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
        <CheckOut cartItem={formattedItems} session={session}></CheckOut>
      </div>
    </div>
  );
};

export default CheckoutPage;