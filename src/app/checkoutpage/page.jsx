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
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-slate-900 mb-8 border-l-8 border-emerald-500 pl-6 leading-tight">
          Checkout <span className="text-emerald-600">Information</span>
        </h1>
        <CheckOut cartItem={formattedItems} session={session}></CheckOut>
      </div>
    </div>
  );
};

export default CheckoutPage;