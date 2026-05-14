'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, Sparkles, Users, Award, Cat } from 'lucide-react';
import Image from 'next/image';

const AboutPage = () => {
  const stats = [
    { label: 'Happy Cats', value: '10k+', icon: Cat },
    { label: 'Products', value: '500+', icon: Sparkles },
    { label: 'Reviews', value: '4.9/5', icon: Award },
    { label: 'Community', value: '25k+', icon: Users },
  ];

  const values = [
    {
      title: 'Premium Quality',
      description: 'We curate only the finest products that meet the highest standards of safety and comfort.',
      icon: Award,
    },
    {
      title: 'Pet Wellness',
      description: 'Everything we do is centered around the health and happiness of your feline companions.',
      icon: Heart,
    },
    {
      title: 'Trust & Safety',
      description: 'Your trust is our priority. We ensure secure transactions and reliable delivery every time.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="relative min-h-screen py-20 overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center space-y-8 mb-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full"
          >
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Our Story</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[1.1]"
          >
            Passion for Cats, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              Driven by Quality.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            At CATSHOP, we believe every cat deserves a life of luxury and care. We are more than just a store; we are a community dedicated to the well-being of your feline family.
          </motion.p>
        </div>

        {/* Story & Image Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=2000" 
                alt="Cat Story"
                className="w-full aspect-[4/5] object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </motion.div>
          
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-white tracking-tight">How We Started</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Founded in 2024, CATSHOP began with a simple observation: finding truly high-quality, safe, and aesthetic products for cats was harder than it should be. Our founder, a life-long cat lover, set out to create a destination where quality was never compromised.
              </p>
              <p className="text-lg text-slate-400 leading-relaxed">
                Today, we source products from around the globe, ensuring that everything from our silk beds to our organic treats meets the "CatShop Standard" — a benchmark for excellence in the pet industry.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/10">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <stat.icon size={20} />
                    <span className="text-3xl font-black text-white">{stat.value}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight">Our Core Values</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">The pillars of our community</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-8 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                  <value.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{value.title}</h3>
                <p className="text-slate-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="mt-32 p-16 rounded-[4rem] bg-gradient-to-br from-emerald-600 to-blue-700 relative overflow-hidden text-center space-y-8"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter">Ready to join the family?</h2>
            <p className="text-emerald-50 text-xl max-w-xl mx-auto font-medium">
              Start providing your cat with the premium life they deserve. Explore our collection today.
            </p>
            <div className="pt-10">
              <button className="px-12 py-5 bg-white text-emerald-700 font-black rounded-2xl hover:bg-emerald-50 transition-all text-lg shadow-2xl">
                Explore Products
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default AboutPage;
