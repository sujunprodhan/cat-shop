import { getCart } from '@/actions/server/cart';
import CartPage from '@/components/cartpage/CartPage';
import CartSection from '@/components/layouts/buttons/CartSection';
import React from 'react';

const CartItemPage = async () => {
  const cartItem = await getCart();
  const formattedItems = cartItem?.map((item) => ({ ...item, _id: item._id.toString() }));

  return (
    <div className="md:w-11/12 mx-auto  px-6 font-sans mt-20">
      <div className="border-l border-green-500 mt-5 mb-8">
        <h1 className="text-3xl font-bold">My Cart</h1>
      </div>
      <CartSection cartItem={formattedItems}></CartSection>
    </div>
  );
};

export default CartItemPage;
