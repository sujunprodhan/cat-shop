'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950">
      {/* Decorative Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full animate-pulse"></div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Logo/Icon */}
        <div className="relative">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="w-24 h-24 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl shadow-emerald-500/20"
          >
            <Sparkles className="text-emerald-400" size={40} />
          </motion.div>

          {/* Pulsing Outer Rings */}
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-3xl border border-emerald-500/30"
          ></motion.div>
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            className="absolute inset-0 rounded-3xl border border-blue-500/20"
          ></motion.div>
        </div>

        {/* Text Animation */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-black text-white tracking-tighter">
              CAT<span className="text-emerald-400">SHOP</span>
            </span>
          </div>
          <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-full w-full bg-linear-to-r from-transparent via-emerald-500 to-transparent"
            ></motion.div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">
            Loading Excellence
          </p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
