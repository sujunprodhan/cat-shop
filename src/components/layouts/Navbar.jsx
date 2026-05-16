'use client';

import { Menu, X, Search, ShoppingCart, User, Heart } from 'lucide-react';
import Navlink from './buttons/NavLink';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthButton from './buttons/AuthButton';
import { motion, AnimatePresence } from 'framer-motion';

import { usePathname } from 'next/navigation';
import { useCart } from '@/provider/CartProvider';
import { useFavorites } from '@/provider/FavoriteProvider';

const Navbar = () => {
  const { cartCount } = useCart();
  const { favoriteCount } = useFavorites();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      }`}
    >

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
            <span className="text-white font-black text-xl italic">C</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-emerald-600 transition-colors">
              CAT<span className="text-emerald-500">SHOP</span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase ml-0.5">Premium Pets</span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Navlink href={item.href} scrolled={scrolled}>
                  {item.name}
                </Navlink>
              </li>
            ))}
          </ul>

          <div className="h-6 w-px bg-white/10"></div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 rounded-full hover:bg-white/5 text-slate-300 hover:text-emerald-400 transition-all duration-300 relative group">
              <Search size={20} />
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Search Products</span>
            </button>

            <Link href="/cart" className="p-2.5 rounded-full hover:bg-white/5 text-slate-300 hover:text-emerald-400 transition-all duration-300 relative group">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link href="/dashboard/favorites" className="p-2.5 rounded-full hover:bg-white/5 text-slate-300 hover:text-rose-400 transition-all duration-300 relative group">
              <Heart size={20} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-slate-950">
                  {favoriteCount}
                </span>
              )}
            </Link>

            <div className="ml-2">
              <AuthButton />
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-4">
          <Link href="/dashboard/favorites" className="p-2 text-slate-300 relative">
            <Heart size={22} />
            {favoriteCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {favoriteCount}
              </span>
            )}
          </Link>
          <Link href="/cart" className="p-2 text-slate-300 relative">
            <ShoppingCart size={22} />
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-slate-950 border-t border-white/5 shadow-2xl lg:hidden overflow-hidden"
          >
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 font-bold transition-all"
                  >
                    {item.name}
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-emerald-400 shadow-sm">
                      <Search size={14} className="rotate-90" />
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                <AuthButton />
              </div>

              <div className="bg-emerald-600 p-6 rounded-[2rem] relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-white font-black text-lg mb-1">New Arrivals</h4>
                  <p className="text-emerald-100 text-xs mb-4">Check out our latest premium pet products.</p>
                  <Link href="/products" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-5 py-2.5 rounded-xl font-bold text-sm">
                    Shop Now
                  </Link>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-500 rounded-full blur-2xl opacity-50"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

