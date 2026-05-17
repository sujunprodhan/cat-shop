'use client';

import React from 'react';
import { Wallet, Users, ShoppingBag, TrendingUp, ArrowUpRight, Activity } from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';

export default function DashboardContent({ userName, totalOrders, totalSpent }) {
  const { theme } = useTheme();
  const isDark = theme === 'night';

  /* ── Theme tokens ── */
  const cardBg    = isDark ? 'bg-slate-900/40 border-white/5'       : 'bg-white border-slate-200 shadow-sm';
  const heading   = isDark ? 'text-white'    : 'text-slate-900';
  const subText   = isDark ? 'text-slate-400' : 'text-slate-500';
  const ringBg    = isDark ? 'border-slate-800' : 'border-slate-200';
  const barTrack  = isDark ? 'bg-slate-800'   : 'bg-slate-200';
  const chartGrid = isDark ? 'border-white/5' : 'border-slate-200';
  const axisLabel = isDark ? 'text-slate-500' : 'text-slate-400';
  const actLbl    = isDark ? 'text-white'     : 'text-slate-800';
  const actVal    = isDark ? 'text-slate-400' : 'text-slate-500';
  const icon1     = isDark ? 'bg-blue-500/10 text-blue-400'     : 'bg-blue-100 text-blue-600';
  const icon2     = isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600';
  const icon3     = isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600';

  const stats = [
    { title: 'Total Spent',    value: `৳${totalSpent.toLocaleString()}`, icon: Wallet,    change: '+55%', isPositive: true },
    { title: 'Total Orders',   value: totalOrders.toString(),             icon: ShoppingBag, change: '+5%', isPositive: true },
    { title: 'Profile Visits', value: '145',                              icon: Users,    change: '-14%', isPositive: false },
    { title: 'Engagement',     value: '9.3/10',                           icon: TrendingUp, change: '+8%', isPositive: true },
  ];

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`backdrop-blur-xl border rounded-[2rem] p-6 relative overflow-hidden group ${cardBg}`}>
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500" />
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className={`text-sm font-medium mb-1 ${subText}`}>{stat.title}</p>
                <h3 className={`text-2xl font-bold flex items-center gap-2 ${heading}`}>
                  {stat.value}
                  <span className={`text-xs font-bold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>{stat.change}</span>
                </h3>
              </div>
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ── Welcome Banner (always dark for the gradient aesthetic) ── */}
        <div className="lg:col-span-7 bg-[#0b1437]/90 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-2xl">
          <div className="absolute inset-0 z-0 opacity-60 bg-cover bg-right-bottom mix-blend-lighten"
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200&auto=format&fit=crop')" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1437] via-[#0b1437]/90 to-transparent z-0" />
          <div className="relative z-10 max-w-md">
            <p className="text-slate-300 text-sm font-medium mb-2">Welcome back,</p>
            <h2 className="text-white text-4xl font-black mb-4">{userName}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-10 font-medium">
              Glad to see you again! You have successfully placed {totalOrders} orders. Keep shopping to unlock new rewards.
            </p>
            <button className="text-white font-bold text-sm flex items-center gap-2 hover:text-blue-400 transition-colors group">
              Tap to view details <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ── Satisfaction Ring ── */}
        <div className={`lg:col-span-5 backdrop-blur-xl border rounded-[2rem] p-8 flex flex-col ${cardBg}`}>
          <h3 className={`font-bold text-lg mb-1 ${heading}`}>Store Satisfaction</h3>
          <p className={`text-sm mb-8 ${subText}`}>Based on your purchases</p>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className={`w-48 h-48 rounded-full border-[16px] relative flex items-center justify-center ${ringBg}`}>
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-blue-500 border-t-transparent border-r-transparent transform -rotate-45" />
              <div className="text-center">
                <h2 className={`text-4xl font-black ${heading}`}>95%</h2>
                <p className={`text-xs ${subText}`}>Approval rate</p>
              </div>
            </div>
            <div className={`w-full flex justify-between mt-8 text-xs font-bold ${axisLabel}`}>
              <span>0%</span><span>100%</span>
            </div>
            <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${barTrack}`}>
              <div className="bg-blue-500 h-full w-[95%] rounded-full shadow-[0_0_10px_#3b82f6]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Login Frequency Chart ── */}
        <div className={`lg:col-span-2 backdrop-blur-xl border rounded-[2rem] p-8 ${cardBg}`}>
          <h3 className={`font-bold text-lg mb-1 ${heading}`}>Login Frequency</h3>
          <p className="text-sm font-medium mb-8">
            <span className="text-emerald-400">(+12) more</span>{' '}
            <span className={subText}>in 2026</span>
          </p>
          <div className="h-64 w-full relative pl-8">
            <div className={`absolute inset-0 flex flex-col justify-between border-b pb-6 ${chartGrid}`}>
              {[500, 400, 300, 200, 100, 0].map(val => (
                <div key={val} className={`w-full border-t relative ${chartGrid}`}>
                  <span className={`absolute -top-3 -left-8 text-[10px] ${axisLabel}`}>{val}</span>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 left-8 right-0 bottom-6 top-0 z-10 overflow-hidden">
              <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="colorLogins2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVisits2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <path d="M0,200 C150,150 250,280 400,200 C550,120 650,250 800,150 C900,100 950,180 1000,180 L1000,300 L0,300 Z" fill="url(#colorVisits2)" />
                <path d="M0,200 C150,150 250,280 400,200 C550,120 650,250 800,150 C900,100 950,180 1000,180" fill="none" stroke="#0ea5e9" strokeWidth="3" />
                <path d="M0,40 C100,80 150,240 280,240 C400,240 450,40 550,40 C700,40 750,160 850,160 C920,160 950,60 1000,60 L1000,300 L0,300 Z" fill="url(#colorLogins2)" />
                <path d="M0,40 C100,80 150,240 280,240 C400,240 450,40 550,40 C700,40 750,160 850,160 C920,160 950,60 1000,60" fill="none" stroke="#3b82f6" strokeWidth="5" />
              </svg>
            </div>
            <div className="absolute bottom-0 w-full flex justify-between pl-8 pr-4 mt-2 z-20">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].map(m => (
                <span key={m} className={`text-[10px] ${axisLabel}`}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Activity ── */}
        <div className={`backdrop-blur-xl border rounded-[2rem] p-8 flex flex-col ${cardBg}`}>
          <h3 className={`font-bold text-lg mb-1 ${heading}`}>Your Activity</h3>
          <p className="text-sm font-medium mb-8">
            <span className="text-emerald-400">(+23%)</span>{' '}
            <span className={subText}>than last week</span>
          </p>
          <div className="flex-1 flex flex-col justify-center space-y-6">
            {[
              { label: 'Site Visits',    value: 340, pct: '60%', icon: Activity,    iconCls: icon1, bar: 'bg-blue-500' },
              { label: 'Cart Additions', value: 12,  pct: '30%', icon: ShoppingBag, iconCls: icon2, bar: 'bg-emerald-500' },
              { label: 'Points Earned',  value: 450, pct: '45%', icon: Wallet,      iconCls: icon3, bar: 'bg-purple-500' },
            ].map(({ label, value, pct, icon: Icon, iconCls, bar }) => (
              <div key={label} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconCls}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className={`font-medium text-sm ${actLbl}`}>{label}</span>
                    <span className={`text-sm ${actVal}`}>{value}</span>
                  </div>
                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${barTrack}`}>
                    <div className={`${bar} h-full rounded-full`} style={{ width: pct }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
