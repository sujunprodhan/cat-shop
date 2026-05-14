'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import Image from 'next/image';
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
        className="lg:col-span-8 space-y-8"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Contact Information */}
          <section className="bg-white p-8 rounded-2rem border border-emerald-100 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <User size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Contact <span className="text-emerald-600">Information</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                  <User size={14} className="text-emerald-500" /> Full Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-6 py-4 outline-hidden transition-all duration-300 font-medium text-slate-700"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                  <Mail size={14} className="text-emerald-500" /> Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-6 py-4 outline-hidden transition-all duration-300 font-medium text-slate-700"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1 flex items-center gap-2">
                  <Phone size={14} className="text-emerald-500" /> Phone Number
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-6 py-4 outline-hidden transition-all duration-300 font-medium text-slate-700"
                  placeholder="+1 234 567 890"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <MapPin size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Shipping <span className="text-emerald-600">Address</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Street Address</label>
                <input
                  {...register('address', { required: 'Address is required' })}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-6 py-4 outline-hidden transition-all duration-300 font-medium text-slate-700"
                  placeholder="123 Luxury Avenue"
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">City</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-6 py-4 outline-hidden transition-all duration-300 font-medium text-slate-700"
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-500 ml-1">Postal Code</label>
                <input
                  {...register('zip', { required: 'Zip code is required' })}
                  className="w-full bg-slate-50 border border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 rounded-2xl px-6 py-4 outline-hidden transition-all duration-300 font-medium text-slate-700"
                  placeholder="10001"
                />
              </div>
            </div>
          </section>

          {/* Payment Method (Mock) */}
          <section className="bg-white p-8 rounded-[2rem] border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <CreditCard size={24} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                Payment <span className="text-emerald-600">Method</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-2 border-emerald-500 bg-emerald-50/30 p-6 rounded-2xl cursor-pointer flex items-center gap-4 group">
                <div className="w-4 h-4 rounded-full border-4 border-emerald-500 flex-shrink-0"></div>
                <div>
                  <p className="font-bold text-slate-800">Cash on Delivery</p>
                  <p className="text-xs text-slate-500">Pay when you receive</p>
                </div>
              </div>
              <div className="border-2 border-slate-100 p-6 rounded-2xl cursor-not-allowed opacity-50 flex items-center gap-4 group">
                <div className="w-4 h-4 rounded-full border-2 border-slate-300 flex-shrink-0"></div>
                <div>
                  <p className="font-bold text-slate-400">Card Payment</p>
                  <p className="text-xs text-slate-400">Coming soon</p>
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
        className="lg:col-span-4 sticky top-12"
      >
        <div className="bg-white border border-emerald-100 rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(16,185,129,0.08)] backdrop-blur-xl">
          <h2 className="text-2xl font-black text-slate-800 mb-8 tracking-tight flex items-center gap-3">
            Order Summary
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="h-1.5 w-1.5 bg-emerald-300 rounded-full"></span>
            </div>
          </h2>

          <div className="flex flex-col gap-4 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
            {cartItem.map((item, index) => (
              <OrderSummery key={index} item={item} />
            ))}
            {cartItem.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-400 font-medium">Your cart is empty</p>
              </div>
            )}
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-8 mt-2">
            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span>Subtotal</span>
              <span>${totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-600 font-medium">
              <span className="flex items-center gap-2">
                Shipping Fee <Truck size={14} className="text-emerald-500" />
              </span>
              <span>${shippingFee.toLocaleString()}</span>
            </div>

            <div className="h-px bg-linear-to-r from-transparent via-slate-100 to-transparent my-6"></div>

            <div className="flex justify-between items-center">
              <span className="text-slate-800 font-black text-lg">Total Payable</span>
              <span className="text-3xl font-black text-emerald-600 tracking-tighter">
                ${grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit(onSubmit)}
            disabled={cartItem.length === 0 || isSubmitting}
            className="mt-10 group relative overflow-hidden bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-5 rounded-[1.5rem] font-bold transition-all duration-300 flex items-center justify-center w-full shadow-2xl shadow-emerald-200 hover:shadow-emerald-300 active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center gap-3">
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Place Order
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          </button>

          <p className="text-center text-slate-400 text-xs mt-6 px-4">
            By placing your order, you agree to our{' '}
            <span className="text-emerald-600 underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="text-emerald-600 underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckOut;
