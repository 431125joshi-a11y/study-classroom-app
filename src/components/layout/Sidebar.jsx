import React from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Calculator,
  Globe,
  Plus,
  Timer,
  BookOpen,
  CheckSquare,
  MessageSquare,
  Sparkles,
  BookMarked,
  X,
  Laptop
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { useChat } from '../../context/ChatContext';

const ICON_MAP = {
  FlaskConical,
  Calculator,
  Globe,
  Laptop,
  BookMarked,
};

export function Sidebar({ isOpen, onClose }) {
  const {
    subjects,
    activeSubjectId,
    selectSubject,
    currentView,
    setCurrentView,
    setIsSubjectModalOpen,
    resources,
    tasks
  } = useStudyApp();

  const { openChatWithChannel } = useChat();

  const handleNavClick = (view, subjectId = null) => {
    if (view === 'subject' && subjectId) {
      selectSubject(subjectId);
    } else {
      setCurrentView(view);
    }
    if (onClose) onClose();
  };

  const getSubjectResourceCount = (subId) => {
    return resources.filter(r => r.subjectId === subId).length;
  };

  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between py-5 px-3 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1">
          
          {/* Main Navigation */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Menu
              </span>
              <button
                onClick={onClose}
                aria-label="Close sidebar navigation"
                className="lg:hidden p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Classroom Dashboard</span>
              </button>
            </nav>
          </div>

          {/* Subjects Section */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Enrolled Subjects
              </span>
              <button
                onClick={() => {
                  setIsSubjectModalOpen(true);
                  if (onClose) onClose();
                }}
                className="p-1 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-400 transition-colors"
                title="Add New Subject"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <nav className="space-y-1">
              {subjects.map((sub) => {
                const IconComponent = ICON_MAP[sub.icon] || BookMarked;
                const isSelected = currentView === 'subject' && activeSubjectId === sub.id;
                const count = getSubjectResourceCount(sub.id);

                return (
                  <button
                    key={sub.id}
                    onClick={() => handleNavClick('subject', sub.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${sub.gradient} text-white flex items-center justify-center flex-shrink-0 shadow-sm`}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{sub.name}</span>
                    </div>
                    {count > 0 && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 font-medium">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Study Tools Section */}
          <div>
            <div className="px-3 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Study Tools
              </span>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => handleNavClick('tools')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'tools'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <Timer className="w-4 h-4 text-rose-500" />
                <span>Pomodoro Focus Timer</span>
              </button>

              <button
                onClick={() => handleNavClick('flashcards')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'flashcards'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>Smart Flashcards</span>
              </button>

              <button
                onClick={() => handleNavClick('tasks')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentView === 'tasks'
                    ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  <span>Homework & Tasks</span>
                </div>
                {pendingTasksCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                    {pendingTasksCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  openChatWithChannel('general');
                  if (onClose) onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 transition-all"
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-indigo-500" />
                  <span>Study Lounge Chat</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400">
                  Live
                </span>
              </button>
            </nav>
          </div>

        </div>

        {/* Bottom Quick Help Tip Card */}
        <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/50 dark:border-indigo-800/40">
          <div className="flex items-center gap-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Study Assistant</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            Need formula or doubt explanations? Tag <span className="font-semibold text-indigo-600 dark:text-indigo-400">@StudyBot</span> in chat!
          </p>
        </div>

      </aside>
    </>
  );
}
