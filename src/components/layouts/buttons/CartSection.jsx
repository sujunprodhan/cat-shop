'use client';

import CartPage from '@/components/cartpage/CartPage';
import { useMemo, useState } from 'react';

const CartSection = ({ cartItem = [] }) => {
  const [items, setItems] = useState(cartItem);
  const totalItems = useMemo(() => items.reduce((acm, item) => acm + item.quantity, 0), [items]);
const removeItem =(id)=>{
setItems(prevItems=>prevItems.filter((item)=>item._id !=id))
}

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-xl font-semibold text-gray-500">
            <span className="text-green-600">({items.length})</span> Items Found in the cart
          </p>
        </div>
        <div className="flex justify-center items-center gap-3 border border-green-200 rounded-md px-4 py-2">
          <p className="text-green-500 font-bold">Total Added:</p>
          <span className="font-bold">{totalItems}</span>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        {items?.map((item) => (
          <CartPage key={item._id.toString()} item={item}
          removeItem={removeItem}
          ></CartPage>
        ))}
      </div>
    </div>
  );
};

export default CartSection;
