'use client';

import React, { useEffect, useState } from 'react';
import { getUserOrders } from '@/actions/server/order';
import { ShoppingBag, Package, Calendar, Clock, ChevronRight, Search } from 'lucide-react';
import Image from 'next/image';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const result = await getUserOrders();
      if (result.success) {
        setOrders(result.data);
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-slate-900/30 backdrop-blur-md rounded-3xl border border-white/5">
        <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="text-blue-400" size={40} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">No orders yet</h2>
        <p className="text-slate-400 max-w-md mx-auto mb-8">
          You haven't placed any orders yet. Start shopping to see your orders here!
        </p>
        <a 
          href="/products" 
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          EXPLORE PRODUCTS
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            My <span className="text-blue-500">Orders</span>
          </h2>
          <p className="text-slate-400 text-sm">Track and manage your recent purchases</p>
        </div>
        
        <div className="relative group">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="bg-slate-900/50 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 w-full md:w-72 transition-all backdrop-blur-md group-hover:border-white/20"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-blue-400 transition-colors" size={18} />
        </div>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div 
            key={order._id}
            className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all duration-500 group"
          >
            {/* Order Header */}
            <div className="p-6 md:p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform duration-500">
                  <Package size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Order ID</p>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">#{order._id.slice(-8)}</h3>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="hidden sm:block">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Placed On</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <div className={`w-2 h-2 rounded-full ${
                      order.status === 'pending' ? 'bg-amber-500' : 
                      order.status === 'confirmed' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Status</span>
                  </div>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
                    order.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                    order.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Total</p>
                  <p className="text-2xl font-black text-emerald-400">${order.total?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6 md:p-8 bg-slate-950/20">
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between group/item">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl bg-slate-800 border border-white/5 overflow-hidden shrink-0">
                        <Image 
                          src={item.image} 
                          alt={item.title} 
                          fill 
                          className="object-contain p-2 group-hover/item:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover/item:text-blue-400 transition-colors line-clamp-1">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">
                          QTY: {item.quantity || 1} • ${item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <button className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
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
