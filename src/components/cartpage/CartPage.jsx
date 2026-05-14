'use client';
import React, { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { decreaseItemDb, deleteItemCart, increaseItemDb } from '@/actions/server/cart';
import Swal from 'sweetalert2';

const CartPage = ({ item, removeItem, updateQuantity,  }) => {
  const { title = 'Premium Product', quantity, image, price = 0, _id } = item || {};

  // Increase quantity
  const increaseQty = async () => {
    const result = await increaseItemDb(_id, quantity + 1);
    console.log(result);
    
    if (result.success) {
      Swal.fire('success', 'quantity added', 'success');
      updateQuantity(_id, quantity + 1);
    }
  };

  // Decrease quantity
const decreaseQty = async () => {
  if (quantity <= 1) return;

  const result = await decreaseItemDb(_id, quantity);

  if (result.success) {
    Swal.fire('success', 'quantity decreased', 'success');
    updateQuantity(_id, quantity - 1);
  }
};


  const handleRemove = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to remove this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const result = (await deleteItemCart(_id)) || {};

        if (result.success) {
          removeItem(_id);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your file has been deleted.',
            icon: 'success',
          });
        } else {
          Swal.fire({
            title: 'Opps!',
            text: 'Something is worng',
            icon: 'success',
          });
        }
      }
    });
  };

  return (
    <div className="w-full">
      <div className="group flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:border-emerald-500/30">
        {/* Image Section */}
        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-2">
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
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Premium Choice</p>
          <h3 className="font-black text-white text-xl leading-tight line-clamp-1">{title}</h3>
          <p className="text-slate-400 font-bold text-sm">Unit Price: <span className="text-white">${price}</span></p>
        </div>

        {/* Quantity Controller */}
        <div className="flex items-center gap-4 bg-slate-950/50 px-4 py-2 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={decreaseQty}
            disabled={quantity <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-emerald-500 hover:text-white disabled:opacity-30 transition-all active:scale-90"
          >
            <Minus size={18} />
          </button>

          <span className="w-8 text-center font-black text-xl text-white">{quantity}</span>

          <button
            onClick={increaseQty}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
          >
            <Plus size={18} />
          </button>
        </div>

        {/* Total Price Section */}
        <div className="text-center md:text-right min-w-[120px] space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Item Total</p>
          <p className="text-2xl font-black text-emerald-400">
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
