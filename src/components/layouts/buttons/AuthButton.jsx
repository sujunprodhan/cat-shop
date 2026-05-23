'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, UserPlus, LogIn, LayoutDashboard, ShoppingBag, User, ShieldAlert, Users, Archive, Plus } from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';

const AuthButton = () => {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const isDark = theme === 'night';
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /* ── Theme classes ── */
  const dropdownBg   = isDark ? 'bg-slate-900 border-white/10'    : 'bg-white border-black/10 shadow-xl';
  const userCard     = isDark ? 'bg-white/5'                       : 'bg-slate-50';
  const userName     = isDark ? 'text-white'                       : 'text-slate-900';
  const userEmail    = isDark ? 'text-slate-400'                   : 'text-slate-500';
  const linkBase     = isDark
    ? 'text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400'
    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600';
  const adminLink    = isDark
    ? 'text-slate-300 hover:bg-rose-500/10 hover:text-rose-400'
    : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600';
  const borderColor  = isDark ? 'border-white/10' : 'border-black/10';
  const avatarBg     = isDark ? 'bg-slate-800' : 'bg-slate-100';
  const avatarBorder = isDark ? 'border-emerald-500' : 'border-emerald-400';

  const loginBtn  = isDark
    ? 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
    : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200';

  if (status === 'loading') {
    return <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />;
  }

  return (
    <div className="flex items-center gap-3">
      {status === 'authenticated' ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center w-10 h-10 rounded-full border-2 overflow-hidden hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer ${avatarBorder} ${avatarBg}`}
          >
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="User Image"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`} />
            )}
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className={`absolute right-0 mt-3 w-56 border rounded-2xl overflow-hidden z-50 ${dropdownBg}`}>
              <div className="p-2 space-y-1">
                <div className={`px-3 py-3 border-b mb-2 rounded-xl ${userCard} ${borderColor}`}>
                  <p className={`text-sm font-bold truncate ${userName}`}>{session?.user?.name || 'User'}</p>
                  <p className={`text-xs truncate ${userEmail}`}>{session?.user?.email}</p>
                </div>

                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium ${linkBase}`}
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                {session?.role === 'admin' && (
                  <>
                    <Link
                      href="/admin/orders"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium ${adminLink}`}
                    >
                      <ShoppingBag size={18} />
                      Manage Orders
                    </Link>
                    <Link
                      href="/admin/users"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium ${adminLink}`}
                    >
                      <Users size={18} />
                      Manage Users
                    </Link>
                    <Link
                      href="/admin/products"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium ${adminLink}`}
                    >
                      <Archive size={18} />
                      Manage Products
                    </Link>
                    <Link
                      href="/admin/products/new"
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium ${adminLink}`}
                    >
                      <Plus size={18} />
                      Add Product
                    </Link>
                  </>
                )}

                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium ${linkBase}`}
                >
                  <User size={18} />
                  My Profile
                </Link>

                <Link
                  href="/dashboard/my-orders"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors font-medium ${linkBase}`}
                >
                  <ShoppingBag size={18} />
                  My Orders
                </Link>

                <button
                  onClick={() => { setIsOpen(false); signOut(); }}
                  className="w-full flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-95"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 active:scale-95 ${loginBtn}`}
          >
            <LogIn size={18} />
            <span className="hidden sm:inline">Login</span>
          </Link>
          <Link
            href="/register"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-95"
          >
            <UserPlus size={18} />
            <span className="hidden sm:inline">Register</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthButton;
