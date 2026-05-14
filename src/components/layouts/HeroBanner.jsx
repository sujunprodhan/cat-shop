'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

const HeroBanner = () => {
  return (
    <div className="relative min-h-[95vh] flex items-center overflow-hidden bg-slate-950">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000')",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30"></div>
      </div>

      {/* Floating Background Blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-24">
        {/* Left Side - Content */}
        <div className="space-y-10 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full"
          >
            <Sparkles size={14} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Premium Pet Experience</span>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-6xl lg:text-8xl font-black leading-[1] tracking-tighter"
            >
              Pure Comfort <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
                For Your Cat.
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-400 max-w-lg leading-relaxed font-medium"
            >
              Discover an exclusive collection of high-end essentials designed to provide ultimate luxury and care for your feline family.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap gap-5"
          >
            <Link href="/products" className="group relative px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all duration-300 flex items-center gap-3 text-lg shadow-2xl shadow-emerald-950/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              Shop Collection
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link href="/about" className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all duration-300 text-lg backdrop-blur-md">
              Our Mission
            </Link>
          </motion.div>

          {/* Trust signals */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 pt-10"
          >
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <Zap size={16} className="text-emerald-500" />
              </div>
              <span>Express Delivery</span>
            </div>
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                <ShieldCheck size={16} className="text-emerald-500" />
              </div>
              <span>Quality Assured</span>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Floating Product Showcase */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative flex justify-center lg:justify-end"
        >
          <div className="relative group">
            {/* Main Product Container */}
            <div className="relative z-10 w-full max-w-[500px] aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
              <img
                src="https://images.unsplash.com/photo-1548247416-ec66f4900b2e?q=80&w=1000"
                alt="Premium Product"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
            </div>

            {/* Decorative Floating Card 1 */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 z-20 bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white font-black text-xl">
                  ★
                </div>
                <div>
                  <p className="text-white font-black text-lg">4.9/5</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Reviews</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative Floating Card 2 */}
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-6 -left-12 z-20 bg-slate-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl"
            >
              <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-2">New Arrival</p>
              <p className="text-white font-bold text-xl leading-tight">Premium Silk <br />Cat Bed</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroBanner;
