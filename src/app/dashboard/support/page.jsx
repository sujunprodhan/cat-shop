'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  Cat,
  ShieldCheck,
  Smile,
  Paperclip,
  CheckCheck,
  LifeBuoy,
  Sparkles
} from 'lucide-react';
import { getMessages, sendChatMessage } from '@/actions/server/chat';
import { useSession } from 'next-auth/react';

const SUPPORT_NAME = 'CatShop Support';
const SUPPORT_AVATAR = null; // no image — use icon fallback

const DashboardSupport = () => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  // Poll messages every 3s
  useEffect(() => {
    if (!session?.user?.email) return;
    const load = async () => {
      const data = await getMessages(session.user.email);
      setMessages(data);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [session]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const tempContent = input;
    setInput('');

    // Optimistic UI update
    const optimisticMsg = {
      _id: `temp-${Date.now()}`,
      senderEmail: session?.user?.email,
      senderName: session?.user?.name,
      senderImage: session?.user?.image,
      content: tempContent,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    setMessages(prev => [...prev, optimisticMsg]);

    await sendChatMessage(tempContent);
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const userImage = session?.user?.image;
  const userName = session?.user?.name || 'You';

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">

      {/* ── Top Header Bar ── */}
      <div className="flex items-center gap-4 p-6 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-t-[2.5rem] border-b border-white/5 flex-shrink-0">
        {/* Support Avatar */}
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 border-2 border-emerald-500/30">
            <Cat size={26} className="text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg shadow-emerald-500/30"></div>
        </div>

        {/* Support Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-white font-black text-lg tracking-tight">{SUPPORT_NAME}</h2>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Now · Typically replies in minutes</span>
          </div>
        </div>

        {/* Right badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Support</span>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar bg-slate-950/40 backdrop-blur-md border-x border-white/5 relative"
      >
        {/* subtle bg texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        {/* Welcome message if no messages yet */}
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 space-y-6 relative z-10"
          >
            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-2xl shadow-emerald-500/10">
              <LifeBuoy size={44} className="text-emerald-400" />
            </div>
            <div className="text-center space-y-2 max-w-sm">
              <h3 className="text-xl font-black text-white tracking-tight">Start a Conversation</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                Send us a message and our support team will get back to you as soon as possible.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-3 rounded-full text-sm text-slate-400 font-medium">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              Team is online and ready to help
            </div>
          </motion.div>
        )}

        {/* Message Bubbles */}
        {messages.map((msg, i) => {
          const isMe = msg.senderEmail === session?.user?.email;
          // Use the image stored in the message itself for accuracy
          const senderImg = msg.senderImage || null;
          const senderInitial = (msg.senderName || 'U').charAt(0).toUpperCase();

          return (
            <motion.div
              key={msg._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end gap-2 relative z-10 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Left avatar — support agent (Cat icon) */}
              {!isMe && (
                <div className="flex-shrink-0 mb-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-2 border-slate-900 shadow-lg">
                    <Cat size={16} className="text-white" />
                  </div>
                </div>
              )}

              {/* Bubble */}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div
                  className={`px-5 py-3.5 text-sm font-medium leading-relaxed shadow-lg ${
                    isMe
                      ? 'bg-emerald-600 text-white rounded-[1.5rem] rounded-br-md shadow-emerald-950/30'
                      : 'bg-white/5 border border-white/10 text-slate-200 rounded-[1.5rem] rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
                <div className={`mt-1.5 flex items-center gap-1.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <CheckCheck size={11} className="text-emerald-500 opacity-60" />}
                </div>
              </div>

              {/* Right avatar — the user's own profile image from the message */}
              {isMe && (
                <div className="flex-shrink-0 mb-1">
                  {senderImg ? (
                    <img
                      src={senderImg}
                      alt={msg.senderName || 'You'}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500/30 shadow-lg"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-white font-black text-sm border-2 border-slate-600 shadow-lg">
                      {senderInitial}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── Input Bar ── */}
      <div className="p-5 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-b-[2.5rem] border-t border-white/5 flex-shrink-0">
        <div className="flex items-center gap-3">

          {/* User avatar in input bar */}
          <div className="flex-shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/10 shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-black text-sm border-2 border-slate-600">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Input wrapper */}
          <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 focus-within:border-emerald-500/40 transition-all">
            <button className="text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0">
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Support..."
              className="flex-1 bg-transparent border-none focus:ring-0 outline-none text-white text-sm py-1"
            />
            <button className="text-slate-500 hover:text-emerald-400 transition-colors flex-shrink-0">
              <Paperclip size={18} />
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white flex items-center justify-center flex-shrink-0 transition-all active:scale-90 shadow-lg shadow-emerald-600/20"
          >
            <Send size={18} className={sending ? 'animate-pulse' : ''} />
          </button>
        </div>

        <p className="text-center text-[9px] text-slate-700 font-bold uppercase tracking-[0.2em] mt-3 pointer-events-none">
          End-to-end encrypted · CatShop Support
        </p>
      </div>
    </div>
  );
};

export default DashboardSupport;
