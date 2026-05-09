'use client';
import React, { useState } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { deleteItemCart } from '@/actions/server/cart';
import Swal from 'sweetalert2';

const CartPage = ({ item, removeItem }) => {
  // Destructuring with fallbacks
  const { title = 'Premium Product', image, price = 0, _id } = item || {};
  const [quantity, setQuantity] = useState(item?.quantity || 1);
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
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
    <div>
      {/* Ultra Modern Single Line Item */}
      <div className="group flex flex-row items-center gap-10 justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-400 hover:shadow-md hover:border-emerald-100 transition-all duration-300 ">
        {/* Image Section with soft glow */}
        <div className="relative h-20 w-20 flex-shrink:0 overflow-hidden rounded-xl bg-slate-50">
          <Image
            src={image}
            alt="product image"
            width={50}
            height={50}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Title Section */}
        <div className="flex-1 min-w-150px">
          <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-1">
            Product
          </h3>
          <p className="font-semibold text-slate-800 text-lg leading-tight truncate">{title}</p>
        </div>

        {/* Quantity Controller - Professional Green Style */}
        <div className="flex items-center gap-5  rounded-full px-3  border-green-100 border shadow-md">
          <button
            onClick={decreaseQty}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white text-gray-600"
          >
            <Minus size={16} strokeWidth={1} className="text-gray-600" />
          </button>

          <span className="w-10 text-center font-bold text-lg text-green-600">{quantity}</span>

          <button
            onClick={increaseQty}
            className="w-10 h-10 flex items-center gap-3 justify-center rounded-full bg-white text-gray-600  transition-all"
          >
            <Plus size={16} strokeWidth={3} />
          </button>
        </div>

        {/* Price Section */}
        <div className="text-right min-w-100px">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-green-600 mb-1">
            Total
          </h3>
          <p className="text-xl font-black text-gray-600">
            <span className="text-green-600 text-lg">$</span>
            {(price * quantity).toLocaleString()}
          </p>
        </div>

        {/* Modern Remove Action */}
        <button
          onClick={handleRemove}
          className="p-3 rounded-xl text-red-600 hover:scale-105 transition-all duration-200"
        >
          <Trash2 size={22} strokeWidth={2} />
        </button>
      </div>

      {/* Decorative summary line for Ultra look */}
      <div className="mt-6 flex justify-end">
        <div className="h-1 w-24 bg-emerald-100 rounded-full"></div>
      </div>
    </div>
  );
};

export default CartPage;
