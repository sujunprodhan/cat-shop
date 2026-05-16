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
      className="flex flex-col h-[550px] w-full max-w-[400px] bg-slate-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white">
            <Cat size={20} />
          </div>
          <div>
            <h3 className="text-white font-black text-sm tracking-tight">CatShop AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-100/70 uppercase tracking-widest">Always Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isHumanMode && (
            <button 
              onClick={() => {
                setIsHumanMode(true);
                setMessages([{ role: 'ai', content: "Connecting you to a human agent... please wait." }]);
              }}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-white transition-all flex items-center gap-2 border border-white/10"
            >
              <User size={12} />
              Talk to Agent
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg text-white transition-colors">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: msg.role === 'ai' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium leading-relaxed ${
              msg.role === 'ai' 
                ? 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none' 
                : 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-600/20'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-150"></div>
              <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-300"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-white/5 bg-slate-900/50">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-emerald-500/50 transition-all pr-14"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="absolute right-2 p-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white rounded-xl transition-all active:scale-90"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="mt-4 text-[9px] text-center text-slate-600 font-bold uppercase tracking-[0.2em]">
          Powered by CatShop Intelligence
        </p>
      </div>
    </motion.div>
  );
};

export default AIChatWindow;
