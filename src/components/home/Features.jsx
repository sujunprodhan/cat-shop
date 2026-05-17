'use client';

import React from 'react';
import { Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';

const Features = () => {
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const features = [
    { icon: <Truck size={32} />, title: 'Global Express', desc: 'Fastest delivery to your doorstep within 48 hours.' },
    { icon: <ShieldCheck size={32} />, title: 'Vet Verified', desc: '100% genuine and safe products for your pets.' },
    { icon: <CreditCard size={32} />, title: 'Secure Pay', desc: 'Bank-level encrypted payment processing.' },
    { icon: <Sparkles size={32} />, title: 'Luxury Choice', desc: 'Handpicked premium items for royal comfort.' },
  ];

  const cardBg   = isDark ? 'bg-white/5 border-white/10 hover:border-emerald-500/30'   : 'bg-white border-slate-200 hover:border-emerald-400/50 shadow-lg';
  const iconBg   = isDark ? 'bg-white/5 text-emerald-400'                               : 'bg-emerald-50 text-emerald-600';
  const titleCls = isDark ? 'text-white'    : 'text-slate-900';
  const descCls  = isDark ? 'text-slate-500' : 'text-slate-500';

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div
              key={i}
              className={`group p-8 rounded-[2.5rem] backdrop-blur-3xl border hover:-translate-y-2 transition-all duration-500 ${cardBg}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg ${iconBg}`}>
                {f.icon}
              </div>
              <h3 className={`text-xl font-black mb-3 tracking-tight ${titleCls}`}>{f.title}</h3>
              <p className={`text-sm font-bold leading-relaxed ${descCls}`}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
