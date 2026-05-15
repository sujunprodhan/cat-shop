import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { Collection, dbConnect } from '@/lib/dbConnect';
import { Wallet, Users, ShoppingBag, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/dashboard');
  }

  // Fetch real data: Orders and user stats
  const orderCollection = dbConnect(Collection.ORDERS);
  const userOrders = await orderCollection.find({ userEmail: session.user.email }).toArray();
  
  const totalOrders = userOrders.length;
  const totalSpent = userOrders.reduce((sum, order) => sum + (order.total || 0), 0);
  
  // For other stats, we use mocked realistic data as per UI reference
  const stats = [
    { title: "Total Spent", value: `৳${totalSpent.toLocaleString()}`, icon: Wallet, change: "+55%", isPositive: true },
    { title: "Total Orders", value: totalOrders.toString(), icon: ShoppingBag, change: "+5%", isPositive: true },
    { title: "Profile Visits", value: "145", icon: Users, change: "-14%", isPositive: false },
    { title: "Engagement", value: "9.3/10", icon: TrendingUp, change: "+8%", isPositive: true },
  ];

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-white text-2xl font-bold flex items-center gap-2">
                  {stat.value}
                  <span className={`text-xs font-bold flex items-center ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.change}
                  </span>
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
        {/* Welcome Section */}
        <div className="lg:col-span-7 bg-[#0b1437]/80 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[300px] shadow-2xl">
          {/* Jellyfish/Abstract Background */}
          <div className="absolute inset-0 z-0 opacity-70 bg-cover bg-right-bottom mix-blend-lighten" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=1200&auto=format&fit=crop')" }}></div>
          {/* Stronger Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0b1437] via-[#0b1437]/90 to-transparent z-0"></div>
          
          <div className="relative z-10 max-w-md">
            <p className="text-slate-300 text-sm font-medium mb-2">Welcome back,</p>
            <h2 className="text-white text-4xl font-black mb-4">{session.user.name}</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-10 font-medium">
              Glad to see you again! You have successfully placed {totalOrders} orders. Keep shopping to unlock new rewards and premium perks.
            </p>
            <button className="text-white font-bold text-sm flex items-center gap-2 hover:text-blue-400 transition-colors group">
              Tap to view details <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Satisfaction Rate */}
        <div className="lg:col-span-5 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col">
          <h3 className="text-white font-bold text-lg mb-1">Store Satisfaction</h3>
          <p className="text-slate-400 text-sm mb-8">Based on your purchases</p>
          
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-48 h-48 rounded-full border-[16px] border-slate-800 relative flex items-center justify-center">
              {/* Fake progress ring */}
              <div className="absolute inset-[-16px] rounded-full border-[16px] border-blue-500 border-t-transparent border-r-transparent transform -rotate-45"></div>
              <div className="text-center">
                <h2 className="text-4xl font-black text-white">95%</h2>
                <p className="text-slate-400 text-xs">Approval rate</p>
              </div>
            </div>
            
            <div className="w-full flex justify-between mt-8 text-xs font-bold text-slate-500">
              <span>0%</span>
              <span>100%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
              <div className="bg-blue-500 h-full w-[95%] rounded-full shadow-[0_0_10px_#3b82f6]"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Login Frequency Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8">
          <h3 className="text-white font-bold text-lg mb-1">Login Frequency</h3>
          <p className="text-emerald-400 text-sm font-medium mb-8">(+12) more <span className="text-slate-400">in 2026</span></p>
          
          <div className="h-64 w-full relative pl-8">
            {/* Fake grid lines & Y-axis labels */}
            <div className="absolute inset-0 flex flex-col justify-between border-b border-white/5 pb-6">
              {[500, 400, 300, 200, 100, 0].map(val => (
                <div key={val} className="w-full border-t border-white/5 relative">
                  <span className="absolute -top-3 -left-8 text-[10px] text-slate-500">{val}</span>
                </div>
              ))}
            </div>
            
            {/* Smooth SVG Area Chart */}
            <div className="absolute inset-0 left-8 right-0 bottom-6 top-0 z-10 overflow-hidden">
              <svg viewBox="0 0 1000 300" preserveAspectRatio="none" className="w-full h-full drop-shadow-2xl">
                <defs>
                  <linearGradient id="colorLogins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>

                {/* Background line (Visits) */}
                <path 
                  d="M0,200 C150,150 250,280 400,200 C550,120 650,250 800,150 C900,100 950,180 1000,180 L1000,300 L0,300 Z" 
                  fill="url(#colorVisits)" 
                />
                <path 
                  d="M0,200 C150,150 250,280 400,200 C550,120 650,250 800,150 C900,100 950,180 1000,180" 
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="3" 
                />
                
                {/* Foreground line (Logins) */}
                <path 
                  d="M0,40 C100,80 150,240 280,240 C400,240 450,40 550,40 C700,40 750,160 850,160 C920,160 950,60 1000,60 L1000,300 L0,300 Z" 
                  fill="url(#colorLogins)" 
                />
                <path 
                  d="M0,40 C100,80 150,240 280,240 C400,240 450,40 550,40 C700,40 750,160 850,160 C920,160 950,60 1000,60" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="5" 
                />
              </svg>
            </div>
            
            {/* X-axis labels */}
            <div className="absolute bottom-0 w-full flex justify-between pl-8 pr-4 mt-2 z-20">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m} className="text-[10px] text-slate-500">{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Active Users/Activity */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-8 flex flex-col">
          <h3 className="text-white font-bold text-lg mb-1">Your Activity</h3>
          <p className="text-emerald-400 text-sm font-medium mb-8">(+23%) <span className="text-slate-400">than last week</span></p>
          
          <div className="flex-1 flex flex-col justify-center space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Activity size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-white font-medium text-sm">Site Visits</span>
                  <span className="text-slate-400 text-sm">340</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[60%] rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ShoppingBag size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-white font-medium text-sm">Cart Additions</span>
                  <span className="text-slate-400 text-sm">12</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[30%] rounded-full"></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Wallet size={20} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-white font-medium text-sm">Points Earned</span>
                  <span className="text-slate-400 text-sm">450</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full w-[45%] rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
