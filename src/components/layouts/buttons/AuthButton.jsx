'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';
import { LogOut, UserPlus, LogIn, LayoutDashboard, ShoppingBag, User, ShieldAlert, Users } from 'lucide-react';

const AuthButton = () => {
  const { data: session, status } = useSession();
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

  if (status === 'loading') {
    return <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse"></div>;
  }

  return (
    <div className="flex items-center gap-3">
      {status === 'authenticated' ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-emerald-500 overflow-hidden hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer bg-slate-800"
          >
            {session?.user?.image ? (
              <img 
                src={session.user.image} 
                alt="User Image" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-5 h-5 text-slate-300" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-white/10 rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="p-2 space-y-1">
                <div className="px-3 py-3 border-b border-white/10 mb-2 bg-white/5 rounded-xl">
                  <p className="text-sm font-bold text-white truncate">{session?.user?.name || 'User'}</p>
                  <p className="text-xs text-slate-400 truncate">{session?.user?.email}</p>
                </div>
                
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-colors font-medium"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                {session?.role === 'admin' && (
                  <>
                    <Link
                      href="/admin/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-colors font-medium"
                    >
                      <ShoppingBag size={18} />
                      Manage Orders
                    </Link>
                    <Link
                      href="/admin/users"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-colors font-medium"
                    >
                      <Users size={18} />
                      Manage Users
                    </Link>
                  </>
                )}
                
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-colors font-medium"
                >
                  <User size={18} />
                  My Profile
                </Link>
                
                <Link
                  href="/dashboard/my-orders"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-colors font-medium"
                >
                  <ShoppingBag size={18} />
                  My Orders
                </Link>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut();
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-95"
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
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl font-bold hover:bg-white/10 transition-all duration-300 active:scale-95"
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

