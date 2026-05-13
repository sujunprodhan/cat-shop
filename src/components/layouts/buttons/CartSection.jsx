'use client';

import CartPage from '@/components/cartpage/CartPage';
import OrderSummery from '@/components/cartpage/OrderSummery';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const CartSection = ({ cartItem = [] }) => {
  const [items, setItems] = useState(cartItem);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item._id != id));
  };

  const updateQuantity = (id, newQty) => {
    setItems((prevItems) =>
      prevItems?.map((item) => (item._id === id ? { ...item, quantity: newQty } : item))
    );
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* LEFT SIDE - CART ITEMS */}
      <div className="gride-col-span-10">
        <div className="flex justify-between items-center mb-3">
          <div className="border border-green-200 rounded-md px-4 py-2">
            Items Found in the cart{' '}
            <span className="text-green-600 text-lg font-semibold">({items.length})</span>
          </div>

          <div className="flex gap-3">
            <div className="flex items-center gap-2 border border-green-200 rounded-md px-4 py-2">
              <p className="text-green-500 font-bold">Total Items:</p>
              <span className="font-bold">{totalItems}</span>
            </div>

            <div className="flex items-center gap-2 border border-green-200 rounded-md px-4 py-2">
              <p className="text-green-500 font-bold">Total Price:</p>
              <span className="font-bold">${totalPrice}</span>
            </div>
          </div>
        </div>

        {/* CART ITEMS */}
        <div className="flex flex-col gap-6">
          {items?.map((item) => (
            <CartPage
              key={item._id.toString()}
              item={item}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div>
        <div className="sticky top-3 border border-green-600 rounded-xl p-5 shadow-sm bg-white">
          <div className="flex flex-col gap-3">
            <h1 className="text-2xl font-bold text-green-700 mb-5">Order Summery</h1>
            {cartItem?.map((item, index) => (
              <OrderSummery key={index} item={item}></OrderSummery>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg border-t border-green-600 mt-5">
            <span className="mt-5">Total</span>
            <span className="mt-5">${totalPrice}</span>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href={'/checkoutpage'}
              className="w-full mt-5 flex  bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
