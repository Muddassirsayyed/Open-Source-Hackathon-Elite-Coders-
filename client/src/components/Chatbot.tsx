'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageCircle, X, Send, Sparkles, Loader2, Calendar, Flame, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  data?: any;
}

export default function Chatbot() {
  const { t } = useI18n();
  const { token } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'ai',
          text: t('chatbot_welcome'),
          timestamp: new Date()
        }
      ]);
    }
  }, [t, messages.length]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const quickPrompts = [
    { text: "I need a Plumber", label: "🔧 Plumber" },
    { text: "Short circuit electrical issue", label: "⚡ Electrician" },
    { text: "How does Emergency Mode work?", label: "🚨 Emergency" },
    { text: "What is the cost of AC repair?", label: "💰 Pricing" }
  ];

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();

      setIsTyping(false);

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'ai',
          text: data.reply,
          timestamp: new Date(),
          data: data.data // professionals array or trigger actions
        };
        setMessages(prev => [...prev, aiMsg]);

        // Process trigger actions
        if (data.action === 'open_emergency_mode') {
          setTimeout(() => {
            router.push('/booking?emergency=true');
            setIsOpen(false);
          }, 2000);
        }
      } else {
        throw new Error();
      }
    } catch (err) {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: "Sorry, I am having trouble connecting to the backend. Please check if the Express server is running on port 5005.",
          timestamp: new Date()
        }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-500 text-white flex items-center justify-center shadow-xl hover:shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
        title="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-950 flex items-center justify-center text-[10px] font-bold text-white animate-pulse">
            1
          </span>
        )}
      </button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-96 h-[500px] bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-w-[calc(100vw-2rem)]"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={18} className="animate-pulse" />
                <div>
                  <h3 className="text-sm font-bold">{t('chatbot_title')}</h3>
                  <p className="text-[10px] text-blue-100 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                    Online & Ready
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%]">
                    {/* Chat Bubble */}
                    <div
                      className={`px-3 py-2 rounded-2xl text-xs whitespace-pre-line leading-relaxed shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Meta/Time */}
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 block px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>

                    {/* Dynamic Professional Suggestions */}
                    {msg.sender === 'ai' && msg.data?.professionals && (
                      <div className="mt-3 space-y-2">
                        {msg.data.professionals.map((prof: any) => (
                          <div
                            key={prof.id}
                            className="bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-sm hover:scale-[1.02] transition-transform duration-200"
                          >
                            <div>
                              <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{prof.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Rating: ⭐ {prof.rating} ({prof.experience} yrs exp)
                              </p>
                            </div>
                            <button
                              onClick={() => {
                                router.push(`/booking?professionalId=${prof.id}&profession=${msg.data.profession}`);
                                setIsOpen(false);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-md flex items-center gap-1 cursor-pointer"
                            >
                              <Calendar size={10} />
                              Book
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-bl-none text-xs text-slate-500 flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin" />
                    Assistant is typing...
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/50 overflow-x-auto flex gap-1.5 scrollbar-none">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="flex-shrink-0 px-2.5 py-1 text-[10px] font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-full transition-all cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="p-3 border-t border-slate-200 dark:border-slate-850 flex gap-2 bg-white dark:bg-slate-900"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 rounded-xl transition-all cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
