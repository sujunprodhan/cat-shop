'use client';
import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { decreaseItemDb, deleteItemCart, increaseItemDb } from '@/actions/server/cart';
import Swal from 'sweetalert2';
import { useCart } from '@/provider/CartProvider';
import { useTheme } from '@/provider/ThemeProvider';

const CartPage = ({ item, removeItem, updateQuantity,  }) => {
  const { updateCartCount } = useCart();
  const { title = 'Premium Product', quantity, image, price = 0, _id } = item || {};
  const { theme } = useTheme();
  const isDark = theme === 'night';

  /* Theme Tokens */
  const cardBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200';
  const headingText = isDark ? 'text-white' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-400' : 'text-slate-500';
  const imgBg = isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200';
  const ctrlBg = isDark ? 'bg-slate-950/50 border-white/10' : 'bg-slate-50 border-slate-200';
  const btnBg = isDark ? 'bg-white/5 text-slate-400' : 'bg-white text-slate-500 shadow-sm border border-slate-200';

  // Increase quantity
  const increaseQty = async () => {
    const result = await increaseItemDb(_id, quantity + 1);
    
    if (result.success) {
      updateCartCount();
      updateQuantity(_id, quantity + 1);
    }
  };

  // Decrease quantity
const decreaseQty = async () => {
  if (quantity <= 1) return;

  const result = await decreaseItemDb(_id, quantity);

  if (result.success) {
    updateCartCount();
    updateQuantity(_id, quantity - 1);
  }
};


  const handleRemove = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to remove this item from your cart?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#334155',
      confirmButtonText: 'Yes, remove it!',
      background: isDark ? '#0f172a' : '#ffffff',
      color: isDark ? '#fff' : '#0f172a',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = (await deleteItemCart(_id)) || {};

        if (res.success) {
          updateCartCount();
          removeItem(_id);
          Swal.fire({
            title: 'Deleted!',
            text: 'Item has been removed from your cart.',
            icon: 'success',
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#fff' : '#0f172a',
            confirmButtonColor: '#10b981'
          });
        } else {
          Swal.fire({
            title: 'Oops!',
            text: 'Something went wrong while removing the item.',
            icon: 'error',
            background: isDark ? '#0f172a' : '#ffffff',
            color: isDark ? '#fff' : '#0f172a',
            confirmButtonColor: '#10b981'
          });
        }
      }
    });
  };

  return (
    <div className="w-full">
      <div className={`group flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl backdrop-blur-3xl border shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:border-emerald-500/30 ${cardBg}`}>
        {/* Image Section */}
        <div className={`relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border p-2 ${imgBg}`}>
          <Image
            src={image}
            alt={title}
            width={100}
            height={100}
            className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        {/* Title Section */}
        <div className="flex-1 text-center md:text-left space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Premium Choice</p>
          <h3 className={`font-black text-xl leading-tight line-clamp-1 ${headingText}`}>{title}</h3>
          <p className={`font-bold text-sm ${mutedText}`}>Unit Price: <span className={headingText}>${price}</span></p>
        </div>

        {/* Quantity Controller */}
        <div className={`flex items-center gap-4 px-4 py-2 rounded-2xl border shadow-inner ${ctrlBg}`}>
          <button
            onClick={decreaseQty}
            disabled={quantity <= 1}
            className={`w-10 h-10 flex items-center justify-center rounded-xl hover:bg-emerald-500 hover:text-white disabled:opacity-30 transition-all active:scale-90 ${btnBg}`}
          >
            <Minus size={18} />
          </button>

          <span className={`w-8 text-center font-black text-xl ${headingText}`}>{quantity}</span>

          <button
            onClick={increaseQty}
            className={`w-10 h-10 flex items-center justify-center rounded-xl hover:bg-emerald-500 hover:text-white transition-all active:scale-90 ${btnBg}`}
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Total Price Section */}
        <div className="text-center md:text-right min-w-[120px] space-y-1">
          <p className={`text-[10px] font-black uppercase tracking-widest ${mutedText}`}>Item Total</p>
          <p className="text-2xl font-black text-emerald-500">
            <span className="text-lg mr-0.5">$</span>
            {(price * quantity).toLocaleString()}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="p-4 rounded-2xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 shadow-lg shadow-rose-950/20 active:scale-95"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartPage;
