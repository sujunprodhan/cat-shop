'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, CreditCard, User, Settings, HelpCircle, LogOut,
  Menu, X, Sparkles, ShoppingBag, Heart, Users, ShieldAlert, MessageSquare, Archive
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/provider/ThemeProvider';

export default function DashboardLayout({ children }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const baseNavItems = [
    { name: 'Dashboard',  href: '/dashboard',            icon: Home },
    { name: 'My Profile', href: '/dashboard/profile',    icon: User },
    { name: 'My Orders',  href: '/dashboard/my-orders',  icon: ShoppingBag },
    { name: 'Favorites',  href: '/dashboard/favorites',  icon: Heart },
    { name: 'Billing',    href: '/dashboard/billing',    icon: CreditCard },
    { name: 'Support',    href: '/dashboard/support',    icon: HelpCircle },
    { name: 'Settings',   href: '/dashboard/settings',   icon: Settings },
  ];

  const adminNavItems = [
    { name: 'Manage Orders',    href: '/admin/orders',  icon: ShieldAlert },
    { name: 'Manage Products',  href: '/admin/products',icon: Archive },
    { name: 'Manage Users',     href: '/admin/users',   icon: Users },
    { name: 'Customer Support', href: '/admin/support', icon: MessageSquare },
  ];

  const navItems = session?.role === 'admin' ? [...baseNavItems, ...adminNavItems] : baseNavItems;

  /* ── Theme tokens ── */
  const layoutBg   = isDark ? 'bg-slate-950 text-white'     : 'bg-slate-50 text-slate-900';
  const overlayBg  = isDark ? 'bg-slate-950/80'             : 'bg-slate-900/50';
  const sidebarBg  = isDark ? 'bg-slate-900/50 border-white/5' : 'bg-white border-slate-200';
  const brandTxt   = isDark ? 'text-white'                  : 'text-slate-900';
  const menuLabel  = isDark ? 'text-slate-500'              : 'text-slate-400';
  const activeLink = isDark
    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
    : 'bg-blue-50 text-blue-600 border border-blue-200';
  const idleLink   = isDark
    ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  const activeIcon = isDark
    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
    : 'bg-blue-500 text-white shadow-md shadow-blue-500/20';
  const idleIcon   = isDark
    ? 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'
    : 'bg-slate-100 text-slate-500 group-hover:text-slate-900 group-hover:bg-slate-200';
  const sideFootBorder = isDark ? 'border-white/5' : 'border-slate-200';
  const headerBg   = isDark ? 'bg-slate-950/80 border-white/5'  : 'bg-white/90 border-slate-200';
  const breadTxt   = isDark ? 'text-slate-400' : 'text-slate-500';
  const breadPage  = isDark ? 'text-white'     : 'text-slate-900';
  const h1Txt      = isDark ? 'text-white'     : 'text-slate-900';
  const mobileBtn  = isDark ? 'bg-white/5 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900';
  const searchBg   = isDark ? 'bg-slate-900 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50' : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400';
  const headerLink = isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const contentBg  = isDark ? '' : '';

  return (
    <div className={`min-h-screen flex overflow-hidden font-sans ${layoutBg}`}>
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]" />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className={`fixed inset-0 backdrop-blur-sm z-40 lg:hidden ${overlayBg}`} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 backdrop-blur-xl border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${sidebarBg} ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className={`text-xl font-black tracking-tight ${brandTxt}`}>CAT<span className="text-blue-400">SHOP</span></span>
          </Link>
          <button className={`lg:hidden ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`} onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
          <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${menuLabel}`}>Menu</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${isActive ? activeLink : idleLink}`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? activeIcon : idleIcon}`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={`p-6 border-t ${sideFootBorder}`}>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 relative overflow-hidden mb-6">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-3 text-white">
                <HelpCircle size={20} />
              </div>
              <h4 className="text-white font-bold mb-1">Need help?</h4>
              <p className="text-blue-100 text-xs mb-3">Please check our docs</p>
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">DOCUMENTATION</button>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className={`sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 py-4 backdrop-blur-md border-b ${headerBg}`}>
          <div className="flex items-center gap-4">
            <button className={`lg:hidden p-2 rounded-lg ${mobileBtn}`} onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <div>
              <p className={`text-xs font-medium ${breadTxt}`}>
                Pages / <span className={`capitalize ${breadPage}`}>{pathname.split('/').pop() || 'Dashboard'}</span>
              </p>
              <h1 className={`text-xl font-bold capitalize ${h1Txt}`}>{pathname.split('/').pop() || 'Dashboard'}</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Type here..."
                className={`border rounded-full py-2 pl-10 pr-4 text-sm outline-none w-64 transition-all ${searchBg}`}
              />
              <Sparkles className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={16} />
            </div>
            <Link href="/" className={`flex items-center gap-2 text-sm font-medium transition-colors ${headerLink}`}>
              <User size={18} /><span className="hidden sm:inline">Store</span>
            </Link>
            <button className={`transition-colors ${headerLink}`}>
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 lg:p-10 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
