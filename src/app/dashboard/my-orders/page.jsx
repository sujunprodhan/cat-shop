'use client';

import React, { useEffect, useState } from 'react';
import { getUserOrders } from '@/actions/server/order';
import { ShoppingBag, Package, Calendar, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';
import { useTheme } from '@/provider/ThemeProvider';

export default function MyOrdersPage() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'night';

  useEffect(() => {
    getUserOrders().then(r => { if (r.success) setOrders(r.data); setLoading(false); });
  }, []);

  /* ── Theme tokens ── */
  const heading   = isDark ? 'text-white'    : 'text-slate-900';
  const subText   = isDark ? 'text-slate-400' : 'text-slate-600';
  const muted     = isDark ? 'text-slate-500' : 'text-slate-400';
  const cardBg    = isDark ? 'bg-slate-900/40 border-white/5 hover:border-blue-500/30'  : 'bg-white border-slate-200 hover:border-blue-400/40 shadow-sm';
  const emptyBg   = isDark ? 'bg-slate-900/30 border-white/5'  : 'bg-white border-slate-200 shadow-sm';
  const headerBdr = isDark ? 'border-white/5' : 'border-slate-200';
  const bodyBg    = isDark ? 'bg-slate-950/20' : 'bg-slate-50';
  const searchCls = isDark
    ? 'bg-slate-900/50 border-white/10 text-white placeholder-slate-500 focus:border-blue-500/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-400 shadow-sm';
  const orderIdLbl = isDark ? 'text-slate-500' : 'text-slate-400';
  const orderIdVal = isDark ? 'text-white'     : 'text-slate-900';
  const dateLbl    = isDark ? 'text-slate-400' : 'text-slate-500';
  const dateVal    = isDark ? 'text-white'     : 'text-slate-800';
  const totalLbl   = isDark ? 'text-slate-500' : 'text-slate-400';
  const imgBg      = isDark ? 'bg-slate-800 border-white/5'  : 'bg-slate-100 border-slate-200';
  const itemTitle  = isDark ? 'text-white group-hover/item:text-blue-400' : 'text-slate-800 group-hover/item:text-blue-600';
  const itemMeta   = isDark ? 'text-slate-500' : 'text-slate-400';
  const chevronBtn = isDark ? 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10' : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
        <p className={`font-medium animate-pulse ${subText}`}>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center min-h-[400px] text-center p-6 backdrop-blur-md rounded-3xl border ${emptyBg}`}>
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-blue-400" size={40} />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${heading}`}>No orders yet</h2>
        <p className={`max-w-md mx-auto mb-8 ${subText}`}>
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <a href="/products" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20">
          EXPLORE PRODUCTS
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-black tracking-tight mb-2 flex items-center gap-3 ${heading}`}>
            My <span className="text-blue-500">Orders</span>
          </h2>
          <p className={`text-sm ${subText}`}>Track and manage your recent purchases</p>
        </div>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search orders..."
            className={`border rounded-2xl py-3 pl-12 pr-6 text-sm outline-none w-full md:w-72 transition-all backdrop-blur-md ${searchCls}`}
          />
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 group-hover:text-blue-400 transition-colors ${muted}`} size={18} />
        </div>
      </div>

      {/* Order Cards */}
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order._id} className={`backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-500 group ${cardBg}`}>
            {/* Order Header */}
            <div className={`p-6 md:p-8 border-b flex flex-wrap items-center justify-between gap-6 ${headerBdr}`}>
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
                  <Package size={24} />
                </div>
                <div>
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${orderIdLbl}`}>Order ID</p>
                  <h3 className={`text-lg font-bold uppercase tracking-wider ${orderIdVal}`}>#{order._id.slice(-8)}</h3>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden sm:block">
                  <div className={`flex items-center gap-2 mb-1 ${dateLbl}`}>
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Placed On</span>
                  </div>
                  <p className={`text-sm font-semibold ${dateVal}`}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <div>
                  <div className={`flex items-center gap-2 mb-1 ${dateLbl}`}>
                    <div className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-amber-500' : order.status === 'confirmed' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
                  </div>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                    order.status === 'pending'   ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    order.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                    'bg-blue-500/10 text-blue-500 border-blue-500/20'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${totalLbl}`}>Total</p>
                  <p className="text-2xl font-black text-emerald-500">${order.total?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className={`p-6 md:p-8 ${bodyBg}`}>
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-4">
                      <div className={`relative w-16 h-16 rounded-xl border overflow-hidden shrink-0 ${imgBg}`}>
                        <Image src={item.image} alt={item.title} fill className="object-contain p-2 group-hover/item:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h4 className={`text-sm font-bold transition-colors line-clamp-1 ${itemTitle}`}>{item.title}</h4>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${itemMeta}`}>
                          QTY: {item.quantity || 1} • ${item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <button className={`p-2 rounded-lg transition-all ${chevronBtn}`}>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
