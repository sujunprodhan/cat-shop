import React from 'react';
import { Truck, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Truck size={32} />,
      title: 'Global Express',
      desc: 'Fastest delivery to your doorstep within 48 hours.',
      color: 'emerald'
    },
    {
      icon: <ShieldCheck size={32} />,
      title: 'Vet Verified',
      desc: '100% genuine and safe products for your pets.',
      color: 'blue'
    },
    {
      icon: <CreditCard size={32} />,
      title: 'Secure Pay',
      desc: 'Bank-level encrypted payment processing.',
      color: 'indigo'
    },
    {
      icon: <Sparkles size={32} />,
      title: 'Luxury Choice',
      desc: 'Handpicked premium items for royal comfort.',
      color: 'amber'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="group p-8 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
            >
              <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-lg`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-black text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-slate-500 text-sm font-bold leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
