'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { submitContactForm } from '@/actions/server/contact';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useTheme } from '@/provider/ThemeProvider';

const ContactPage = () => {
  const { data: session, status } = useSession();
  const { theme } = useTheme();
  const isDark = theme === 'night';

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { name: session?.user?.name || '', email: session?.user?.email || '' }
  });

  React.useEffect(() => {
    if (session?.user) reset({ name: session.user.name, email: session.user.email });
  }, [session, reset]);

  const swalBg    = isDark ? '#020617' : '#ffffff';
  const swalColor = isDark ? '#ffffff' : '#0f172a';

  const onSubmit = async (data) => {
    try {
      const res = await submitContactForm(data);
      if (res.success) {
        await Swal.fire({ icon: 'success', title: 'Message Sent!', text: res.message, confirmButtonColor: '#10b981', background: swalBg, color: swalColor });
        reset();
      } else {
        await Swal.fire({ icon: 'error', title: 'Oops...', text: res.message, confirmButtonColor: '#ef4444', background: swalBg, color: swalColor });
      }
    } catch {
      await Swal.fire({ icon: 'error', title: 'Error', text: 'An unexpected error occurred.', confirmButtonColor: '#ef4444', background: swalBg, color: swalColor });
    }
  };

  const contactInfo = [
    { title: 'Email Us', value: 'hello@catshop.com', description: 'Typical response within 24 hours', icon: Mail, color: 'emerald' },
    { title: 'Call Us', value: '+1 (555) CAT-LOVE', description: 'Mon-Fri from 9am to 6pm', icon: Phone, color: 'blue' },
    { title: 'Visit Us', value: '123 Feline Lane, Pet City', description: 'Experience our products in person', icon: MapPin, color: 'emerald' },
  ];

  /* ── Theme tokens ── */
  const heading    = isDark ? 'text-white'    : 'text-slate-900';
  const subText    = isDark ? 'text-slate-400' : 'text-slate-600';
  const muted      = isDark ? 'text-slate-500' : 'text-slate-400';
  const cardBg     = isDark ? 'bg-white/5 border-white/10 hover:border-emerald-500/30' : 'bg-white border-slate-200 hover:border-emerald-400/50 shadow-md';
  const cardValue  = isDark ? 'text-white'    : 'text-slate-800';
  const formBg     = isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200 shadow-xl';
  const inputCls   = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/5'
    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:ring-emerald-500/10';
  const labelCls   = isDark ? 'text-slate-500' : 'text-slate-500';
  const selectCls  = isDark
    ? 'bg-white/5 border-white/10 text-white focus:border-emerald-500/50 focus:ring-emerald-500/5'
    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-emerald-400 focus:ring-emerald-500/10';
  const optBg      = isDark ? 'bg-slate-900' : 'bg-white';
  const borderGrid = isDark ? 'border-white/5' : 'border-slate-200';

  return (
    <div className="relative min-h-screen py-20 overflow-hidden">
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="max-w-3xl mb-20 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full"
          >
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Contact Us</span>
          </motion.div>

          <h1 className={`text-5xl lg:text-7xl font-black tracking-tighter leading-tight ${heading}`}>
            Have a Question? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              We're Here to Help.
            </span>
          </h1>
          <p className={`text-xl font-medium leading-relaxed ${subText}`}>
            Whether you need help with an order, have a product question, or just want to share a photo of your cat — we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* ── Left: Contact Cards ── */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-8 rounded-[2rem] backdrop-blur-3xl border transition-all group ${cardBg}`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${info.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <info.icon size={24} />
                  </div>
                  <h3 className={`text-xl font-black mb-2 ${heading}`}>{info.title}</h3>
                  <p className={`font-bold text-lg mb-1 ${cardValue}`}>{info.value}</p>
                  <p className={`text-sm font-medium ${muted}`}>{info.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Availability Card — always colorful */}
            <div className="p-8 rounded-[2rem] bg-emerald-600 relative overflow-hidden group shadow-2xl shadow-emerald-950/20">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-emerald-100 font-black uppercase tracking-[0.2em] text-[10px]">
                  <Clock size={14} /> Live Support
                </div>
                <h3 className="text-2xl font-black text-white">Always Available</h3>
                <p className="text-emerald-100/80 font-medium leading-relaxed">
                  Our dedicated team of cat experts is ready to assist you via chat or email, ensuring your experience is seamless.
                </p>
              </div>
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-10 lg:p-16 rounded-[3rem] backdrop-blur-3xl border relative overflow-hidden ${formBg}`}
            >
              <div className="relative z-10">
                <div className="mb-12">
                  <h2 className={`text-3xl font-black mb-3 ${heading}`}>Send a Message</h2>
                  <p className={`font-medium ${subText}`}>Fill out the form and we'll be in touch shortly.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="relative space-y-6">
                  {/* Auth overlay */}
                  {status === 'unauthenticated' && (
                    <div className="absolute inset-0 z-50 backdrop-blur-md bg-slate-950/60 rounded-3xl flex flex-col items-center justify-center p-6 text-center">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                        <Mail size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Sign In Required</h3>
                      <p className="text-slate-400 text-sm mb-6 max-w-[250px]">Please log in to your account to send us a message.</p>
                      <Link href="/login?callbackUrl=/contact" className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95">
                        LOGIN TO CONTACT
                      </Link>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${labelCls}`}>Full Name</label>
                      <input
                        {...register('name', { required: 'Name is required' })}
                        placeholder="Your Name"
                        readOnly
                        className={`w-full border rounded-2xl px-6 py-4 cursor-not-allowed outline-none transition-all opacity-80 ${inputCls}`}
                      />
                      {errors.name && <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${labelCls}`}>Email Address</label>
                      <input
                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                        placeholder="your@email.com"
                        readOnly
                        className={`w-full border rounded-2xl px-6 py-4 cursor-not-allowed outline-none transition-all opacity-80 ${inputCls}`}
                      />
                      {errors.email && <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${labelCls}`}>Subject</label>
                    <select
                      {...register('subject')}
                      className={`w-full border rounded-2xl px-6 py-4 outline-none transition-all appearance-none ${selectCls}`}
                    >
                      <option value="general" className={optBg}>General Inquiry</option>
                      <option value="order" className={optBg}>Order Support</option>
                      <option value="collaboration" className={optBg}>Collaboration</option>
                      <option value="other" className={optBg}>Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[10px] font-black uppercase tracking-widest ml-1 ${labelCls}`}>Your Message</label>
                    <textarea
                      {...register('message', { required: 'Message is required' })}
                      rows="5"
                      placeholder="Tell us how we can help..."
                      className={`w-full border rounded-3xl px-6 py-4 outline-none transition-all resize-none ${inputCls}`}
                    />
                    {errors.message && <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || status === 'unauthenticated'}
                    className="w-full group relative bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800/50 disabled:cursor-not-allowed text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send Message <Send size={20} className="group-hover:translate-x-1.5 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </button>
                </form>
              </div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full" />
            </motion.div>
          </div>
        </div>

        {/* ── Bottom Grid ── */}
        <div className={`mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-20 border-b ${borderGrid}`}>
          <div className="space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className={`font-black text-xl ${heading}`}>Quick Response</h4>
            <p className={`text-sm font-medium ${muted}`}>We aim to answer all inquiries within one business day.</p>
          </div>
          <div className="space-y-4">
            <MessageSquare className="w-10 h-10 text-blue-400 mx-auto" />
            <h4 className={`font-black text-xl ${heading}`}>Expert Support</h4>
            <p className={`text-sm font-medium ${muted}`}>Talk to cat lovers who actually know our products.</p>
          </div>
          <div className="space-y-4">
            <Sparkles className="text-emerald-400 w-10 h-10 mx-auto" />
            <h4 className={`font-black text-xl ${heading}`}>Feedback Matters</h4>
            <p className={`text-sm font-medium ${muted}`}>Your suggestions help us improve the CatShop experience.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
