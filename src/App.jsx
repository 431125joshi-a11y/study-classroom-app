import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SubjectCard } from './components/subjects/SubjectCard';
import { SubjectDetail } from './components/subjects/SubjectDetail';
import { SubjectModal } from './components/subjects/SubjectModal';
import { UploadModal } from './components/resources/UploadModal';
import { MediaViewerModal } from './components/resources/MediaViewerModal';
import { Chatbox } from './components/chat/Chatbox';
import { UserProfileModal } from './components/chat/UserProfileModal';
import { DataBackupModal } from './components/settings/DataBackupModal';
import { PomodoroTimer } from './components/tools/PomodoroTimer';
import { FlashcardDeck } from './components/tools/FlashcardDeck';
import { TaskTracker } from './components/tools/TaskTracker';
import { ResourceList } from './components/resources/ResourceList';
import { useStudyApp } from './context/StudyAppContext';
import { useChat } from './context/ChatContext';
import {
  Plus,
  Sparkles,
  BookOpen,
  CheckSquare,
  Timer,
  MessageSquare,
  Search,
  Upload,
  Layers,
  ArrowRight,
  FolderOpen
} from 'lucide-react';

export function App() {
  const {
    subjects,
    currentView,
    setCurrentView,
    resources,
    tasks,
    searchQuery,
    setIsUploadModalOpen,
    setIsSubjectModalOpen,
    userProfile,
  } = useStudyApp();

  const { openChatWithChannel } = useChat();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pendingTasks = tasks.filter(t => !t.completed);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 min-w-0">
          
          {/* VIEW 1: Dashboard (Google Classroom Home) */}
          {currentView === 'dashboard' && (
            <div className="space-y-8">
              
              {/* Welcome Hero Banner */}
              <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white shadow-card">
                <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-indigo-200">
                      Welcome back, {userProfile.name}! 👋
                    </span>
                    <span className="text-xs text-indigo-200/80 hidden sm:inline">
                      {userProfile.statusText}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
                    Your Collaborative Classroom & Study Spaces
                  </h1>

                  <p className="text-xs sm:text-sm text-indigo-100/80 leading-relaxed max-w-xl">
                    Access Science, Mathematics, and Social Studies study spaces. Upload and organize notes, PDFs, videos from WhatsApp, and review with interactive tools.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-white text-indigo-950 font-bold text-xs hover:bg-slate-100 transition-all flex items-center gap-2 shadow-sm active:scale-95"
                    >
                      <Upload className="w-4 h-4 text-indigo-600" />
                      <span>Upload Material</span>
                    </button>

                    <button
                      onClick={() => openChatWithChannel('general')}
                      className="px-4 py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-700 text-white font-bold text-xs transition-all flex items-center gap-2 border border-indigo-500/40"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-300" />
                      <span>Study Lounge</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Global Search Results If Searching */}
              {searchQuery ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Search className="w-5 h-5 text-indigo-600" />
                      <span>Search Results for "{searchQuery}"</span>
                    </h2>
                  </div>
                  <ResourceList resources={resources} />
                </div>
              ) : (
                <>
                  {/* Subject Spaces Grid */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                          Classroom Subject Spaces
                        </h2>
                        <p className="text-xs text-slate-400">
                          Organized curriculum spaces with dedicated upload streams & notes
                        </p>
                      </div>

                      <button
                        onClick={() => setIsSubjectModalOpen(true)}
                        className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Subject</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {subjects.map(subject => (
                        <SubjectCard key={subject.id} subject={subject} />
                      ))}
                    </div>
                  </div>

                  {/* Split Section: Recent Activity & Quick Tools */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
                    
                    {/* Recent Uploads Across All Subjects */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-indigo-600" />
                          <span>Latest Classroom Materials</span>
                        </h2>
                      </div>
                      <ResourceList resources={resources.slice(0, 6)} hideHeader={true} />
                    </div>

                    {/* Quick Homework / Tasks Tracker Widget */}
                    <div className="space-y-6">
                      <TaskTracker />
                      
                      {/* Study Buddy AI Card */}
                      <div className="p-5 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-800/40 space-y-3">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                          <Sparkles className="w-5 h-5" />
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                            StudyBot 24/7 Companion
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          Stuck on a tricky math equation or science definition? Ask StudyBot in the live lounge for instant step-by-step help!
                        </p>
                        <button
                          onClick={() => openChatWithChannel('general')}
                          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Open Live Study Chat</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </>
              )}

            </div>
          )}

          {/* VIEW 2: Subject Detail View */}
          {currentView === 'subject' && <SubjectDetail />}

          {/* VIEW 3: Study Focus Tools (Pomodoro) */}
          {currentView === 'tools' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                  <Timer className="w-6 h-6 text-indigo-600" />
                  <span>Pomodoro Focus Timer</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Boost your study productivity with the 25/5 interval technique
                </p>
              </div>
              <PomodoroTimer />
            </div>
          )}

          {/* VIEW 4: Flashcards */}
          {currentView === 'flashcards' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <FlashcardDeck />
            </div>
          )}

          {/* VIEW 5: Tasks / Assignments */}
          {currentView === 'tasks' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center justify-center gap-2">
                  <CheckSquare className="w-6 h-6 text-emerald-600" />
                  <span>Homework & Assignment Manager</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Keep track of due dates, test preparations, and daily study goals
                </p>
              </div>
              <TaskTracker />
            </div>
          )}

        </main>
      </div>

      {/* Global Modals & Overlays */}
      <UploadModal />
      <SubjectModal />
      <MediaViewerModal />
      <UserProfileModal />
      <DataBackupModal />
      <Chatbox />

    </div>
  );
}
