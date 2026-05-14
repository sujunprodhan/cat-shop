import { getCart } from '@/actions/server/cart';
import CartSection from '@/components/layouts/buttons/CartSection';
import React from 'react';

const CartItemPage = async () => {
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
