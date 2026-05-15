import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { redirect } from 'next/navigation';
import { dbConnect, Collection } from '@/lib/dbConnect';
import { CreditCard, Plus, Pencil, FileText, Download, Wallet, ArrowRight, CircleDollarSign } from 'lucide-react';

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/login?callbackUrl=/dashboard/billing');
  }

  // Fetch recent orders for billing history
  const orderCollection = dbConnect(Collection.ORDERS);
  const userOrders = await orderCollection
    .find({ userEmail: session.user.email })
    .sort({ _id: -1 })
    .limit(5)
    .toArray();

  return (
    <div className="space-y-6">
      <div className="relative z-10 mb-8">
        <h2 className="text-3xl font-black text-white mb-2">Billing & Invoices</h2>
        <p className="text-slate-400">Manage your payment methods and billing history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cards & Billing Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Credit Card Graphic */}
            <div className="relative bg-gradient-to-tr from-slate-900 to-slate-800 rounded-[2rem] p-6 overflow-hidden border border-white/10 shadow-2xl min-h-[220px] flex flex-col justify-between group cursor-pointer hover:border-blue-500/50 transition-colors">
              {/* Card Background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              <div className="relative z-10 flex justify-between items-start">
                <h3 className="text-white font-bold text-lg">CatShop Card</h3>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="#ef4444" fillOpacity="0.8"/>
                  <circle cx="28" cy="12" r="12" fill="#f59e0b" fillOpacity="0.8"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                <p className="text-white/60 text-xs mb-1 uppercase tracking-widest font-bold">Card Number</p>
                <h4 className="text-white text-2xl font-mono tracking-widest mb-4">4562   1122   4594   7852</h4>
                
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">Card Holder</p>
                    <p className="text-white font-bold text-sm">{session.user.name}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">Expires</p>
                    <p className="text-white font-bold text-sm">11/28</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Action */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center gap-4 hover:bg-slate-800/40 transition-colors group cursor-pointer">
              <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-slate-600 flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                <Plus size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Add New Card</h4>
                <p className="text-slate-400 text-xs px-4">Support Mastercard, Visa, and American Express</p>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-bold text-lg">Billing Information</h3>
              <button className="text-blue-400 hover:text-blue-300 text-sm font-bold flex items-center gap-2 transition-colors">
                <Pencil size={14} /> EDIT
              </button>
            </div>
            
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-bold mb-2">{session.user.name}</h4>
                  <div className="space-y-1">
                    <p className="text-slate-400 text-sm"><span className="text-slate-500 w-24 inline-block">Company Name:</span> CatShop Member</p>
                    <p className="text-slate-400 text-sm"><span className="text-slate-500 w-24 inline-block">Email Address:</span> {session.user.email}</p>
                    <p className="text-slate-400 text-sm"><span className="text-slate-500 w-24 inline-block">VAT Number:</span> FRB1235476</p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20">
                  Primary
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Invoices */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">Invoices</h3>
            <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
              <FileText size={16} />
            </button>
          </div>
          
          {userOrders.length > 0 ? (
            <div className="space-y-4 flex-1">
              {userOrders.map((order, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5">
                      <Wallet size={16} />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm mb-0.5">#{order._id.toString().slice(-6).toUpperCase()}</p>
                      <p className="text-slate-500 text-[10px] font-medium uppercase tracking-widest">
                        {order.date ? new Date(order.date).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium text-sm">৳{order.total?.toLocaleString() || 0}</span>
                    <button className="flex items-center gap-1 text-slate-400 hover:text-blue-400 text-xs font-bold transition-colors">
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <CircleDollarSign size={48} className="text-slate-500 mb-4" />
              <p className="text-white font-bold mb-1">No Invoices Yet</p>
              <p className="text-slate-400 text-sm max-w-[200px]">You haven't made any purchases yet.</p>
            </div>
          )}
          
          <button className="w-full mt-6 py-3 rounded-xl border border-white/10 text-slate-300 font-bold text-sm hover:bg-white/5 transition-colors flex items-center justify-center gap-2">
            VIEW ALL HISTORY <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
