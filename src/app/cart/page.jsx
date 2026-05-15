import { getCart } from '@/actions/server/cart';
import CartSection from '@/components/layouts/buttons/CartSection';
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';

const CartItemPage = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/cart');
  }

  const cartItem = await getCart();
  const formattedItems = cartItem?.map((item) => ({ ...item, _id: item._id.toString() }));

  return (
    <div className="mt-10 container mx-auto">
      <h1 className="text-4xl font-bold  border-green-500 border-l-4 pl-2 rounded-md">My Cart</h1>
      <CartSection cartItem={formattedItems}></CartSection>
    </div>
  );
};

export default CartItemPage;
