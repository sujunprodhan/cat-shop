'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Sparkles, X, Minimize2, Cat, MessageSquare } from 'lucide-react';
import { getAIResponse } from '@/actions/server/aiChat';
import { getMessages, sendChatMessage } from '@/actions/server/chat';
import { useSession } from 'next-auth/react';

const AIChatWindow = ({ onClose }) => {
  const { data: session } = useSession();
  const [isHumanMode, setIsHumanMode] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'ai', content: "Hi there! 🐾 I'm your CatShop AI. Ask me anything about our products or your orders!" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  // Load human chat messages if mode is enabled
  useEffect(() => {
    if (isHumanMode && session?.user?.email) {
      const loadMessages = async () => {
        const data = await getMessages(session.user.email);
        if (data.length > 0) {
          const formatted = data.map(m => ({
            role: m.senderEmail === session.user.email ? 'user' : 'ai',
            content: m.content
          }));
          setMessages(formatted);
        }
      };
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [isHumanMode, session]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    const tempInput = input;
    setInput('');

    if (isHumanMode) {
      await sendChatMessage(tempInput);
      return;
    }

    setIsTyping(true);
    try {
      const res = await getAIResponse(tempInput, messages);
      if (res.success) {
        setMessages(prev => [...prev, { role: 'ai', content: res.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'ai', content: "Oops! My whiskers got tangled. Could you repeat that?" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: "Error connecting to my brain. Check your internet!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="flex flex-col h-[600px] w-full max-w-[420px] bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-slate-950/60 backdrop-blur-md p-6 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 border-2 border-white/5">
              <Cat size={22} />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg"></div>
          </div>
          <div>
            <h3 className="text-white font-black text-sm tracking-tight">CatShop {isHumanMode ? 'Agent' : 'AI'}</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isHumanMode && session?.role !== 'admin' && (
            <button 
              onClick={() => {
                setIsHumanMode(true);
                setMessages([{ role: 'ai', content: "Connecting you to a human agent... please wait." }]);
              }}
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full text-slate-300 transition-all border border-white/10"
              title="Talk to Agent"
            >
              <User size={18} />
            </button>
          )}
          <button onClick={onClose} className="p-2.5 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-full text-slate-300 transition-all border border-white/10">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        {messages.map((msg, i) => {
          const isAI = msg.role === 'ai';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isAI ? 'justify-start' : 'justify-end'} items-end gap-2`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 border border-white/5 flex-shrink-0 mb-1">
                  <Cat size={14} />
                </div>
              )}
              <div className={`max-w-[75%] p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                isAI 
                  ? 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none' 
                  : 'bg-emerald-600 text-white rounded-br-none shadow-lg shadow-emerald-600/20'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          );
        })}
        {isTyping && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 border border-white/5 flex-shrink-0">
              <Cat size={14} />
            </div>
            <div className="bg-white/5 border border-white/10 p-4 rounded-[1.5rem] rounded-bl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-slate-950/60 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-1 focus-within:border-emerald-500/40 transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Aa"
              className="w-full bg-transparent border-none focus:ring-0 text-white py-3 text-sm"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-11 h-11 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-full transition-all active:scale-90 shadow-lg shadow-emerald-600/20 flex items-center justify-center flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-4 text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.2em] pointer-events-none">
          Live Support Active
        </p>
      </div>
    </motion.div>
  );
};

export default AIChatWindow;
