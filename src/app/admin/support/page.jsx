'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  User, 
  MessageSquare, 
  MoreVertical, 
  Phone, 
  Video,
  Info,
  CheckCheck,
  Image as ImageIcon
} from 'lucide-react';
import { getAllConversations, getMessages, sendChatMessage } from '@/actions/server/chat';
import { useSession } from 'next-auth/react';

const AdminSupport = () => {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  // Load all conversations
  useEffect(() => {
    const loadData = async () => {
      const data = await getAllConversations();
      setConversations(data);
      setLoading(false);
    };
    loadData();
    const interval = setInterval(loadData, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, []);

  // Load messages for active chat
  useEffect(() => {
    if (activeChat) {
      const loadMessages = async () => {
        const data = await getMessages(activeChat._id);
        setMessages(data);
      };
      loadMessages();
      const interval = setInterval(loadMessages, 3000); // Polling every 3s
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeChat) return;
    const tempInput = input;
    setInput('');
    const res = await sendChatMessage(tempInput, activeChat._id);
    if (res.success) {
      setMessages(prev => [...prev, res.message]);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      
      {/* Sidebar: Conversations List */}
      <div className="w-80 lg:w-96 border-r border-white/5 flex flex-col bg-slate-950/20">
        <div className="p-6 border-b border-white/5 space-y-4">
          <h2 className="text-2xl font-black text-white tracking-tighter">Messages</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {loading ? (
            <div className="flex justify-center p-10 text-slate-500 animate-pulse font-bold">Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-10 text-slate-600 font-bold">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setActiveChat(conv)}
                className={`w-full p-4 rounded-[1.5rem] flex items-center gap-4 transition-all group ${activeChat?._id === conv._id ? 'bg-emerald-600 shadow-xl shadow-emerald-600/20' : 'hover:bg-white/5'}`}
              >
                <div className="relative">
                  {conv.senderImage ? (
                    <img src={conv.senderImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                      <User size={20} />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className={`text-sm font-black truncate ${activeChat?._id === conv._id ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {conv.senderName}
                    </h4>
                    <span className={`text-[10px] font-bold ${activeChat?._id === conv._id ? 'text-emerald-100' : 'text-slate-500'}`}>
                      {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${activeChat?._id === conv._id ? 'text-emerald-100/70' : 'text-slate-500 font-medium'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && activeChat?._id !== conv._id && (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-[10px] font-black text-white flex items-center justify-center">
                    {conv.unreadCount}
                  </div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-slate-950/40 backdrop-blur-md border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="text-white font-black">{activeChat.senderName}</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Now</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Phone size={20} /></button>
                <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Video size={20} /></button>
                <div className="w-px h-6 bg-white/10 mx-2"></div>
                <button className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Info size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => {
                const isMe = msg.senderEmail === session.user.email;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <div className={`px-5 py-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${isMe ? 'bg-emerald-600 text-white rounded-tr-none shadow-xl shadow-emerald-950/20' : 'bg-white/5 border border-white/10 text-slate-300 rounded-tl-none'}`}>
                        {msg.content}
                      </div>
                      <div className="mt-2 flex items-center gap-2 px-1">
                        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={14} className="text-emerald-500 opacity-50" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="p-8 bg-slate-950/40 backdrop-blur-md border-t border-white/5">
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-[1.5rem] p-2 pr-4 transition-all focus-within:border-emerald-500/50">
                <div className="flex gap-1 pl-2">
                  <button className="p-3 text-slate-500 hover:text-emerald-400 transition-colors"><ImageIcon size={20} /></button>
                  <button className="p-3 text-slate-500 hover:text-emerald-400 transition-colors"><MessageSquare size={20} /></button>
                </div>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Aa" 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white py-4 text-sm"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-12 h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-emerald-600/20"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6 opacity-50">
            <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-500">
              <MessageSquare size={40} />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-black text-white mb-2">Select a Conversation</h3>
              <p className="text-slate-500 font-medium">Choose a customer from the left to start chatting.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
