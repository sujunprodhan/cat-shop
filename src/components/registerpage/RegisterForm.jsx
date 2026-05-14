'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Sparkles, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { postUser } from '@/actions/server/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import GoogleLogin from '../layouts/buttons/GoogleLogin';
import { signIn } from 'next-auth/react';
import Swal from 'sweetalert2';

export default function RegisterForm() {
  const params = useSearchParams();
  const router = useRouter();
  const callbackUrl = params.get('callbackUrl') || '/';
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const result = await postUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });

      if (result.acknowledged) {
        // Auto-login after registration
        const loginResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
          callbackUrl: callbackUrl,
        });

        if (loginResult.ok) {
          await Swal.fire({
            icon: 'success',
            title: 'Registration Successful!',
            text: 'Welcome to the CatShop family.',
            confirmButtonColor: '#10b981',
          });
          router.push(callbackUrl);
        } else {
          router.push('/login');
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: result?.error || 'Something went wrong. Please try again.',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-950 p-4 md:p-10 overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full"></div>

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
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511044568932-338cba0ad803?q=80&w=2000&auto=format&fit=crop')" }}
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
                Join <br />
                <span className="text-emerald-400">The Ultimate</span> <br />
                Cat Community.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-slate-300 text-lg max-w-sm leading-relaxed"
              >
                Create an account to access exclusive deals, track your orders, and join a community of cat lovers.
              </motion.p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative z-10 p-8 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10"
          >
            <p className="text-emerald-400 font-bold mb-2 tracking-widest uppercase text-xs">Join 10k+ Members</p>
            <p className="text-white text-xl font-medium italic">"Best decision for my kittens. The rewards program is actually amazing!"</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden">
                <img src="https://i.pravatar.cc/40?img=5" alt="avatar" />
              </div>
              <p className="text-white font-bold text-sm">Michael Ross</p>
            </div>
          </motion.div>
        </div>

        {/* RIGHT SIDE: REGISTER FORM */}
        <div className="lg:col-span-7 p-8 md:p-16 lg:p-20 flex flex-col justify-center relative">
          {/* Vertical Side Pulses */}
          <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent animate-pulse hidden lg:block"></div>
          <div className="absolute right-0 top-1/4 bottom-1/4 w-[1px] bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent animate-pulse hidden lg:block"></div>

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
              <h2 className="text-4xl font-black text-white mb-3 tracking-tight">Create Account</h2>
              <p className="text-slate-400 font-medium">Start your journey with us today.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <User size={12} className="text-emerald-400" /> Full Name
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white placeholder:text-slate-700 font-medium"
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-rose-500 text-[10px] font-bold mt-1.5 ml-1 flex items-center gap-1 uppercase tracking-tighter transition-all animate-bounce">{errors.name.message}</p>}
              </div>

              {/* Email Field */}
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

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                  <Lock size={12} className="text-emerald-400" /> Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password required',
                      minLength: { value: 6, message: 'Minimum 6 characters' }
                    })}
                    className="w-full bg-white/5 border border-white/10 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 rounded-2xl px-6 py-4 outline-none transition-all duration-300 text-white placeholder:text-slate-700 font-medium pr-14"
                    placeholder="Create a strong password"
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
                    Create Account
                    <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.3em] items-center gap-4">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                    rotate: [0, 90, 180]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-emerald-500"
                >
                  <Sparkles size={10} />
                </motion.div>
                
                <span className="bg-transparent px-2 text-slate-500">Social Sign Up</span>
                
                <motion.div 
                  animate={{ 
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.8, 0.3],
                    rotate: [0, -90, -180]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="text-emerald-500"
                >
                  <Sparkles size={10} />
                </motion.div>
              </div>
            </div>

            <GoogleLogin />

            <p className="text-center text-slate-500 text-sm mt-10">
              Already have an account?{' '}
              <Link href="/login" className="text-emerald-400 font-black hover:text-emerald-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
