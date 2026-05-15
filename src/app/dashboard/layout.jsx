'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  CreditCard, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Support', href: '/dashboard/support', icon: HelpCircle },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex overflow-hidden font-sans">
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/10 blur-[120px]"></div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/50 backdrop-blur-xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-white">CAT<span className="text-blue-400">SHOP</span></span>
          </Link>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Menu</p>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[inset_0px_0px_20px_rgba(37,99,235,0.1)]' 
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'bg-slate-800 text-slate-400 group-hover:text-white group-hover:bg-slate-700'}`}>
                    <Icon size={18} />
                  </div>
                  <span className="font-semibold text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 relative overflow-hidden mb-6">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-3 text-white">
                <HelpCircle size={20} />
              </div>
              <h4 className="text-white font-bold mb-1">Need help?</h4>
              <p className="text-blue-100 text-xs mb-3">Please check our docs</p>
              <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors">
                DOCUMENTATION
              </button>
            </div>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 lg:px-10 py-4 bg-slate-950/80 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 bg-white/5 rounded-lg text-slate-300 hover:text-white"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div>
              <p className="text-xs text-slate-400 font-medium">Pages / <span className="text-white capitalize">{pathname.split('/').pop() || 'Dashboard'}</span></p>
              <h1 className="text-xl font-bold text-white capitalize">{pathname.split('/').pop() || 'Dashboard'}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Type here..." 
                className="bg-slate-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-64 transition-all"
              />
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            </div>
            <Link href="/" className="flex items-center gap-2 text-sm text-slate-300 font-medium hover:text-white transition-colors">
              <User size={18} />
              <span className="hidden sm:inline">Store</span>
            </Link>
            <button className="text-slate-300 hover:text-white transition-colors">
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
