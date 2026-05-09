'use client'

const OrderSummery = ({ totalItems, totalPrice }) => {
  return (
    <div className="w-full lg:w-80 h-fit border border-green-200 rounded-xl p-5 shadow-sm bg-white sticky top-10">
      <h2 className="text-xl font-bold mb-5 text-gray-700">Order Summary</h2>

      <div className="flex justify-between mb-3">
        <span>Total Items</span>
        <span className="font-bold text-green-600">{totalItems}</span>
      </div>

      <div className="flex justify-between mb-5">
        <span>Total Price</span>
        <span className="font-bold text-green-600">${Number(totalPrice).toFixed(2)}</span>
      </div>

      <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
        Checkout
      </button>
    </div>
  );
};

export default OrderSummery;
