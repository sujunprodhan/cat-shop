'use client';

import React from 'react';
import {
  CreditCard, Plus, Pencil, FileText, Download,
  Wallet, ArrowRight, CircleDollarSign
} from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';

export default function BillingContent({ userName, userEmail, orders }) {
  const { theme } = useTheme();
  const isDark = theme === 'night';

  /* ── Theme tokens ── */
  const heading   = isDark ? 'text-white'    : 'text-slate-900';
  const subText   = isDark ? 'text-slate-400' : 'text-slate-600';
  const muted     = isDark ? 'text-slate-500' : 'text-slate-400';
  const cardBg    = isDark ? 'bg-slate-900/40 border-white/5'       : 'bg-white border-slate-200 shadow-sm';
  const addCardBg = isDark
    ? 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40'
    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 shadow-sm';
  const addCardBorder = isDark
    ? 'border-slate-600 text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500'
    : 'border-slate-300 text-slate-400 group-hover:border-blue-400 group-hover:text-blue-500';
  const addCardTitle = isDark ? 'text-white' : 'text-slate-800';
  const billInfoBg = isDark ? 'bg-slate-800/50 border-white/5' : 'bg-slate-100 border-slate-200';
  const billLabel  = isDark ? 'text-slate-500' : 'text-slate-400';
  const billValue  = isDark ? 'text-slate-400' : 'text-slate-600';
  const invoiceRow = isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50';
  const invoiceIco = isDark ? 'bg-slate-800 border-white/5 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500';
  const invoiceId  = isDark ? 'text-white'    : 'text-slate-900';
  const invoiceAmt = isDark ? 'text-white'    : 'text-slate-800';
  const dlBtn      = isDark
    ? 'text-slate-400 hover:text-blue-400'
    : 'text-slate-400 hover:text-blue-600';
  const viewAllBtn = isDark
    ? 'border-white/10 text-slate-300 hover:bg-white/5'
    : 'border-slate-200 text-slate-600 hover:bg-slate-50';

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="mb-8">
        <h2 className={`text-3xl font-black mb-2 ${heading}`}>Billing &amp; Invoices</h2>
        <p className={subText}>Manage your payment methods and billing history.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Credit Card Graphic (intentionally dark — real card aesthetic) */}
            <div className="relative bg-gradient-to-tr from-slate-900 to-slate-800 rounded-[2rem] p-6 overflow-hidden border border-white/10 shadow-2xl min-h-[220px] flex flex-col justify-between group cursor-pointer hover:border-blue-500/50 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

              <div className="relative z-10 flex justify-between items-start">
                <h3 className="text-white font-bold text-lg">CatShop Card</h3>
                <svg width="40" height="24" viewBox="0 0 40 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#ef4444" fillOpacity="0.8" />
                  <circle cx="28" cy="12" r="12" fill="#f59e0b" fillOpacity="0.8" />
                </svg>
              </div>

              <div className="relative z-10">
                <p className="text-white/60 text-xs mb-1 uppercase tracking-widest font-bold">Card Number</p>
                <h4 className="text-white text-2xl font-mono tracking-widest mb-4">4562   1122   4594   7852</h4>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">Card Holder</p>
                    <p className="text-white font-bold text-sm">{userName}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold mb-1">Expires</p>
                    <p className="text-white font-bold text-sm">11/28</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add New Card */}
            <div className={`backdrop-blur-xl border rounded-[2rem] p-6 flex flex-col justify-center items-center text-center gap-4 transition-colors group cursor-pointer ${addCardBg}`}>
              <div className={`w-16 h-16 rounded-2xl border-2 border-dashed flex items-center justify-center transition-colors ${addCardBorder}`}>
                <Plus size={24} />
              </div>
              <div>
                <h4 className={`font-bold mb-1 ${addCardTitle}`}>Add New Card</h4>
                <p className={`text-xs px-4 ${subText}`}>Support Mastercard, Visa, and American Express</p>
              </div>
            </div>
          </div>

          {/* Billing Information */}
          <div className={`backdrop-blur-xl border rounded-[2rem] p-6 relative overflow-hidden ${cardBg}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`font-bold text-lg ${heading}`}>Billing Information</h3>
              <button className="text-blue-500 hover:text-blue-400 text-sm font-bold flex items-center gap-2 transition-colors">
                <Pencil size={14} /> EDIT
              </button>
            </div>

            <div className={`rounded-xl p-5 border ${billInfoBg}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-bold mb-2 ${heading}`}>{userName}</h4>
                  <div className="space-y-1">
                    <p className={`text-sm ${billValue}`}>
                      <span className={`w-32 inline-block ${billLabel}`}>Company Name:</span> CatShop Member
                    </p>
                    <p className={`text-sm ${billValue}`}>
                      <span className={`w-32 inline-block ${billLabel}`}>Email Address:</span> {userEmail}
                    </p>
                    <p className={`text-sm ${billValue}`}>
                      <span className={`w-32 inline-block ${billLabel}`}>VAT Number:</span> FRB1235476
                    </p>
                  </div>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold border border-emerald-500/20">
                  Primary
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Invoices ── */}
        <div className={`backdrop-blur-xl border rounded-[2rem] p-6 flex flex-col h-full ${cardBg}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`font-bold text-lg ${heading}`}>Invoices</h3>
            <button className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500/20 transition-colors">
              <FileText size={16} />
            </button>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-4 flex-1">
              {orders.map((order, idx) => (
                <div key={idx} className={`flex items-center justify-between p-3 rounded-xl transition-colors ${invoiceRow}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${invoiceIco}`}>
                      <Wallet size={16} />
                    </div>
                    <div>
                      <p className={`font-bold text-sm mb-0.5 ${invoiceId}`}>#{order._id.slice(-6).toUpperCase()}</p>
                      <p className={`text-[10px] font-medium uppercase tracking-widest ${muted}`}>
                        {order.date ? new Date(order.date).toLocaleDateString() : 'Recent'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`font-medium text-sm ${invoiceAmt}`}>৳{order.total?.toLocaleString() || 0}</span>
                    <button className={`flex items-center gap-1 text-xs font-bold transition-colors ${dlBtn}`}>
                      <Download size={14} /> PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <CircleDollarSign size={48} className={`mb-4 ${muted}`} />
              <p className={`font-bold mb-1 ${heading}`}>No Invoices Yet</p>
              <p className={`text-sm max-w-[200px] ${subText}`}>You haven't made any purchases yet.</p>
            </div>
          )}

          <button className={`w-full mt-6 py-3 rounded-xl border font-bold text-sm transition-colors flex items-center justify-center gap-2 ${viewAllBtn}`}>
            VIEW ALL HISTORY <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
