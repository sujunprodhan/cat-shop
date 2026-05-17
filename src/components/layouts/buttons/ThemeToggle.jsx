'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'night';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className={`
        relative w-14 h-7 rounded-full transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400
        ${isDark
          ? 'bg-slate-700 border border-white/10'
          : 'bg-amber-100 border border-amber-300'}
      `}
    >
      {/* Track glow */}
      <span
        className={`
          absolute inset-0 rounded-full transition-all duration-500
          ${isDark ? 'shadow-[inset_0_0_8px_rgba(99,102,241,0.3)]' : 'shadow-[inset_0_0_8px_rgba(251,191,36,0.4)]'}
        `}
      />

      {/* Thumb */}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className={`
          absolute top-0.5 w-6 h-6 rounded-full flex items-center justify-center shadow-lg
          ${isDark
            ? 'left-0.5 bg-slate-900 text-indigo-300'
            : 'left-[calc(100%-1.625rem)] bg-amber-400 text-amber-900'}
        `}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.span
              key="moon"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Moon size={13} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="sun"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Sun size={13} strokeWidth={2.5} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </button>
  );
};

export default ThemeToggle;
