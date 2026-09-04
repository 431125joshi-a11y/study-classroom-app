import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  MessageSquare,
  Moon,
  Sun,
  Timer,
  BookOpen,
  Sparkles,
  Database,
  Menu,
  Terminal,
  ShieldCheck,
  Link as LinkIcon,
  Copy,
  Check
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { useChat } from '../../context/ChatContext';

export function Navbar({ onToggleSidebar }) {
  const {
    searchQuery,
    setSearchQuery,
    darkMode,
    setDarkMode,
    setIsUploadModalOpen,
    setIsSubjectModalOpen,
    setIsDataBackupModalOpen,
    setIsUserProfileModalOpen,
    setIsGoogleAuthModalOpen,
    setIsDevModalOpen,
    developerMode,
    userProfile,
    currentView,
    setCurrentView,
    activeSubject,
  } = useStudyApp();

  const { isChatOpen, setIsChatOpen, unreadCount } = useChat();
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyJoinLink = () => {
    const link = `${window.location.origin}${window.location.pathname}?join=google`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Left: Brand & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 lg:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    EduStudy
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                    Hub
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Classroom & Study Spaces</p>
              </div>
            </button>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes, videos, PDFs, formulas in Science, Maths, SST..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions & User Info */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Share / Invite Link Button */}
            <button
              onClick={handleCopyJoinLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
              title="Copy Google Classroom Join Link for Classmates"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />}
              <span className="hidden lg:inline">{copiedLink ? 'Link Copied!' : 'Invite Classmate'}</span>
            </button>

            {/* Google Account Sign-In Trigger */}
            <button
              onClick={() => setIsGoogleAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs transition-all"
              title="Sign In with Google Account"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span className="hidden sm:inline">Google Login</span>
            </button>

            {/* Developer Studio Button */}
            <button
              onClick={() => {
                if (developerMode) {
                  setCurrentView('developer');
                } else {
                  setIsDevModalOpen(true);
                }
              }}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 ${
                developerMode
                  ? 'bg-amber-500/15 border-amber-400/50 text-amber-600 dark:text-amber-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Private Developer Studio"
            >
              <Terminal className="w-4 h-4" />
            </button>

            {/* Quick Upload Resource Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* Study Lounge Chatbox Toggle */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`relative p-2.5 rounded-xl border transition-all ${
                isChatOpen
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title="Open Study Lounge Chatbox"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && !isChatOpen && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Profile Avatar */}
            <button
              onClick={() => setIsUserProfileModalOpen(true)}
              className="flex items-center gap-2 pl-2 pr-1 sm:pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all text-left group"
              title="Edit Profile & Avatar"
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${userProfile.avatarGradient} text-white font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                {userProfile.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden lg:block">
                <p className="text-xs font-bold leading-none text-slate-800 dark:text-slate-200">{userProfile.name}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[90px]">{userProfile.role}</p>
              </div>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
