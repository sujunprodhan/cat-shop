'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px] animate-pulse delay-700"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12">
        {/* Error Code/Icon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative inline-block"
        >
          <div className="text-[12rem] font-black text-white/5 leading-none select-none tracking-tighter">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Ghost size={120} className="text-blue-500 animate-bounce" />
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight">
            Lost in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Digital Void?</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-md mx-auto leading-relaxed">
            The page you're looking for has vanished into thin air. It may have been moved, deleted, or never existed in the first place.
          </p>
        </motion.div>

        {/* Search Suggestion (Optional but nice) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative max-w-md mx-auto group"
        >
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 flex items-center">
            <Search className="ml-4 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search for cat magic..." 
              className="bg-transparent border-none focus:ring-0 text-white w-full px-4 py-3 placeholder-slate-600"
            />
          </div>
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            href="/"
            className="group flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest transition-all shadow-2xl shadow-blue-600/30 active:scale-95"
          >
            <Home size={18} />
            BACK TO HOME
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-sm tracking-widest border border-white/10 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            GO BACK
          </button>
        </motion.div>

        {/* Decorative Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500"
        >
          Even curiosity has its limits.
        </motion.p>
      </div>
    </div>
  );
}
