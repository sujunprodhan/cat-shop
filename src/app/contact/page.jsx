'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare, 
  Sparkles,
  Clock,
  CheckCircle2
} from 'lucide-react';
import Swal from 'sweetalert2';

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    await Swal.fire({
      icon: 'success',
      title: 'Message Sent!',
      text: 'Thank you for reaching out. We will get back to you shortly.',
      confirmButtonColor: '#10b981',
      background: '#020617',
      color: '#ffffff'
    });
    reset();
  };

  const contactInfo = [
    {
      title: 'Email Us',
      value: 'hello@catshop.com',
      description: 'Typical response within 24 hours',
      icon: Mail,
      color: 'emerald'
    },
    {
      title: 'Call Us',
      value: '+1 (555) CAT-LOVE',
      description: 'Mon-Fri from 9am to 6pm',
      icon: Phone,
      color: 'blue'
    },
    {
      title: 'Visit Us',
      value: '123 Feline Lane, Pet City',
      description: 'Experience our products in person',
      icon: MapPin,
      color: 'emerald'
    }
  ];

  return (
    <div className="relative min-h-screen py-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-500/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mb-20 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-6 py-2 rounded-full"
          >
            <Sparkles size={16} className="text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Contact Us</span>
          </motion.div>
          
          <h1 className="text-5xl lg:text-7xl font-black text-white tracking-tighter leading-tight">
            Have a Question? <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">
              We're Here to Help.
            </span>
          </h1>
          <p className="text-xl text-slate-400 font-medium leading-relaxed">
            Whether you need help with an order, have a product question, or just want to share a photo of your cat — we'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-8">
            <div className="grid grid-cols-1 gap-6">
              {contactInfo.map((info, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 rounded-[2rem] bg-white/5 backdrop-blur-3xl border border-white/10 hover:border-emerald-500/30 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${info.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <info.icon size={24} />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">{info.title}</h3>
                  <p className="text-white font-bold text-lg mb-1">{info.value}</p>
                  <p className="text-slate-500 text-sm font-medium">{info.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Availability Card */}
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
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 lg:p-16 rounded-[3rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-white mb-3">Send a Message</h2>
                  <p className="text-slate-400 font-medium">Fill out the form and we'll be in touch shortly.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        {...register('name', { required: 'Name is required' })}
                        placeholder="John Doe"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                      {errors.name && <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        {...register('email', { 
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                        })}
                        placeholder="name@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
                      />
                      {errors.email && <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subject</label>
                    <select 
                      {...register('subject')}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all appearance-none"
                    >
                      <option value="general" className="bg-slate-900">General Inquiry</option>
                      <option value="order" className="bg-slate-900">Order Support</option>
                      <option value="collaboration" className="bg-slate-900">Collaboration</option>
                      <option value="other" className="bg-slate-900">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Your Message</label>
                    <textarea 
                      {...register('message', { required: 'Message is required' })}
                      rows="5"
                      placeholder="Tell us how we can help..."
                      className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-white outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none"
                    ></textarea>
                    {errors.message && <p className="text-rose-500 text-[10px] font-black mt-1 ml-1">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full group relative bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white py-5 rounded-2xl font-black text-lg transition-all duration-300 shadow-2xl shadow-emerald-950/20 active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Send Message
                        <Send size={20} className="group-hover:translate-x-1.5 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Decorative Background for Form */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 blur-[100px] rounded-full"></div>
            </motion.div>
          </div>
        </div>

        {/* Success Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 text-center pb-20 border-b border-white/5">
          <div className="space-y-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-white font-black text-xl">Quick Response</h4>
            <p className="text-slate-500 text-sm font-medium">We aim to answer all inquiries within one business day.</p>
          </div>
          <div className="space-y-4">
            <MessageSquare className="w-10 h-10 text-blue-400 mx-auto" />
            <h4 className="text-white font-black text-xl">Expert Support</h4>
            <p className="text-slate-500 text-sm font-medium">Talk to cat lovers who actually know our products.</p>
          </div>
          <div className="space-y-4">
            <Sparkles className="text-emerald-400 w-10 h-10 mx-auto" />
            <h4 className="text-white font-black text-xl">Feedback Matters</h4>
            <p className="text-slate-500 text-sm font-medium">Your suggestions help us improve the CatShop experience.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
