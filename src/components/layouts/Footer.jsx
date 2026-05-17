'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Sparkles, ArrowRight, Send } from 'lucide-react';
import { useTheme } from '@/provider/ThemeProvider';

const FacebookIcon  = (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>);
const InstagramIcon = (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>);
const TwitterIcon   = (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>);
const YoutubeIcon   = (p) => (<svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.42 5.58a2.78 2.78 0 0 0 1.94 2c1.71.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.42-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>);

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'night';
  const currentYear = new Date().getFullYear();

  /* ── Theme tokens ── */
  const wrapBg   = isDark
    ? 'bg-white/5 border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]'
    : 'bg-white border-slate-200 shadow-xl';
  const brandTxt = isDark ? 'text-white'    : 'text-slate-900';
  const bodyTxt  = isDark ? 'text-slate-400' : 'text-slate-500';
  const headTxt  = isDark ? 'text-white'    : 'text-slate-700';
  const linkCls  = isDark ? 'text-slate-400 hover:text-emerald-400' : 'text-slate-500 hover:text-emerald-600';
  const socialBg = isDark
    ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-emerald-500 hover:text-white hover:border-emerald-500'
    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-emerald-500 hover:text-white hover:border-emerald-500';
  const iconBg   = isDark ? 'bg-emerald-500/10' : 'bg-emerald-50';
  const inputCls = isDark
    ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50 focus:ring-emerald-500/5'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-400 focus:ring-emerald-400/10';
  const borderT  = isDark ? 'border-white/5' : 'border-slate-200';
  const bottomTxt = isDark ? 'text-slate-500' : 'text-slate-400';
  const bottomLink = isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700';

  return (
    <div className={`relative mt-20 mb-10 overflow-hidden rounded-[3rem] backdrop-blur-3xl border ${wrapBg}`}>
      {/* Glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Sparkles className="text-white" size={24} />
              </div>
              <span className={`text-3xl font-black tracking-tighter ${brandTxt}`}>
                CAT<span className="text-emerald-400">SHOP</span>
              </span>
            </Link>
            <p className={`leading-relaxed text-sm max-w-xs ${bodyTxt}`}>
              Elevating the lives of our feline friends with premium products, expert advice, and a community that cares. Join the family today.
            </p>
            <div className="flex items-center gap-4">
              {[FacebookIcon, InstagramIcon, TwitterIcon, YoutubeIcon].map((Icon, i) => (
                <Link key={i} href="#" className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-300 ${socialBg}`}>
                  <Icon className="w-[18px] h-[18px]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className={`font-black text-xs uppercase tracking-[0.3em] ml-1 ${headTxt}`}>Explore</h4>
            <ul className="space-y-4">
              {['New Arrivals', 'Best Sellers', 'Cat Food', 'Accessories', 'Toys'].map((item) => (
                <li key={item}>
                  <Link href="#" className={`transition-colors flex items-center group ${linkCls}`}>
                    <ArrowRight size={12} className="mr-2 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className={`font-black text-xs uppercase tracking-[0.3em] ml-1 ${headTxt}`}>Connect</h4>
            <ul className="space-y-5">
              {[
                { icon: MapPin, text: '123 Feline Lane, Pet City, PC 45678' },
                { icon: Mail,   text: 'hello@catshop.com' },
                { icon: Phone,  text: '+1 (555) CAT-LOVE' },
              ].map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className={`mt-1 w-8 h-8 rounded-lg flex items-center justify-center text-emerald-500 shrink-0 ${iconBg}`}>
                    <Icon size={16} />
                  </div>
                  <span className={`text-sm ${bodyTxt}`}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-8">
            <h4 className={`font-black text-xs uppercase tracking-[0.3em] ml-1 ${headTxt}`}>Newsletter</h4>
            <div className="space-y-4">
              <p className={`text-sm ${bodyTxt}`}>Stay updated with exclusive deals and cat care tips.</p>
              <form className="relative group">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className={`w-full border rounded-2xl px-5 py-4 text-sm outline-none focus:ring-4 transition-all ${inputCls}`}
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all flex items-center justify-center shadow-lg"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-20 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 ${borderT}`}>
          <p className={`text-xs font-bold uppercase tracking-widest ${bottomTxt}`}>
            © {currentYear} CATSHOP PREMIUM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} href="#" className={`text-xs font-bold uppercase tracking-widest transition-colors ${bottomLink}`}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;