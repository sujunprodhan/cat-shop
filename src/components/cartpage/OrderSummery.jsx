'use client';

import Image from 'next/image';

const OrderSummery = ({ item }) => {
  const { title, image, price } = item;

  return (
    <div className="w-full flex justify-between items-center py-4 border-b border-white/5 group">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 p-1 overflow-hidden shrink-0">
          <Image src={image} alt={title} width={48} height={48} className="rounded-lg object-contain h-full w-full group-hover:scale-110 transition-transform" />
        </div>
        <div className="space-y-1">
          <h1 className="font-bold text-sm text-white line-clamp-1">{title}</h1>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Premium Item</p>
        </div>
      </div>
      <p className="text-emerald-400 font-black text-lg">${price.toLocaleString()}</p>
    </div>
  );
};

export default OrderSummery;
