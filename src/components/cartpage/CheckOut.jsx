'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CreditCard, Truck, User, MapPin, ArrowRight } from 'lucide-react';
import { createOrder } from '@/actions/server/order';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import OrderSummery from './OrderSummery';

const CheckOut = ({ cartItem = [], session }) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
    },
  });

  const totalPrice = cartItem.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = 10;
  const grandTotal = totalPrice + shippingFee;

  const onSubmit = async (data) => {
    try {
      const orderData = {
        ...data,
        items: cartItem,
        total: grandTotal,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Your order has been placed successfully.',
          icon: 'success',
          confirmButtonColor: '#10b981',
        }).then(() => {
          router.push('/');
          router.refresh();
        });
      } else {
        Swal.fire({
          title: 'Error!',
          text: result.message || 'Something went wrong.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to place order. Please try again.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
      {/* Checkout Form Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-8 space-y-10"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
          {/* Contact Information */}
          <section className="bg-white/5 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Contact <span className="text-emerald-400">Information</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                  Direct communication details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Phone Number
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white"
                  placeholder="+1 234 567 890"
                />
                {errors.phone && (
                  <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-white/5 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative group">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-lg">
                <MapPin size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Shipping <span className="text-blue-400">Address</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                  Where should we send your cat magic?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Street Address
                </label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white"
                  placeholder="123 Luxury Avenue"
                />
                {errors.address && (
                  <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  City
                </label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white"
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Postal Code
                </label>
                <input
                  {...register('zip', { required: 'Zip code is required' })}
                  className="w-full bg-white/5 border border-white/10 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white"
                  placeholder="10001"
                />
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-white/5 backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative group">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20 shadow-lg">
                <CreditCard size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Payment <span className="text-amber-400">Method</span>
                </h2>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
                  Select your preferred secure option
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border-2 border-emerald-500 bg-emerald-500/10 p-8 rounded-[2rem] cursor-pointer flex items-center gap-5 shadow-lg shadow-emerald-950/20 group/opt">
                <div className="w-6 h-6 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                </div>
                <div>
                  <p className="font-black text-white text-lg">Cash on Delivery</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                    Pay at your doorstep
                  </p>
                </div>
              </div>
              <div className="border-2 border-white/5 bg-white/5 p-8 rounded-[2rem] cursor-not-allowed opacity-50 flex items-center gap-5">
                <div className="w-6 h-6 rounded-full border-2 border-slate-600"></div>
                <div>
                  <p className="font-black text-slate-400 text-lg">Card Payment</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Coming soon
                  </p>
                </div>
              </div>
            </div>
          </section>
        </form>
      </motion.div>

      {/* Order Summary Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-4 sticky top-28"
      >
        <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white mb-10 tracking-tight flex items-center gap-3">
              Final Review
              <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
            </h2>

            <div className="space-y-2 mb-10 max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
              {cartItem.map((item, index) => (
                <OrderSummery key={index} item={item} />
              ))}
              {cartItem.length === 0 && (
                <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5 border-dashed">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                    Selection is empty
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6 border-t border-white/5 pt-8 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest">
                  Subtotal
                </span>
                <span className="text-white font-bold">${totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                  Shipping <Truck size={14} className="text-emerald-500" />
                </span>
                <span className="text-white font-bold">${shippingFee.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-end pt-6 border-t border-white/5">
                <div className="space-y-1">
                  <span className="text-emerald-400 font-black text-[10px] uppercase tracking-[0.2em]">
                    Grand Total
                  </span>
                  <p className="text-white font-black text-lg leading-none">Total Payable</p>
                </div>
                <span className="text-4xl font-black text-emerald-400 tracking-tighter">
                  ${grandTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              disabled={cartItem.length === 0 || isSubmitting}
              className="mt-12 group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white py-6 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center w-full shadow-2xl shadow-emerald-950/40 active:scale-[0.98]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing Order...
                  </>
                ) : (
                  <>
                    Place Order Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </>
                )}
              </span>
            </button>

            <p className="text-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-8 px-4 leading-relaxed">
              Secure processing by <span className="text-emerald-500">CATSHOP PREMIUM</span>. <br />
              All transactions are encrypted.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckOut;
