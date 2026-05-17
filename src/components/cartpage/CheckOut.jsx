'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CreditCard, Truck, User, MapPin, ArrowRight } from 'lucide-react';
import { createOrder } from '@/actions/server/order';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import OrderSummery from './OrderSummery';
import { useCart } from '@/provider/CartProvider';
import StripeWrapper from './StripeWrapper';
import { useState } from 'react';
import { useTheme } from '@/provider/ThemeProvider';

const CheckOut = ({ cartItem = [], session }) => {
  const router = useRouter();
  const { updateCartCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [readyForPayment, setReadyForPayment] = useState(false);
  const [formData, setFormData] = useState(null);

  const { theme } = useTheme();
  const isDark = theme === 'night';

  /* Theme Tokens */
  const sectionBg = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200';
  const headingText = isDark ? 'text-white' : 'text-slate-900';
  const mutedText = isDark ? 'text-slate-500' : 'text-slate-400';
  const inputBg = isDark
    ? 'bg-white/5 border-white/10 text-white'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white';
  const cardBgUnselected = isDark ? 'border-white/5 bg-white/5' : 'border-slate-200 bg-slate-50';
  const dividerLine = isDark ? 'border-white/5' : 'border-slate-200';

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
    if (paymentMethod === 'card') {
      setFormData(data);
      setReadyForPayment(true);
      return;
    }
    await processOrder(data, 'Cash on Delivery', null);
  };

  const processOrder = async (data, method, transactionId) => {
    try {
      const orderData = {
        ...data,
        items: cartItem,
        total: grandTotal,
        paymentMethod: method,
        transactionId: transactionId,
      };

      const result = await createOrder(orderData);

      if (result.success) {
        updateCartCount();
        Swal.fire({
          title: 'Success!',
          text: 'Your order has been placed successfully.',
          icon: 'success',
          background: '#0f172a',
          color: '#fff',
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
          background: '#0f172a',
          color: '#fff',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to place order. Please try again.',
        icon: 'error',
        background: '#0f172a',
        color: '#fff',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div>
      <div className="mb-12">
        <h1
          className={`text-5xl lg:text-7xl font-black tracking-tighter leading-tight ${headingText}`}
        >
          Checkout{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">
            Process
          </span>
        </h1>
        <p className={`font-bold uppercase tracking-[0.3em] text-xs mt-4 ml-1 ${mutedText}`}>
          Complete your premium selection
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Checkout Form Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-8 space-y-10"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Contact Information */}
            <section
              className={`backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] border shadow-2xl relative overflow-hidden group ${sectionBg}`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-lg">
                  <User size={24} />
                </div>
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${headingText}`}>
                    Contact <span className="text-emerald-500">Information</span>
                  </h2>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest mt-1 ${mutedText}`}
                  >
                    Direct communication details
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${mutedText}`}
                  >
                    Full Name
                  </label>
                  <input
                    readOnly
                    {...register('name', { required: 'Name is required' })}
                    className={`w-full border focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 ${inputBg}`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${mutedText}`}
                  >
                    Email Address
                  </label>
                  <input
                    readOnly
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                    })}
                    className={`w-full border focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 ${inputBg}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${mutedText}`}
                  >
                    Phone Number
                  </label>
                  <input
                    {...register('phone', { required: 'Phone is required' })}
                    className={`w-full border focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 ${inputBg}`}
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
            <section
              className={`backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] border shadow-2xl relative group ${sectionBg}`}
            >
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 shadow-lg">
                  <MapPin size={24} />
                </div>
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${headingText}`}>
                    Shipping <span className="text-blue-500">Address</span>
                  </h2>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest mt-1 ${mutedText}`}
                  >
                    Where should we send your cat magic?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${mutedText}`}
                  >
                    Street Address
                  </label>
                  <input
                    {...register('address', { required: 'Address is required' })}
                    className={`w-full border focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 ${inputBg}`}
                    placeholder="123 Luxury Avenue"
                  />
                  {errors.address && (
                    <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${mutedText}`}
                  >
                    City
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    className={`w-full border focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 ${inputBg}`}
                    placeholder="New York"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`text-[10px] font-black uppercase tracking-widest ml-1 ${mutedText}`}
                  >
                    Postal Code
                  </label>
                  <input
                    {...register('zip', { required: 'Zip code is required' })}
                    className={`w-full border focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 ${inputBg}`}
                    placeholder="10001"
                  />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section
              className={`backdrop-blur-3xl p-8 lg:p-12 rounded-[3rem] border shadow-2xl relative group ${sectionBg}`}
            >
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-lg">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${headingText}`}>
                    Payment <span className="text-amber-500">Method</span>
                  </h2>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest mt-1 ${mutedText}`}
                  >
                    Select your preferred secure option
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`border-2 p-8 rounded-[2rem] cursor-pointer flex items-center gap-5 transition-all ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-950/20' : `${cardBgUnselected} hover:border-emerald-500/50`}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-colors ${paymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-500/20' : 'border-slate-300 dark:border-slate-600'}`}
                  >
                    {paymentMethod === 'cod' && (
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    )}
                  </div>
                  <div>
                    <p className={`font-black text-lg ${headingText}`}>Cash on Delivery</p>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'cod' ? 'text-emerald-500' : mutedText}`}
                    >
                      Pay at your doorstep
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`border-2 p-8 rounded-[2rem] cursor-pointer flex items-center gap-5 transition-all ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-950/20' : `${cardBgUnselected} hover:border-blue-500/50`}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full border-4 flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-500/20' : 'border-slate-300 dark:border-slate-600'}`}
                  >
                    {paymentMethod === 'card' && (
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    )}
                  </div>
                  <div>
                    <p className={`font-black text-lg ${headingText}`}>Card Payment</p>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${paymentMethod === 'card' ? 'text-blue-500' : mutedText}`}
                    >
                      Pay securely with Stripe
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
          <div
            className={`backdrop-blur-3xl border rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group ${sectionBg}`}
          >
            {/* Decorative Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

            <div className="relative z-10">
              <h2
                className={`text-2xl font-black mb-10 tracking-tight flex items-center gap-3 ${headingText}`}
              >
                Final Review
                <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></span>
              </h2>

              <div className="space-y-2 mb-10 max-h-[35vh] overflow-y-auto pr-4 custom-scrollbar">
                {cartItem.map((item, index) => (
                  <OrderSummery key={index} item={item} />
                ))}
                {cartItem.length === 0 && (
                  <div
                    className={`text-center py-12 rounded-3xl border border-dashed ${cardBgUnselected}`}
                  >
                    <p className={`font-bold uppercase tracking-widest text-xs ${mutedText}`}>
                      Selection is empty
                    </p>
                  </div>
                )}
              </div>

              <div className={`space-y-6 border-t pt-8 mt-2 ${dividerLine}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-black text-[10px] uppercase tracking-widest ${mutedText}`}>
                    Subtotal
                  </span>
                  <span className={`font-bold ${headingText}`}>${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    className={`font-black text-[10px] uppercase tracking-widest flex items-center gap-2 ${mutedText}`}
                  >
                    Shipping <Truck size={14} className="text-emerald-500" />
                  </span>
                  <span className={`font-bold ${headingText}`}>
                    ${shippingFee.toLocaleString()}
                  </span>
                </div>

                <div className={`flex justify-between items-end pt-6 border-t ${dividerLine}`}>
                  <div className="space-y-1 mb-5">
                    <span className="text-emerald-500 font-black text-[10px] uppercase tracking-[0.2em]">
                      Grand Total
                    </span>
                    <p className={`font-black text-lg leading-none ${headingText}`}>
                      Total Payable
                    </p>
                  </div>
                  <span className="text-4xl font-black text-emerald-500 tracking-tighter mb-5">
                    ${grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {!readyForPayment ? (
                <button
                  onClick={handleSubmit(onSubmit)}
                  disabled={cartItem.length === 0 || isSubmitting}
                  className={`mt-12 group relative overflow-hidden disabled:bg-slate-800 disabled:cursor-not-allowed text-white py-6 rounded-2xl font-black text-lg transition-all duration-300 flex items-center justify-center w-full shadow-2xl active:scale-[0.98] ${paymentMethod === 'card' ? 'bg-blue-600 hover:bg-blue-500 shadow-blue-950/40' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === 'card' ? 'Continue to Payment' : 'Place Order Now'}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                      </>
                    )}
                  </span>
                </button>
              ) : (
                <StripeWrapper
                  amount={grandTotal}
                  onPaymentSuccess={(transactionId) =>
                    processOrder(formData, 'Card Payment', transactionId)
                  }
                  onCancel={() => setReadyForPayment(false)}
                />
              )}

              <p
                className={`text-center text-[10px] font-bold uppercase tracking-widest mt-8 px-4 leading-relaxed ${mutedText}`}
              >
                Secure processing by <span className="text-emerald-500">CATSHOP PREMIUM</span>.{' '}
                <br />
                All transactions are encrypted.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckOut;
