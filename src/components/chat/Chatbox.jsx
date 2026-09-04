import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  Paperclip,
  Smile,
  Hash,
  Users,
  MessageSquare,
  Maximize2,
  Minimize2,
  Bot,
  Ban,
  GraduationCap
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useStudyApp } from '../../context/StudyAppContext';
import { MessageItem } from './MessageItem';

const QUICK_DOUBTS = [
  'Explain Ohm\'s law with formula',
  'Trigonometric identity shortcuts',
  'Nationalism in Europe key dates',
  'Quadratic equations discriminant rules',
];

export function Chatbox() {
  const {
    isChatOpen,
    setIsChatOpen,
    activeChannel,
    setActiveChannel,
    messages,
    sendMessage,
    toggleReaction,
    isBotTyping,
    setUnreadCount,
  } = useChat();

  const { subjects, resources, userProfile, setIsUserProfileModalOpen, users } = useStudyApp();

  const [inputMessage, setInputMessage] = useState('');
  const [selectedResourceToAttach, setSelectedResourceToAttach] = useState(null);
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Check if current user is banned
  const currentUserInDb = users.find(u => u.name === userProfile.name);
  const isBanned = userProfile.status === 'banned' || currentUserInDb?.status === 'banned';
  const isTeacher = userProfile.role === 'teacher' || currentUserInDb?.role === 'teacher';

  // Channels list: General Lounge + Enrolled Subjects
  const channels = [
    { id: 'general', name: 'general-lounge', label: '💬 General Study Lounge' },
    ...subjects.map(s => ({
      id: s.id,
      name: `${s.id}-doubts`,
      label: `${s.id === 'science' ? '🔬' : s.id === 'maths' ? '📐' : '🌍'} ${s.name} Doubts`,
    })),
  ];

  // Filter messages for current channel
  const channelMessages = messages.filter(m => m.channel === activeChannel);

  // Auto scroll to bottom
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [messages, isChatOpen, activeChannel, isBotTyping]);

  if (!isChatOpen) return null;

  const handleSend = (e) => {
    e?.preventDefault();
    if (isBanned) {
      alert('Your account is currently banned from sending messages.');
      return;
    }
    if (!inputMessage.trim() && !selectedResourceToAttach) return;

    sendMessage(inputMessage, selectedResourceToAttach);
    setInputMessage('');
    setSelectedResourceToAttach(null);
    setIsAttachMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`fixed z-50 transition-all duration-300 ${
      isExpanded
        ? 'inset-3 sm:inset-6'
        : 'bottom-4 right-4 sm:right-6 w-full max-w-lg h-[620px] max-h-[85vh]'
    }`}>
      
      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white">
                  Study Lounge & Doubt Solver
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-400">
                Peer discussions & 24/7 AI StudyBot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
              title={isExpanded ? 'Minimize' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Channel Switcher Bar */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 overflow-x-auto scrollbar-none flex-shrink-0">
          {channels.map(ch => (
            <button
              key={ch.id}
              onClick={() => setActiveChannel(ch.id)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeChannel === ch.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Hash className="w-3 h-3 opacity-60" />
              <span>{ch.name}</span>
            </button>
          ))}
        </div>

        {/* User Status Ribbon */}
        <div className="px-4 py-1.5 bg-indigo-50/50 dark:bg-indigo-950/30 border-b border-indigo-100 dark:border-indigo-950 flex items-center justify-between text-[11px] flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Posting as:</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              {userProfile.name}
              {isTeacher && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-md bg-purple-600 text-white">
                  TEACHER
                </span>
              )}
            </span>
          </div>
          <button
            onClick={() => setIsUserProfileModalOpen(true)}
            className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold"
          >
            Change Name / Avatar
          </button>
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-white dark:bg-slate-900">
          
          {channelMessages.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Bot className="w-10 h-10 mx-auto text-indigo-400" />
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Welcome to the #{activeChannel} discussion!
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Ask a question or tag <strong className="text-indigo-600 dark:text-indigo-400">@StudyBot</strong> for instant formulas & doubts.
                </p>
              </div>

              {/* Quick doubt triggers */}
              <div className="flex flex-wrap justify-center gap-1.5 max-w-sm mx-auto pt-2">
                {QUICK_DOUBTS.map((doubt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (isBanned) return;
                      setInputMessage(`@StudyBot ${doubt}`);
                      inputRef.current?.focus();
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                  >
                    ⚡ {doubt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            channelMessages.map(msg => (
              <MessageItem
                key={msg.id}
                message={msg}
                onToggleReaction={toggleReaction}
              />
            ))
          )}

          {/* AI Bot Typing Indicator */}
          {isBotTyping && (
            <div className="flex items-center gap-2 p-2 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 w-max">
              <div className="w-6 h-6 rounded-lg bg-cyan-500 text-white flex items-center justify-center text-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                StudyBot AI is thinking...
              </span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Banned Warning Banner */}
        {isBanned && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-900 flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-300">
            <Ban className="w-4 h-4 flex-shrink-0" />
            <span>Your account has been suspended by the classroom developer/teacher. You cannot post messages.</span>
          </div>
        )}

        {/* Selected Attached Resource Preview */}
        {!isBanned && selectedResourceToAttach && (
          <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 border-t border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                Attached: {selectedResourceToAttach.title}
              </span>
            </div>
            <button
              onClick={() => setSelectedResourceToAttach(null)}
              className="text-slate-400 hover:text-rose-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Attach Resource Dropdown Menu */}
        {!isBanned && isAttachMenuOpen && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Select Study Material to Attach:
            </p>
            {resources.map(res => (
              <button
                key={res.id}
                type="button"
                onClick={() => {
                  setSelectedResourceToAttach(res);
                  setIsAttachMenuOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-700 dark:text-slate-200 truncate flex items-center justify-between"
              >
                <span className="truncate">{res.title}</span>
                <span className="text-[10px] text-slate-400 ml-2">{res.type}</span>
              </button>
            ))}
          </div>
        )}

        {/* Bottom Message Input Composer */}
        {!isBanned && (
          <form onSubmit={handleSend} className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-end gap-2 flex-shrink-0">
            
            <button
              type="button"
              onClick={() => setIsAttachMenuOpen(!isAttachMenuOpen)}
              className={`p-2.5 rounded-xl border transition-colors ${
                isAttachMenuOpen || selectedResourceToAttach
                  ? 'bg-indigo-50 dark:bg-indigo-950 border-indigo-300 text-indigo-600'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
              title="Attach a study material"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${activeChannel} or ask @StudyBot...`}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-24"
              />
            </div>

            <button
              type="submit"
              disabled={!inputMessage.trim() && !selectedResourceToAttach}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/25 transition-all flex items-center justify-center flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
