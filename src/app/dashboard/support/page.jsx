'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Cat, ShieldCheck, Smile, Paperclip,
  CheckCheck, LifeBuoy, Sparkles, X, ImageIcon, FileText
} from 'lucide-react';
import { getMessages, sendChatMessage, markMessagesAsRead } from '@/actions/server/chat';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/provider/ThemeProvider';

const SUPPORT_NAME = 'CatShop Support';

const DashboardSupport = () => {
  const { data: session, status } = useSession();
  const [messages, setMessages]       = useState([]);
  const [input, setInput]             = useState('');
  const [sending, setSending]         = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);   // { file, previewUrl, isImage }
  const scrollRef   = useRef(null);
  const fileInputRef = useRef(null);
  const { theme } = useTheme();
  const isDark = theme === 'night';

  /* ── Theme tokens ── */
  const headerBg   = isDark
    ? 'bg-slate-900/60 border-white/10'
    : 'bg-white border-slate-200 shadow-sm';
  const headerName = isDark ? 'text-white'    : 'text-slate-900';
  const msgAreaBg  = isDark
    ? 'bg-slate-950/40 border-white/5'
    : 'bg-slate-50 border-slate-200';
  const inputBarBg = isDark
    ? 'bg-slate-900/60 border-white/10'
    : 'bg-white border-slate-200 shadow-sm';
  const inputWrap  = isDark
    ? 'bg-white/5 border-white/10 focus-within:border-emerald-500/40'
    : 'bg-slate-100 border-slate-200 focus-within:border-emerald-400';
  const inputCls   = isDark ? 'text-white'    : 'text-slate-900';
  const iconMuted  = isDark ? 'text-slate-500' : 'text-slate-400';
  const footerTxt  = isDark ? 'text-slate-700' : 'text-slate-400';
  const statusLbl  = isDark ? 'text-slate-500' : 'text-slate-400';
  const onlineChip = isDark
    ? 'bg-white/5 border-white/10 text-slate-400'
    : 'bg-slate-100 border-slate-200 text-slate-500';
  const welcomeH   = isDark ? 'text-white'    : 'text-slate-900';
  const welcomeP   = isDark ? 'text-slate-500' : 'text-slate-500';
  /* support bubble (left) */
  const supportBubble = isDark
    ? 'bg-white/5 border border-white/10 text-slate-200'
    : 'bg-white border border-slate-200 text-slate-700 shadow-sm';
  const timeLbl = isDark ? 'text-slate-600' : 'text-slate-400';
  const avatarFallback = isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-200 border-slate-300 text-slate-700';

  const userEmail = session?.user?.email;

  useEffect(() => {
    if (!userEmail) return;
    const load = async () => {
      const data = await getMessages(userEmail);
      setMessages(data);
      await markMessagesAsRead(userEmail);
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, [userEmail]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isImage = file.type.startsWith('image/');
    const previewUrl = URL.createObjectURL(file);
    setSelectedFile({ file, previewUrl, isImage, name: file.name, size: file.size });
    e.target.value = '';
  };

  // Upload file via our server-side API route (avoids CORS issues with imgbb)
  const uploadToImgbb = async (file) => {
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) return data.url;
      console.warn('Upload failed:', data);
    } catch (err) {
      console.error('Upload error:', err);
    }
    return null;
  };

  const handleSend = async () => {
    if ((!input.trim() && !selectedFile) || sending) return;
    setSending(true);

    const tempContent = input;
    const tempFile    = selectedFile;
    setInput('');
    setSelectedFile(null);

    // ── Upload file first (real permanent URL) ──
    let attachment = null;
    let livePreviewUrl = tempFile?.previewUrl || null;

    if (tempFile) {
      if (tempFile.isImage) {
        // Upload image to imgbb → get permanent URL
        const uploaded = await uploadToImgbb(tempFile.file);
        if (uploaded) {
          livePreviewUrl = uploaded;
          attachment = { url: uploaded, name: tempFile.name, isImage: true };
        } else {
          // fallback: use filename only
          attachment = { url: null, name: tempFile.name, isImage: true };
        }
      } else {
        // Non-image file: no imgbb (not an image), store name only
        attachment = { url: null, name: tempFile.name, isImage: false };
      }
    }

    // ── Optimistic UI update (uses live previewUrl) ──
    const optimistic = {
      _id: `temp-${Date.now()}`,
      senderEmail:      session?.user?.email,
      senderName:       session?.user?.name,
      senderImage:      session?.user?.image,
      content:          tempContent || (tempFile ? `📎 ${tempFile.name}` : ''),
      attachmentUrl:    livePreviewUrl,
      attachmentName:   tempFile?.name    || null,
      attachmentIsImage: tempFile?.isImage ?? false,
      createdAt: new Date().toISOString(),
      status: 'sent',
    };
    setMessages(prev => [...prev, optimistic]);

    // ── Persist to DB with real attachment URL ──
    await sendChatMessage(
      tempContent || (tempFile ? `📎 ${tempFile.name}` : ''),
      'admin',
      attachment
    );
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const userImage = session?.user?.image;
  const userName  = session?.user?.name || 'You';

  if (status === 'loading') {
    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <p className={`font-bold text-sm uppercase tracking-widest ${statusLbl}`}>Loading support...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user) {
    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className={`font-black text-xl ${welcomeH}`}>Please log in to access support.</p>
        </div>
      </div>
    );
  }

  if (session?.role === 'admin') {
    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <ShieldCheck size={32} className="text-rose-500" />
          </div>
          <p className={`font-black text-xl ${welcomeH}`}>Admins Cannot Use User Support</p>
          <p className={`text-sm max-w-sm mx-auto leading-relaxed ${welcomeP}`}>
            You are logged in as an administrator. Please navigate to the Admin Dashboard to read and reply to customer messages.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col">

      {/* ── Header ── */}
      <div className={`flex items-center gap-4 p-6 backdrop-blur-xl border rounded-t-[2.5rem] border-b flex-shrink-0 ${headerBg}`}>
        <div className="relative">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20 border-2 border-emerald-500/30">
            <Cat size={26} className="text-white" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-slate-950 rounded-full shadow-lg shadow-emerald-500/30" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className={`font-black text-lg tracking-tight ${headerName}`}>{SUPPORT_NAME}</h2>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Active Now · Typically replies in minutes</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
          <Sparkles size={14} className="text-emerald-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Support</span>
        </div>
      </div>

      {/* ── Messages Area ── */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-6 py-8 space-y-6 custom-scrollbar backdrop-blur-md border-x relative ${msgAreaBg}`}
      >
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

        {/* Welcome state */}
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
              <h3 className={`text-xl font-black tracking-tight ${welcomeH}`}>Start a Conversation</h3>
              <p className={`text-sm font-medium leading-relaxed ${welcomeP}`}>
                Send us a message and our support team will get back to you as soon as possible.
              </p>
            </div>
            <div className={`flex items-center gap-3 border px-5 py-3 rounded-full text-sm font-medium ${onlineChip}`}>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Team is online and ready to help
            </div>
          </motion.div>
        )}

        {/* Message Bubbles */}
        {messages.map((msg, i) => {
          const isMe = msg.senderEmail === session?.user?.email;
          const senderImg     = msg.senderImage || null;
          const senderInitial = (msg.senderName || 'U').charAt(0).toUpperCase();

          return (
            <motion.div
              key={msg._id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-end gap-2 relative z-10 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {/* Left avatar — support */}
              {!isMe && (
                <div className="flex-shrink-0 mb-1">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-2 border-slate-900 shadow-lg">
                    <Cat size={16} className="text-white" />
                  </div>
                </div>
              )}

              {/* Bubble */}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className={`px-5 py-3.5 text-sm font-medium leading-relaxed shadow-lg overflow-hidden ${
                  isMe
                    ? 'bg-emerald-600 text-white rounded-[1.5rem] rounded-br-md shadow-emerald-950/30'
                    : `rounded-[1.5rem] rounded-bl-md ${supportBubble}`
                }`}>
                  {/* Image attachment */}
                  {msg.attachmentUrl && msg.attachmentIsImage && (
                    <img
                      src={msg.attachmentUrl}
                      alt="attachment"
                      className="rounded-xl mb-2 max-w-[220px] max-h-[200px] object-cover block"
                    />
                  )}
                  {/* Non-image file chip */}
                  {msg.attachmentName && !msg.attachmentIsImage && (
                    <div className={`flex items-center gap-2 mb-2 px-3 py-2 rounded-xl ${
                      isMe ? 'bg-emerald-700/50' : isDark ? 'bg-white/10' : 'bg-slate-100'
                    }`}>
                      <FileText size={16} className={isMe ? 'text-emerald-200' : 'text-blue-400'} />
                      <span className="text-xs font-bold truncate max-w-[150px]">{msg.attachmentName}</span>
                    </div>
                  )}
                  {/* Text content */}
                  {msg.content && !msg.content.startsWith('📎') && (
                    <span>{msg.content}</span>
                  )}
                  {/* Pure attachment label */}
                  {msg.content?.startsWith('📎') && !msg.attachmentUrl && (
                    <span>{msg.content}</span>
                  )}
                </div>
                <div className={`mt-1.5 flex items-center gap-1.5 px-1 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${timeLbl}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && <CheckCheck size={11} className="text-emerald-500 opacity-60" />}
                </div>
              </div>

              {/* Right avatar — user */}
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
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm border-2 shadow-lg ${avatarFallback}`}>
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
      <div className={`p-5 backdrop-blur-xl border rounded-b-[2.5rem] border-t flex-shrink-0 ${inputBarBg}`}>

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
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0,  scale: 1 }}
              exit={{ opacity: 0, y: 6,    scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className={`flex items-center gap-3 mb-3 px-4 py-2.5 rounded-2xl border ${
                isDark ? 'bg-slate-800 border-white/10' : 'bg-slate-100 border-slate-200'
              }`}
            >
              {/* Thumbnail or icon */}
              {selectedFile.isImage ? (
                <img
                  src={selectedFile.previewUrl}
                  alt="preview"
                  className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-white/10"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <FileText size={18} className="text-blue-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {selectedFile.name}
                </p>
                <p className={`text-[10px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready to send
                </p>
              </div>
              <button
                onClick={() => setSelectedFile(null)}
                className={`p-1.5 rounded-full transition-colors ${
                  isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                }`}
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">

          {/* User avatar */}
          <div className="flex-shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border-2 border-white/10 shadow-lg"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${avatarFallback}`}>
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Input wrapper */}
          <div className={`flex-1 flex items-center gap-2 border rounded-full px-5 py-2.5 transition-all ${inputWrap}`}>
            <button
              type="button"
              className={`hover:text-emerald-500 transition-colors flex-shrink-0 ${iconMuted}`}
            >
              <Smile size={20} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={selectedFile ? 'Add a caption (optional)...' : 'Message Support...'}
              className={`flex-1 bg-transparent border-none focus:ring-0 outline-none text-sm py-1 ${inputCls}`}
            />
            {/* Paperclip — opens file picker */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`hover:text-emerald-500 transition-colors flex-shrink-0 relative ${
                selectedFile ? 'text-emerald-500' : iconMuted
              }`}
              title="Attach file"
            >
              <Paperclip size={18} />
              {selectedFile && (
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
              )}
            </button>
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !selectedFile) || sending}
            className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:text-slate-400 text-white flex items-center justify-center flex-shrink-0 transition-all active:scale-90 shadow-lg shadow-emerald-600/20"
          >
            <Send size={18} className={sending ? 'animate-pulse' : ''} />
          </button>
        </div>

        <p className={`text-center text-[9px] font-bold uppercase tracking-[0.2em] mt-3 pointer-events-none ${footerTxt}`}>
          End-to-end encrypted · CatShop Support
        </p>
      </div>
    </div>
  );
};

export default DashboardSupport;
