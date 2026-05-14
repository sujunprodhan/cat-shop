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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full container mx-auto py-10 px-4">
      {/* LEFT SIDE - CART ITEMS */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Top Summary Boxes */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-2rem border border-emerald-100/50 shadow-sm">
          <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-emerald-50 shadow-sm">
            <span className="text-emerald-600 bg-emerald-50 p-2 rounded-xl">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </span>
            <p className="text-sm font-medium text-slate-600">
              Items Found:{' '}
              <span className="text-emerald-600 font-black ml-1">({items.length})</span>
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-green-600">
                Total Qty:
              </p>
              <span className="text-lg font-black text-gray-700">{totalItems}</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2">
              <p className="text-xs font-black uppercase tracking-widest text-green-600">
                Total Price:
              </p>
              <span className="text-2xl font-black text-gray-700">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* CART ITEMS LIST */}
        <div className="flex flex-col gap-5">
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
      <div className="lg:col-span-4 sticky top-24">
        <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.05)] backdrop-blur-xl">
          <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight flex items-center gap-3">
            Order Summary
            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
          </h2>

          <div className="flex flex-col gap-4 mb-8 max-h-400px overflow-y-auto pr-2 custom-scrollbar">
            {items?.map((item, index) => (
              <OrderSummery key={index} item={item} />
            ))}
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-8 mt-2">
            
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-800 font-black text-lg">Total Payable</span>
              <span className="text-3xl font-black text-emerald-600 tracking-tighter">
                ${totalPrice.toLocaleString()}
              </span>
            </div>
          </div>

          <Link
            href="/checkoutpage"
            className="mt-10 group relative overflow-hidden bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-[1.5rem] font-bold transition-all duration-300 flex items-center justify-center w-full shadow-2xl shadow-emerald-200 hover:shadow-emerald-300 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Proceed to Checkout
              <svg
                className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default CartSection;
