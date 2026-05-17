'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const GoogleLogin = () => {
  const params = useSearchParams();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn('google', {
      callbackUrl: params.get('callback') || '/',
    });
    setLoading(false);
  };

  return (
    <motion.button
      type="button"
      onClick={handleSignIn}
      disabled={loading}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
      className="relative w-full group overflow-hidden"
    >
      {/* Outer glow on hover */}
      <span className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-500/10 via-white/5 to-red-500/10 blur-sm" />

      {/* Button body */}
      <span className="relative flex items-center justify-center gap-4 w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl px-6 py-4 transition-all duration-300">

        {/* Google logo */}
        <span className="flex-shrink-0 w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md shadow-black/20 group-hover:scale-110 transition-transform duration-300">
          {loading ? (
            <span className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin" />
          ) : (
            <Image
              width={20}
              height={20}
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-5 h-5"
            />
          )}
        </span>

        {/* Text */}
        <span className="flex flex-col text-left">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 leading-none mb-0.5">
            Sign in with
          </span>
          <span className="text-white font-black text-sm tracking-tight leading-none">
            {loading ? 'Redirecting...' : 'Google Account'}
          </span>
        </span>

        {/* Right arrow shimmer effect */}
        <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-400">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
    </motion.button>
  );
};

export default GoogleLogin;
