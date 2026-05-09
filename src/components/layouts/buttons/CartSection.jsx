'use client';

import CartPage from '@/components/cartpage/CartPage';
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
      <div className="col-span-10">
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
      <div className="col-span-2">
        <div className="sticky top-5 border border-gray-200 rounded-xl p-5 shadow-sm bg-white">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 text-gray-600">
            <div className="flex justify-between">
              {/* <span>Subtotal</span> */}
              <span>${cartItem.title}</span>
            </div>

            <div className="flex justify-between">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>

          <hr className="my-4" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>

          <button className="w-full mt-5 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
            Proceed to Checkout
          </button>

          <button className="w-full mt-3 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
