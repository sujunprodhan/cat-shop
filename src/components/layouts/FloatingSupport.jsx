'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, MessageSquare, Phone, Send, ExternalLink, Sparkles, Cat } from 'lucide-react';
import Link from 'next/link';
import AIChatWindow from './AIChatWindow';

const FloatingSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const whatsappNumber = "1234567890"; // Replace with real number
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hi%20CatShop%20Support!%20I%20need%20some%20help.`;

  return (
    <div className="fixed bottom-8 right-8 z-[9999] flex flex-col items-end gap-6">
      <AnimatePresence>
        {isAIChatOpen && (
          <AIChatWindow onClose={() => setIsAIChatOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && !isAIChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.9, filter: 'blur(10px)' }}
            className="w-[350px] bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8">
              <h3 className="text-xl font-black text-white mb-2">How can we help?</h3>
              <p className="text-emerald-100/70 text-sm font-medium">Our support team is usually online and ready to assist you.</p>
            </div>

            {/* Support Options */}
            <div className="p-6 space-y-4">
              {/* AI Chat Option */}
              <button 
                onClick={() => {
                  setIsAIChatOpen(true);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg shadow-emerald-500/20">
                  <Cat size={24} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-black text-sm flex items-center gap-2">
                    Live AI Chat
                    <span className="bg-white/20 text-[8px] px-1.5 py-0.5 rounded text-white font-bold">24/7</span>
                  </p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Instant AI Helper</p>
                </div>
                <Sparkles size={16} className="text-emerald-400 animate-pulse" />
              </button>

              {/* WhatsApp Option */}
              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Phone size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-black text-sm">WhatsApp Chat</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Human Support</p>
                </div>
                <ExternalLink size={16} className="text-slate-600 group-hover:text-emerald-400" />
              </a>

              {/* Contact Page Option */}
              <Link 
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <MessageSquare size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-black text-sm">Support Ticket</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Email Assistance</p>
                </div>
                <ChevronRight size={16} className="text-slate-600 group-hover:text-blue-400" />
              </Link>

              {/* Dashboard Support Option */}
              <Link 
                href="/dashboard/support"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-950/20 group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white">
                  <Send size={20} />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white font-black text-sm">Dashboard Support</p>
                  <p className="text-emerald-100/50 text-[10px] font-bold uppercase tracking-widest">Priority Help</p>
                </div>
              </Link>
            </div>

            {/* Footer */}
            <div className="p-4 text-center border-t border-white/5 bg-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Fast Response Guaranteed</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 overflow-hidden ${isOpen ? 'bg-rose-600 rotate-90' : 'bg-emerald-600 shadow-emerald-600/20'}`}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"></div>
        {isOpen ? (
          <X className="text-white relative z-10" size={28} />
        ) : (
          <MessageCircle className="text-white relative z-10 animate-in zoom-in duration-300" size={28} />
        )}
      </motion.button>
    </div>
  );
};

// Internal component for Chevron
const ChevronRight = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

export default FloatingSupport;
