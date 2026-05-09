import { getCart } from '@/actions/server/cart';
import CartPage from '@/components/cartpage/CartPage';
import CartSection from '@/components/layouts/buttons/CartSection';
import React from 'react';

const CartItemPage = async () => {
  const cartItem = await getCart();
  const formattedItems = cartItem?.map((item) => ({ ...item, _id: item._id.toString() }));

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 border-l-4 border-orange-500 pl-3">My Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CartSection cartItem={formattedItems}></CartSection>
      </div>
    </div>
  );
};

export default CartItemPage;
