'use client';

import { Menu, X, Search, ShoppingCart, Heart } from 'lucide-react';
import Navlink from './buttons/NavLink';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthButton from './buttons/AuthButton';
import ThemeToggle from './buttons/ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCart } from '@/provider/CartProvider';
import { useFavorites } from '@/provider/FavoriteProvider';
import { useTheme } from '@/provider/ThemeProvider';

const Navbar = () => {
  const { cartCount } = useCart();
  const { favoriteCount } = useFavorites();
  const { theme } = useTheme();
  const isDark = theme === 'night';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Products', href: '/products' },
    { name: 'Contact', href: '/contact' },
  ];


  const navBg =
    scrolled || !isHome
      ? isDark
        ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3'
        : 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-3 shadow-sm'
      : 'bg-transparent py-5';

  const textPrimary  = isDark ? 'text-white'      : 'text-slate-900';
  const textMuted    = isDark ? 'text-slate-400'  : 'text-slate-500';
  const iconBase     = isDark ? 'text-slate-300'  : 'text-slate-600';
  const iconHoverEm  = isDark ? 'hover:text-emerald-400' : 'hover:text-emerald-600';
  const iconHoverRose= isDark ? 'hover:text-rose-400'    : 'hover:text-rose-600';
  const iconBtnHover = isDark ? 'hover:bg-white/5'       : 'hover:bg-black/5';
  const badgeBorder  = isDark ? 'border-slate-950'       : 'border-white';
  const divider      = isDark ? 'bg-white/10'            : 'bg-black/10';

  const mobileBg     = isDark ? 'bg-slate-950 border-t border-white/5' : 'bg-white border-t border-black/5';
  const mobileItemBg = isDark
    ? 'bg-white/5 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400'
    : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-600';
  const mobileIconBg = isDark ? 'bg-white/5 text-slate-500' : 'bg-slate-100 text-slate-400';
  const mobileBorderT= isDark ? 'border-white/5' : 'border-black/5';
  const mobileMenuBtn= isDark ? 'bg-white/5 text-white' : 'bg-black/5 text-slate-900';

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navBg}`}>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">


        <Link href="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
            <span className="text-white font-black text-xl italic">C</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className={`text-2xl font-black tracking-tighter transition-colors ${textPrimary} group-hover:text-emerald-600`}>
              CAT<span className="text-emerald-500">SHOP</span>
            </span>
            <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ml-0.5 ${textMuted}`}>
              Premium Pets
            </span>
          </div>
        </Link>


        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Navlink href={item.href} scrolled={scrolled}>{item.name}</Navlink>
              </li>
            ))}
          </ul>

          <div className={`h-6 w-px ${divider}`} />

          <div className="flex items-center gap-5">

            <ThemeToggle />


            <button className={`p-2.5 rounded-full ${iconBase} ${iconHoverEm} ${iconBtnHover} transition-all duration-300 relative group`}>
              <Search size={20} />
              <span className={`absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${isDark ? 'bg-slate-900 text-white' : 'bg-slate-800 text-white'}`}>
                Search Products
              </span>
            </button>


            <Link href="/cart" className={`p-2.5 rounded-full ${iconBase} ${iconHoverEm} ${iconBtnHover} transition-all duration-300 relative group`}>
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 ${badgeBorder}`}>
                  {cartCount}
                </span>
              )}
            </Link>


            <Link href="/dashboard/favorites" className={`p-2.5 rounded-full ${iconBase} ${iconHoverRose} ${iconBtnHover} transition-all duration-300 relative group`}>
              <Heart size={20} />
              {favoriteCount > 0 && (
                <span className={`absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 ${badgeBorder}`}>
                  {favoriteCount}
                </span>
              )}
            </Link>

            <div className="ml-1">
              <AuthButton />
            </div>
          </div>
        </div>


        <div className="lg:hidden flex items-center gap-3">
          <ThemeToggle />

          <Link href="/dashboard/favorites" className={`p-2 ${iconBase} relative`}>
            <Heart size={22} />
            {favoriteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>

          <Link href="/cart" className={`p-2 ${iconBase} relative`}>
            <ShoppingCart size={22} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl ${mobileMenuBtn}`}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>


      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-full left-0 w-full shadow-2xl lg:hidden overflow-hidden ${mobileBg}`}
          >
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${mobileItemBg}`}
                  >
                    {item.name}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${mobileIconBg}`}>
                      <Search size={14} className="rotate-90" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className={`pt-6 border-t ${mobileBorderT}`}>
                <AuthButton />
              </div>

              <div className="bg-emerald-600 p-6 rounded-[2rem] relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-white font-black text-lg mb-1">New Arrivals</h4>
                  <p className="text-emerald-100 text-xs mb-4">Check out our latest premium pet products.</p>
                  <Link href="/products" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm">
                    Shop Now
                  </Link>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500 rounded-full blur-2xl opacity-50" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
