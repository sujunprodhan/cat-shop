'use client';

import Image from 'next/image';

const OrderSummery = ({ item }) => {
  const { title, image, price } = item;

  return (
    <div className="w-full flex justify-between items-center py-2 border-b border-green-200">
      <div className="flex gap-3 items-center">
        <Image src={image} alt={title} width={40} height={40} className="rounded-md object-cover h-10 w-10" />
        <h1 className="font-medium text-sm text-slate-700">{title}</h1>
      </div>
      <p className="text-green-600 font-bold">${price}</p>
    </div>
  );
};

export default OrderSummery;
