'use client';

import CartPage from '@/components/cartpage/CartPage';
import OrderSummery from '@/components/cartpage/OrderSummery';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useTheme } from '@/provider/ThemeProvider';

const CartSection = ({ cartItem = [] }) => {
  const [items, setItems] = useState(cartItem);
  const { theme } = useTheme();
  const isDark = theme === 'night';

  /* Theme Tokens */
  const sectionBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200';
  const headingText = isDark ? 'text-white' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-500' : 'text-slate-400';
  const dividerLine = isDark ? 'bg-white/10' : 'bg-slate-200';
  const emptyBox = isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start w-full container mx-auto py-16 px-6">
      {/* LEFT SIDE - CART ITEMS */}
      <div className="lg:col-span-8 space-y-10">
        {/* Top Summary Header */}
        <div className={`flex flex-col md:flex-row justify-between items-center gap-6 backdrop-blur-3xl p-8 rounded-[2.5rem] border shadow-2xl ${sectionBg}`}>
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <h2 className={`font-black text-2xl tracking-tight ${headingText}`}>Shopping Cart</h2>
              <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${mutedText}`}>
                You have <span className="text-emerald-500">{items.length} items</span> in your selection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-10">
            <div className="text-center">
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${mutedText}`}>Total Qty</p>
              <p className={`text-2xl font-black ${headingText}`}>{totalItems}</p>
            </div>
            <div className={`h-10 w-px hidden md:block ${dividerLine}`}></div>
            <div className="text-center md:text-right">
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${mutedText}`}>Subtotal</p>
              <p className="text-3xl font-black text-emerald-500 tracking-tighter">
                ${totalPrice.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* CART ITEMS LIST */}
        <div className="space-y-6">
          {items.length > 0 ? (
            items.map((item) => (
              <CartPage
                key={item._id.toString()}
                item={item}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
              />
            ))
          ) : (
            <div className={`text-center py-20 rounded-[3rem] border border-dashed ${emptyBox}`}>
              <p className={`${mutedText} font-medium text-xl`}>Your cart is feeling light. Start adding some cat magic!</p>
              <Link href="/products" className="inline-block mt-6 text-emerald-500 font-black uppercase tracking-widest text-sm hover:text-emerald-400 transition-colors">
                Explore Collection →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - ORDER SUMMARY */}
      <div className="lg:col-span-4 sticky top-28">
        <div className={`backdrop-blur-3xl border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group ${sectionBg}`}>
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

          <div className="relative z-10">
            <h2 className={`text-2xl font-black mb-10 tracking-tight flex items-center gap-3 ${headingText}`}>
              Order Summary
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
            </h2>

            <div className="space-y-2 mb-10 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
              {items?.map((item, index) => (
                <OrderSummery key={index} item={item} />
              ))}
            </div>

            <div className={`space-y-6 border-t pt-8 mt-2 ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
              <div className="flex justify-between items-center text-sm">
                <span className={`font-bold uppercase tracking-widest ${mutedText}`}>Subtotal</span>
                <span className={`font-bold ${headingText}`}>${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className={`font-bold uppercase tracking-widest ${mutedText}`}>Shipping</span>
                <span className="text-emerald-500 font-black uppercase tracking-widest">Calculated at Checkout</span>
              </div>
              
              <div className={`flex justify-between items-end pt-4 border-t ${isDark ? 'border-white/5' : 'border-slate-200'}`}>
                <div className="space-y-1">
                  <span className={`font-black text-[10px] uppercase tracking-[0.2em] ${mutedText}`}>Total Amount</span>
                  <p className={`font-black text-lg ${headingText}`}>Order Total</p>
                </div>
                <span className="text-4xl font-black text-emerald-500 tracking-tighter">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            <Link
              href="/checkoutpage"
              className="mt-12 group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center w-full shadow-2xl shadow-emerald-950/40 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
                Secure Checkout
                <svg
                  className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSection;
