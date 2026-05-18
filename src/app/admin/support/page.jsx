'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Send, User, MessageSquare, MoreVertical,
  Phone, Video, Info, CheckCheck, Image as ImageIcon,
  FileText, Paperclip, X
} from 'lucide-react';
import { getAllConversations, getMessages, sendChatMessage, markMessagesAsRead } from '@/actions/server/chat';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/provider/ThemeProvider';

const AdminSupport = () => {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState('');
  const [loading, setLoading]             = useState(true);
  const [selectedFile, setSelectedFile]   = useState(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const scrollRef   = useRef(null);
  const fileInputRef = useRef(null);

  const { theme } = useTheme();
  const isDark = theme === 'night';

  /* ── Theme tokens ── */
  const pageBg     = isDark ? 'bg-slate-900/50 border-white/10'    : 'bg-white border-slate-200 shadow-xl';
  const sidebarBg  = isDark ? 'bg-slate-950/20 border-white/5'     : 'bg-slate-50 border-slate-200';
  const sidebarHdr = isDark ? 'border-white/5'  : 'border-slate-200';
  const headingTxt = isDark ? 'text-white'       : 'text-slate-900';
  const moreBtn    = isDark ? 'bg-white/5 text-slate-400 hover:bg-white/10'  : 'bg-slate-100 text-slate-500 hover:bg-slate-200';
  const searchCls  = isDark
    ? 'bg-white/5 border-white/10 text-white placeholder-slate-500 focus:border-emerald-500/50'
    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-400 shadow-sm';
  const searchIco  = isDark ? 'text-slate-500'   : 'text-slate-400';
  const loadingTxt = isDark ? 'text-slate-500'   : 'text-slate-400';
  const emptyTxt   = isDark ? 'text-slate-600'   : 'text-slate-400';

  // Conversation item
  const convActive  = isDark
    ? 'bg-emerald-600/20 border-emerald-500/30'
    : 'bg-emerald-50 border-emerald-400/40';
  const convHover   = isDark ? 'hover:bg-white/5 border-transparent'  : 'hover:bg-slate-100 border-transparent';
  const convAvatarBg = isDark ? 'bg-slate-800 text-emerald-400'       : 'bg-slate-200 text-emerald-600';
  const convOnlineBorder = isDark ? 'border-slate-950'  : 'border-white';
  const convName   = (active) => active
    ? (isDark ? 'text-white' : 'text-slate-900')
    : (isDark ? 'text-slate-200 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900');
  const convTime   = (active) => active
    ? 'text-emerald-400'
    : (isDark ? 'text-slate-500' : 'text-slate-400');
  const convLast   = (active) => active
    ? (isDark ? 'text-emerald-100/70' : 'text-emerald-700')
    : (isDark ? 'text-slate-500' : 'text-slate-500');

  // Chat area
  const chatAreaBg = isDark ? 'bg-slate-950/40'  : 'bg-slate-50';
  const chatHdrBg  = isDark ? 'bg-slate-950/60 border-white/5'  : 'bg-white border-slate-200 shadow-sm';
  const chatHdrNm  = isDark ? 'text-white'        : 'text-slate-900';
  const iconBtn    = isDark
    ? 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10'
    : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50';
  const divider    = isDark ? 'bg-white/10'       : 'bg-slate-200';

  // Bubbles
  const supportBubble = isDark
    ? 'bg-white/5 border border-white/10 text-slate-200'
    : 'bg-white border border-slate-200 text-slate-700 shadow-sm';
  const timeLbl    = isDark ? 'text-slate-600'    : 'text-slate-400';
  const avatarFallback = isDark ? 'bg-emerald-700 border-white/10 text-white' : 'bg-emerald-100 border-slate-200 text-emerald-700';
  const adminAvatarFallback = isDark ? 'bg-emerald-600 border-emerald-500/30 text-white' : 'bg-emerald-500 border-emerald-400 text-white';

  // Input bar
  const inputBarBg  = isDark ? 'bg-slate-950/60 border-white/5'   : 'bg-white border-slate-200 shadow-sm';
  const inputWrap   = isDark
    ? 'bg-white/5 border-white/10 focus-within:border-emerald-500/40'
    : 'bg-slate-100 border-slate-200 focus-within:border-emerald-400';
  const inputCls    = isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400';
  const iconBtnSm   = isDark ? 'text-emerald-500 hover:bg-emerald-500/10' : 'text-emerald-600 hover:bg-emerald-50';
  const fileChipBg  = isDark ? 'bg-slate-800 border-white/10'     : 'bg-slate-100 border-slate-200';
  const fileNameTxt = isDark ? 'text-white'   : 'text-slate-800';
  const fileSizeTxt = isDark ? 'text-slate-500' : 'text-slate-400';
  const fileRemove  = isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50';

  // Empty state
  const emptyHeading = isDark ? 'text-white'    : 'text-slate-900';
  const emptySubTxt  = isDark ? 'text-slate-500' : 'text-slate-500';

  /* ── Helpers ── */
  const isOnline = (lastActiveAt) => {
    if (!lastActiveAt) return false;
    return (Date.now() - new Date(lastActiveAt).getTime()) < 5 * 60 * 1000;
  };

  const filteredConversations = conversations.filter(c =>
    (c.senderName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.lastMessage || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ── Data fetching ── */
  useEffect(() => {
    const load = async () => {
      const data = await getAllConversations();
      setConversations(data);
      setLoading(false);
    };
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeChatId = activeChat?._id;

  useEffect(() => {
    if (!activeChatId) return;
    const loadMsgs = async () => {
      const data = await getMessages(activeChatId);
      setMessages(data);
      await markMessagesAsRead(activeChatId);
    };
    loadMsgs();
    const interval = setInterval(loadMsgs, 3000);
    return () => clearInterval(interval);
  }, [activeChatId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  /* ── File handling ── */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    setSelectedFile({ file, previewUrl: URL.createObjectURL(file), isImage, name: file.name, size: file.size });
    e.target.value = '';
  };

  /* ── Upload via server-side route ── */
  const uploadToImgbb = async (file) => {
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) return data.url;
      console.warn('Admin upload failed:', data);
    } catch (err) {
      console.error('Admin upload error:', err);
    }
    return null;
  };

  /* ── Send ── */
  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || !activeChat) return;
    const tempInput = input;
    const tempFile  = selectedFile;
    setInput('');
    setSelectedFile(null);

    // Upload file first
    let attachment = null;
    let livePreviewUrl = tempFile?.previewUrl || null;

    if (tempFile) {
      if (tempFile.isImage) {
        const uploaded = await uploadToImgbb(tempFile.file);
        if (uploaded) {
          livePreviewUrl = uploaded;
          attachment = { url: uploaded, name: tempFile.name, isImage: true };
        } else {
          attachment = { url: null, name: tempFile.name, isImage: true };
        }
      } else {
        attachment = { url: null, name: tempFile.name, isImage: false };
      }
    }

    const optimistic = {
      _id: `temp-${Date.now()}`,
      senderEmail:      session.user.email,
      senderName:       session.user.name,
      senderImage:      session.user.image,
      content:          tempInput || (tempFile ? `📎 ${tempFile.name}` : ''),
      attachmentUrl:    livePreviewUrl,
      attachmentName:   tempFile?.name    || null,
      attachmentIsImage: tempFile?.isImage ?? false,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    await sendChatMessage(
      tempInput || (tempFile ? `📎 ${tempFile.name}` : ''),
      activeChat._id,
      attachment
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  /* ── Loading guard ── */
  if (status === 'loading' || !session?.user) {
    return (
      <div className={`h-[calc(100vh-140px)] flex items-center justify-center backdrop-blur-xl border rounded-[2.5rem] ${pageBg}`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className={`font-bold text-sm uppercase tracking-widest ${loadingTxt}`}>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-[calc(100vh-140px)] flex backdrop-blur-xl border rounded-[2.5rem] overflow-hidden shadow-2xl ${pageBg}`}>

      {/* ── Sidebar ── */}
      <div className={`w-80 lg:w-96 border-r flex flex-col ${sidebarBg} ${sidebarHdr}`}>

        {/* Sidebar header */}
        <div className={`p-6 border-b space-y-4 ${sidebarHdr}`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-2xl font-black tracking-tighter ${headingTxt}`}>Messages</h2>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all ${moreBtn}`}>
              <MoreVertical size={20} />
            </div>
          </div>
          <div className="relative">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 ${searchIco}`} size={18} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full border rounded-full py-3 pl-12 pr-4 text-sm outline-none transition-all ${searchCls}`}
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {loading ? (
            <div className={`flex justify-center p-10 animate-pulse font-bold ${loadingTxt}`}>Loading chats...</div>
          ) : filteredConversations.length === 0 ? (
            <div className={`text-center p-10 font-bold ${emptyTxt}`}>No conversations yet</div>
          ) : (
            filteredConversations.map((conv) => {
              const active = activeChat?._id === conv._id;
              return (
                <button
                  key={conv._id}
                  onClick={() => setActiveChat(conv)}
                  className={`w-full p-3 rounded-2xl flex items-center gap-4 transition-all group border ${
                    active ? convActive : convHover
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    {conv.senderImage ? (
                      <img src={conv.senderImage} alt="" referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-transparent group-hover:border-emerald-500/30 transition-all" />
                    ) : (
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-transparent ${convAvatarBg}`}>
                        <User size={24} />
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 rounded-full shadow-lg transition-colors ${convOnlineBorder} ${
                      isOnline(conv.lastActiveAt) ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-slate-400'
                    }`} />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h4 className={`text-sm font-black truncate ${convName(active)}`}>{conv.senderName}</h4>
                      <span className={`text-[10px] font-bold flex-shrink-0 ml-2 ${convTime(active)}`}>
                        {new Date(conv.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className={`text-xs truncate flex-1 ${convLast(active)}`}>{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* ── Main Chat Area ── */}
      <div className={`flex-1 flex flex-col relative ${chatAreaBg}`}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className={`p-6 backdrop-blur-xl border-b flex items-center justify-between relative z-10 ${chatHdrBg}`}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  {activeChat.senderImage ? (
                    <img src={activeChat.senderImage} alt="" referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/20" />
                  ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${convAvatarBg}`}>
                      <User size={24} />
                    </div>
                  )}
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 rounded-full ${
                    isDark ? 'border-slate-950' : 'border-white'
                  } ${isOnline(activeChat.lastActiveAt) ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                </div>
                <div>
                  <h3 className={`font-black text-lg tracking-tight ${chatHdrNm}`}>{activeChat.senderName}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${isOnline(activeChat.lastActiveAt) ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isOnline(activeChat.lastActiveAt) ? 'text-emerald-400' : (isDark ? 'text-slate-500' : 'text-slate-400')}`}>
                      {isOnline(activeChat.lastActiveAt) ? 'Active Now' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconBtn}`}><Phone size={20} /></button>
                <button className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconBtn}`}><Video size={20} /></button>
                <div className={`w-px h-6 mx-2 ${divider}`} />
                <button className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${iconBtn}`}><Info size={20} /></button>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar relative z-10">
              {messages.map((msg, i) => {
                const isMe = msg.senderEmail === session.user.email;
                const senderImg = isMe ? (session.user.image || null) : (msg.senderImage || null);
                const senderInitial = isMe
                  ? (session.user.name || 'A').charAt(0).toUpperCase()
                  : (msg.senderName || 'U').charAt(0).toUpperCase();

                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                    {/* Left avatar */}
                    {!isMe && (
                      <div className="flex-shrink-0 mb-1">
                        {senderImg ? (
                          <img src={senderImg} alt={msg.senderName || ''} referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover shadow-lg border border-white/10" />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border shadow-lg ${avatarFallback}`}>
                            {senderInitial}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bubble */}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[68%]`}>
                      <div className={`px-5 py-3.5 rounded-[1.8rem] text-sm font-medium leading-relaxed overflow-hidden ${
                        isMe
                          ? 'bg-emerald-600 text-white rounded-br-none shadow-xl shadow-emerald-950/20'
                          : `rounded-bl-none ${supportBubble}`
                      }`}>
                        {/* ── Image attachment ── */}
                        {msg.attachmentUrl && msg.attachmentIsImage && (
                          <a href={msg.attachmentUrl} target="_blank" rel="noopener noreferrer" className="block mb-2">
                            <img
                              src={msg.attachmentUrl}
                              alt="attachment"
                              className="rounded-xl max-w-[220px] max-h-[200px] object-cover block hover:opacity-90 transition-opacity cursor-zoom-in"
                            />
                          </a>
                        )}
                        {/* ── Non-image file chip ── */}
                        {msg.attachmentName && !msg.attachmentIsImage && (
                          <div className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl ${
                            isMe ? 'bg-emerald-700/50' : (isDark ? 'bg-white/10' : 'bg-slate-100')
                          }`}>
                            <FileText size={16} className={isMe ? 'text-emerald-200' : 'text-blue-400'} />
                            <span className="text-xs font-bold truncate max-w-[150px]">{msg.attachmentName}</span>
                          </div>
                        )}
                        {/* ── Text content (skip pure 📎 label when image already shown) ── */}
                        {msg.content && !msg.content.startsWith('📎') && (
                          <span>{msg.content}</span>
                        )}
                        {msg.content?.startsWith('📎') && !msg.attachmentUrl && !msg.attachmentName && (
                          <span>{msg.content}</span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 px-1">
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${timeLbl}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isMe && <CheckCheck size={12} className="text-emerald-500 opacity-50" />}
                      </div>
                    </div>

                    {/* Right avatar */}
                    {isMe && (
                      <div className="flex-shrink-0 mb-1">
                        {senderImg ? (
                          <img src={senderImg} alt="Admin" referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover shadow-lg border-2 border-emerald-500/30" />
                        ) : (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 shadow-lg ${adminAvatarFallback}`}>
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
            <div className={`p-5 backdrop-blur-xl border-t relative z-10 ${inputBarBg}`}>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                onChange={handleFileChange}
              />

              {/* File preview chip */}
              <AnimatePresence>
                {selectedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className={`flex items-center gap-3 mb-3 px-4 py-2.5 rounded-2xl border ${fileChipBg}`}
                  >
                    {selectedFile.isImage ? (
                      <img src={selectedFile.previewUrl} alt="preview"
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/10" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                        <FileText size={18} className="text-blue-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold truncate ${fileNameTxt}`}>{selectedFile.name}</p>
                      <p className={`text-[10px] mt-0.5 ${fileSizeTxt}`}>{(selectedFile.size / 1024).toFixed(1)} KB · Ready to send</p>
                    </div>
                    <button onClick={() => setSelectedFile(null)} className={`p-1.5 rounded-full transition-colors ${fileRemove}`}>
                      <X size={14} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-3">
                {/* Quick action icons */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors relative ${iconBtnSm} ${selectedFile ? 'text-emerald-500' : ''}`}
                    title="Attach image"
                  >
                    <ImageIcon size={20} />
                    {selectedFile?.isImage && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors relative ${iconBtnSm} ${selectedFile && !selectedFile.isImage ? 'text-emerald-500' : ''}`}
                    title="Attach file"
                  >
                    <Paperclip size={20} />
                    {selectedFile && !selectedFile.isImage && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />}
                  </button>
                </div>

                {/* Input */}
                <div className={`flex-1 flex items-center border rounded-full px-5 py-1 transition-all ${inputWrap}`}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={selectedFile ? 'Add a caption...' : 'Aa'}
                    className={`flex-1 bg-transparent border-none focus:ring-0 py-3 text-sm outline-none ${inputCls}`}
                  />
                </div>

                {/* Send */}
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && !selectedFile)}
                  className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:text-slate-400 text-white flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-emerald-600/20 flex-shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Empty / select state */
          <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-32 h-32 bg-emerald-500/5 rounded-full flex items-center justify-center text-emerald-500 relative"
            >
              <MessageSquare size={50} className="relative z-10" />
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping opacity-20" />
            </motion.div>
            <div className="text-center space-y-3">
              <h3 className={`text-2xl font-black tracking-tight ${emptyHeading}`}>Select a Conversation</h3>
              <p className={`font-medium max-w-[280px] mx-auto text-sm leading-relaxed ${emptySubTxt}`}>
                Choose a customer from the left panel to start a professional support session.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSupport;
