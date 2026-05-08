import { getCart } from '@/actions/server/cart';
import CartPage from '@/components/cartpage/CartPage';
import React from 'react';

const CartItemPage = async () => {
  const cartItem = await getCart();

  return (
    <div className="md:w-11/12 mx-auto  px-6 font-sans mt-20">
      <div className="border-l border-green-500 mt-5 mb-8">
        <h1 className="text-3xl font-bold">My Cart</h1>
        <p className="text-xl font-semibold text-gray-500">
          <span className="text-green-600">({cartItem.length})</span> Items Found in the cart
        </p>
      </div>
      <div className='flex flex-col gap-10'>
        {cartItem?.map((item) => (
          <CartPage key={item._id.toString()} item={item}></CartPage>
        ))}
      </div>
    </div>
  );
};

export default CartItemPage;
