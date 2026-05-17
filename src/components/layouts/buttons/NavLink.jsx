'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/provider/ThemeProvider';

const Navlink = ({ href, children, scrolled }) => {
  const path = usePathname();
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const isActive = href === '/' ? path === '/' : path?.startsWith(href);

  const textClass = isActive
    ? 'text-emerald-500'
    : isDark
    ? 'text-slate-300 hover:text-emerald-400'
    : 'text-slate-700 hover:text-emerald-600';

  return (
    <Link
      href={href}
      className={`relative group px-1 py-2 font-bold transition-colors duration-300 ${textClass}`}
    >
      <span className="relative z-10">{children}</span>

      {/* Underline animation */}
      <span
        className={`absolute bottom-0 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
          isActive ? 'w-full' : 'w-0 group-hover:w-full'
        }`}
      />

      {/* Active glow pill */}
      {isActive && (
        <motion.span
          layoutId="nav-active-glow"
          className="absolute inset-0 bg-emerald-500/10 rounded-lg -z-0"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </Link>
  );
};

export default Navlink;
