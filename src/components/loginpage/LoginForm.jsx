'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleLogin from '../layouts/buttons/GoogleLogin';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const params = useSearchParams();
  const router = useRouter();
  const callback = params.get('callback') || '';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false,
      callback: callback,
    });

    if (result.ok) {
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: 'Login successful. Redirecting...',
        confirmButtonColor: '#10b981',
      });
      router.push(callback);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: result?.error || 'Invalid email or password',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 p-4 md:p-10 overflow-hidden">

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
      >
        {/* LEFT SIDE: CONTENT & BRANDING */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-16 overflow-hidden border-r border-white/10">
          {/* Background Image for Left Side */}
          <div 
            className="absolute inset-0 opacity-40 bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000 scale-110 hover:scale-100"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000&auto=format&fit=crop')" }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/80"></div>

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3 mb-16">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="text-white" size={28} />
              </div>
              <span className="text-3xl font-black text-white tracking-tighter">CAT<span className="text-emerald-400">SHOP</span></span>
            </Link>

            <div className="space-y-8">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-6xl font-black text-white leading-[1.1] tracking-tight"
              >
                Welcome <br />
                <span className="text-emerald-400">Back to</span> <br />
                The Family.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-300 text-lg max-w-sm leading-relaxed"
              >
                Your feline friend is waiting. Log in to manage your orders, wishlist, and exclusive pet benefits.
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"
          >
            <p className="text-emerald-400 font-bold mb-2 tracking-widest uppercase text-xs">Top Rated Service</p>
            <p className="text-white text-xl font-medium italic">"The best shopping experience for my cat. Super fast delivery and premium quality!"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                <img src="https://i.pravatar.cc/40?img=1" alt="avatar" />
              </div>
              <p className="text-white font-bold text-sm">Sarah Jenkins</p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: LOGIN FORM */}
        <div className="lg:col-span-7 p-8 md:p-16 lg:p-20 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 lg:hidden">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="text-white" size={24} />
                </div>
                <span className="text-2xl font-black text-white">CAT<span className="text-emerald-400">SHOP</span></span>
              </Link>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Sign In</h2>
              <p className="text-slate-400 font-medium">Welcome back! Please enter your credentials.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Mail size={12} className="text-emerald-400" /> Email Address
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                  })}
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white placeholder:text-slate-700 font-medium"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1 uppercase tracking-tighter transition-all animate-bounce">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pr-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                    <Lock size={12} className="text-emerald-400" /> Password
                  </label>
                  <button type="button" className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password required',
                    })}
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white placeholder:text-slate-700 font-medium pr-14"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1 uppercase tracking-tighter transition-all animate-bounce">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-xl shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em]">
                <span className="bg-transparent px-4 text-slate-500">Social Access</span>
              </div>
            </div>

            <GoogleLogin />

            <p className="text-center text-slate-500 text-sm mt-10">
              New to the family?{' '}
              <Link href={`/register?callback=${callback}`} className="text-emerald-400 font-black hover:text-emerald-300 transition-colors">
                Join Free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

