'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
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
        title: 'Login Successful',
        text: 'Welcome back!',
        confirmButtonColor: '#22c55e',
      });
      router.push(callback);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed please Register or Google Login',
        text: result?.error || 'Invalid credentials',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d')",
      }}
    >
      {/* Animated Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md sm:max-w-lg md:max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 sm:p-8">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-center text-white mb-6"
          >
            Welcome Back
          </motion.h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email',
                  },
                })}
                className="w-full mt-1 p-3 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-white/70 transition"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-300 text-sm">{errors.email.message}</p>}
            </motion.div>

            {/* Password */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-medium">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                {...register('password', {
                  required: 'Password required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
                className="w-full mt-1 p-3 bg-white/20 border border-white/30 rounded-lg pr-10 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-white/70 transition"
                placeholder="Enter your password"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-white/80 hover:scale-110 transition"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </span>
              {errors.password && <p className="text-red-300 text-sm">{errors.password.message}</p>}
            </motion.div>

            {/* Remember + Forgot */}
            <motion.div
              className="flex items-center justify-between text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register('remember')} />
                Remember me
              </label>
              <button
                type="button"
                className="text-green-300 hover:underline"
                onClick={() => alert('Redirect to reset password')}
              >
                Forgot password?
              </button>
            </motion.div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-400 transition"
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </motion.button>

            {/* Register link */}
            <motion.div
              className="flex justify-center items-center gap-1 mt-4 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span>Don&apos;t have an account?</span>
              <Link
                href={`/register?callback=${callback}`}
                className="text-green-300 hover:underline"
              >
                <p className="text-green-500 font-semibold">Register</p>
              </Link>
            </motion.div>
          </form>
          <GoogleLogin></GoogleLogin>
        </div>
      </motion.div>
    </div>
  );
}
