'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCcw, Home, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Captured Global Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full"></div>

      <div className="relative z-10 max-w-xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 lg:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          {/* Top Icon */}
          <div className="w-20 h-20 bg-rose-500/20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-rose-500">
            <ShieldAlert size={40} className="animate-pulse" />
          </div>

          <h1 className="text-4xl font-black text-white tracking-tighter mb-4">
            Security <span className="text-rose-500">Alert</span>
          </h1>
          
          <p className="text-slate-400 font-medium mb-12 leading-relaxed">
            Direct access to this resource is restricted or an unexpected system failure occurred. Please use the official navigation to continue.
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => reset()}
              className="group flex items-center justify-center gap-3 bg-white text-slate-950 px-8 py-5 rounded-2xl font-black text-xs tracking-[0.2em] transition-all hover:bg-slate-200 active:scale-95"
            >
              <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
              TRY REFRESHING
            </button>
            
            <Link
              href="/"
              className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-5 rounded-2xl font-black text-xs tracking-[0.2em] border border-white/10 transition-all active:scale-95"
            >
              <Home size={18} />
              RETURN TO HOME
            </Link>
          </div>

          {/* Hidden Error Details (for debugging) */}
          <p className="mt-12 text-[10px] text-slate-600 font-bold uppercase tracking-widest opacity-50">
            Reference Code: SEC_RESTRICT_001
          </p>
        </motion.div>
      </div>
    </div>
  );
}
