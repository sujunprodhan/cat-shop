'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  LifeBuoy, 
  MessageCircle, 
  Phone, 
  Mail, 
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

const DashboardSupport = () => {
  const supportChannels = [
    {
      title: 'WhatsApp Support',
      description: 'Get instant answers for your questions via WhatsApp.',
      icon: MessageCircle,
      color: 'emerald',
      link: 'https://wa.me/1234567890',
      action: 'Start Chat'
    },
    {
      title: 'Email Ticket',
      description: 'Open a formal support ticket for complex issues.',
      icon: Mail,
      color: 'blue',
      link: '/contact',
      action: 'Open Ticket'
    },
    {
      title: 'Phone Support',
      description: 'Available Mon-Fri, 9am - 6pm for priority members.',
      icon: Phone,
      color: 'amber',
      link: 'tel:+1234567890',
      action: 'Call Now'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="relative p-12 lg:p-16 rounded-[3rem] bg-white/5 border border-white/10 overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
              <LifeBuoy size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Support Center</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              How can we <span className="text-emerald-500 text-shadow-emerald">help you</span> today?
            </h1>
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-xl">
              Welcome to the CatShop Priority Support Hub. Our team of feline experts is standing by to assist with any questions or order concerns.
            </p>
          </div>
          <div className="w-full lg:w-72 aspect-square rounded-[2.5rem] bg-emerald-600 flex items-center justify-center relative shadow-2xl shadow-emerald-950/20 group-hover:scale-105 transition-transform duration-700">
            <MessageCircle size={80} className="text-white animate-pulse" />
            <div className="absolute inset-4 border-2 border-dashed border-white/20 rounded-[2rem]"></div>
          </div>
        </div>
      </div>

      {/* Support Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {supportChannels.map((channel, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-all group flex flex-col h-full"
          >
            <div className={`w-14 h-14 rounded-2xl bg-${channel.color}-500/10 flex items-center justify-center text-${channel.color}-400 mb-8 group-hover:scale-110 transition-transform`}>
              <channel.icon size={28} />
            </div>
            <h3 className="text-2xl font-black text-white mb-3">{channel.title}</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 flex-1">{channel.description}</p>
            <a 
              href={channel.link}
              className={`w-full py-4 rounded-xl bg-${channel.color}-600 hover:bg-${channel.color}-500 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2`}
            >
              {channel.action}
              <ArrowRight size={14} />
            </a>
          </motion.div>
        ))}
      </div>

      {/* FAQ Suggestion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-8 group">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
            <HelpCircle size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-white mb-1">Help Center & FAQ</h4>
            <p className="text-slate-500 text-sm font-medium">Browse our detailed guides and help articles.</p>
          </div>
          <ArrowRight size={20} className="text-slate-700 group-hover:text-white transition-colors" />
        </div>

        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-8 group">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
            <Zap size={32} />
          </div>
          <div className="flex-1">
            <h4 className="text-xl font-black text-white mb-1">Order Tracking</h4>
            <p className="text-slate-500 text-sm font-medium">Check the live status of your feline deliveries.</p>
          </div>
          <ArrowRight size={20} className="text-slate-700 group-hover:text-white transition-colors" />
        </div>
      </div>

      {/* Trust Footer */}
      <div className="flex flex-col md:flex-row items-center justify-between p-12 rounded-[2.5rem] bg-emerald-600/10 border border-emerald-500/20 gap-8">
        <div className="flex items-center gap-6 text-center md:text-left">
          <ShieldCheck size={48} className="text-emerald-400" />
          <div>
            <h4 className="text-white font-black text-xl uppercase tracking-tighter">Secure Support Journey</h4>
            <p className="text-emerald-400/70 text-sm font-medium">Your privacy and data security are our top priorities.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400">Live Status: Online</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSupport;
