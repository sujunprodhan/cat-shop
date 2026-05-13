'use client';

import Image from 'next/image';

const OrderSummery = ({ item }) => {
  console.log(item, 'product item check');
  const { title, image, price } = item;

  return (
    <div className="w-full lg:w-80 h-fit border border-green-200 rounded-xl p-5 shadow-sm bg-white sticky top-10">
      <div className="flex justify-between">
        <Image src={image} alt="product image" width={50} height={50} className="rounded-md" />
        <div className="flex flex-col justify-center items-end text-right">
          <h1 className="font-semibold">{title}</h1>
          <p className="text-green-600 font-bold">${price}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummery;
