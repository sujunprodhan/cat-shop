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

  // A user is "online" if their last message was within 5 minutes
  const isOnline = (lastActiveAt) => {
    if (!lastActiveAt) return false;
    return (Date.now() - new Date(lastActiveAt).getTime()) < 5 * 60 * 1000;
  };

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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-white tracking-tighter">Messages</h2>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 cursor-pointer transition-all">
              <MoreVertical size={20} />
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {loading ? (
            <div className="flex justify-center p-10 text-slate-500 animate-pulse font-bold">Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div className="text-center p-10 text-slate-600 font-bold">No conversations yet</div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => setActiveChat(conv)}
                className={`w-full p-3 rounded-2xl flex items-center gap-4 transition-all group ${activeChat?._id === conv._id ? 'bg-emerald-600/20 border border-emerald-500/30' : 'hover:bg-white/5 border border-transparent'}`}
              >
                <div className="relative flex-shrink-0">
                  {conv.senderImage ? (
                    <img src={conv.senderImage} alt="" referrerPolicy="no-referrer" className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-emerald-500/30 transition-all" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-emerald-400 border-2 border-transparent">
                      <User size={24} />
                    </div>
                  )}
                  {/* Online = green, Offline = gray */}
                  <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-slate-950 rounded-full shadow-lg transition-colors ${
                    isOnline(conv.lastActiveAt) 
                      ? 'bg-emerald-500 shadow-emerald-500/20' 
                      : 'bg-slate-600'
                  }`}></div>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className={`text-sm font-black truncate ${activeChat?._id === conv._id ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {conv.senderName}
                    </h4>
                    <span className={`text-[10px] font-bold flex-shrink-0 ml-2 ${activeChat?._id === conv._id ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {new Date(conv.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-xs truncate flex-1 ${activeChat?._id === conv._id ? 'text-emerald-100/70' : 'text-slate-500 font-medium'}`}>
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950/40 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-6 bg-slate-950/60 backdrop-blur-xl border-b border-white/5 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {activeChat.senderImage ? (
                    <img src={activeChat.senderImage} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                      <User size={24} />
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-white font-black text-lg tracking-tight">{activeChat.senderName}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      isOnline(activeChat.lastActiveAt) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'
                    }`}></div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${
                      isOnline(activeChat.lastActiveAt) ? 'text-emerald-400' : 'text-slate-500'
                    }`}>
                      {isOnline(activeChat.lastActiveAt) ? 'Active Now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"><Phone size={20} /></button>
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"><Video size={20} /></button>
                <div className="w-px h-6 bg-white/10 mx-2"></div>
                <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"><Info size={20} /></button>
              </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar relative z-10">
              {messages.map((msg, i) => {
                const isMe = msg.senderEmail === session.user.email;
                // Determine sender image for each message
                const senderImg = isMe
                  ? (session.user.image || null)        // admin's own image
                  : (msg.senderImage || null);           // user's image stored in message
                const senderInitial = isMe
                  ? (session.user.name || 'A').charAt(0).toUpperCase()
                  : (msg.senderName || 'U').charAt(0).toUpperCase();

                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {/* Left avatar — user's image */}
                    {!isMe && (
                      <div className="flex-shrink-0 mb-1">
                        {senderImg ? (
                          <img
                            src={senderImg}
                            alt={msg.senderName || ''}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover shadow-lg border border-white/10"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-black border border-white/10 shadow-lg">
                            {senderInitial}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[68%]`}>
                      <div className={`px-5 py-3.5 rounded-[1.8rem] text-sm font-medium leading-relaxed ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-xl shadow-emerald-950/20'
                          : 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-none'
                      }`}>
                        {msg.content}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 px-1">
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={12} className="text-emerald-500 opacity-50" />}
                      </div>
                    </div>

                    {/* Right avatar — admin's image */}
                    {isMe && (
                      <div className="flex-shrink-0 mb-1">
                        {senderImg ? (
                          <img
                            src={senderImg}
                            alt="Admin"
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover shadow-lg border-2 border-emerald-500/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-black border-2 border-emerald-500/30 shadow-lg">
                            {senderInitial}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Input Bar */}
            <div className="p-6 bg-slate-950/60 backdrop-blur-xl border-t border-white/5 relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button className="w-10 h-10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-colors"><ImageIcon size={20} /></button>
                  <button className="w-10 h-10 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/10 rounded-full transition-colors"><MessageSquare size={20} /></button>
                </div>
                <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-full px-5 py-1 focus-within:border-emerald-500/40 transition-all">
                  <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Aa" 
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white py-3 text-sm"
                  />
                </div>
                <button 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-emerald-600/20 flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 bg-emerald-500/5 rounded-full flex items-center justify-center text-emerald-500 relative"
            >
              <MessageSquare size={50} className="relative z-10" />
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping opacity-20"></div>
            </motion.div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-black text-white tracking-tight">Select a Conversation</h3>
              <p className="text-slate-500 font-medium max-w-[280px] mx-auto text-sm leading-relaxed">Choose a customer from the left panel to start a professional support session.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
