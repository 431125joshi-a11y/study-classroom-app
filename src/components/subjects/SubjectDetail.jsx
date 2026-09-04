import React, { useState } from 'react';
import {
  FlaskConical,
  Calculator,
  Globe,
  Laptop,
  BookMarked,
  ArrowLeft,
  Plus,
  Pin,
  Sparkles,
  MessageSquare,
  BookOpen,
  CheckSquare,
  Layers,
  Filter,
  Share2,
  FolderOpen
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { useChat } from '../../context/ChatContext';
import { ResourceList } from '../resources/ResourceList';
import { FlashcardDeck } from '../tools/FlashcardDeck';
import { TaskTracker } from '../tools/TaskTracker';

const ICON_MAP = {
  FlaskConical,
  Calculator,
  Globe,
  Laptop,
  BookMarked,
};

export function SubjectDetail() {
  const {
    activeSubject,
    setCurrentView,
    subjectActiveTab,
    setSubjectActiveTab,
    resources,
    setIsUploadModalOpen,
    tasks,
    flashcards
  } = useStudyApp();

  const { openChatWithChannel } = useChat();

  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedType, setSelectedType] = useState('all');

  if (!activeSubject) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No subject selected.</p>
        <button
          onClick={() => setCurrentView('dashboard')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Go back to Dashboard
        </button>
      </div>
    );
  }

  const IconComponent = ICON_MAP[activeSubject.icon] || BookMarked;

  // Filter resources for this subject
  const subjectResources = resources.filter(r => r.subjectId === activeSubject.id);
  const pinnedResources = subjectResources.filter(r => r.pinned);

  // Subject tasks & flashcards
  const subjectTasks = tasks.filter(t => t.subjectId === activeSubject.id);
  const subjectFlashcards = flashcards.filter(fc => fc.subjectId === activeSubject.id);

  // Topics list
  const topicsList = ['All', ...(activeSubject.topics || [])];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Back Button & Navigation Path */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>All Subjects</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openChatWithChannel(activeSubject.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 shadow-sm transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
            <span>Open {activeSubject.name} Doubts</span>
          </button>
        </div>
      </div>

      {/* Main Subject Banner (Google Classroom Header) */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-tr ${activeSubject.gradient} text-white shadow-card flex flex-col justify-between min-h-[190px]`}
      >
        {/* Background Decorative Element */}
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none transform translate-x-4 translate-y-4">
          <IconComponent className="w-64 h-64" />
        </div>
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Badges */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-black/25 backdrop-blur-md border border-white/20">
              {activeSubject.code}
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
              {activeSubject.room || 'Main Hall'}
            </span>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
            <span>Upload New Material</span>
          </button>
        </div>

        {/* Bottom Banner Content */}
        <div className="relative z-10 mt-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight drop-shadow-sm">
            {activeSubject.name}
          </h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-white/90 font-medium">
            <span>Teacher: <strong className="text-white font-bold">{activeSubject.teacher}</strong></span>
            <span>•</span>
            <span>{subjectResources.length} Study Materials</span>
            <span>•</span>
            <span>{activeSubject.topics?.length || 0} Chapters / Units</span>
          </div>
        </div>
      </div>

      {/* Google Classroom Sub-Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800">
        <nav className="flex space-x-6 sm:space-x-8">
          {[
            { id: 'stream', label: 'Stream / Feed', icon: Layers },
            { id: 'classwork', label: 'Classwork & Resources', icon: FolderOpen, badge: subjectResources.length },
            { id: 'tools', label: 'Flashcards & Practice', icon: BookOpen, badge: subjectFlashcards.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = subjectActiveTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubjectActiveTab(tab.id)}
                className={`py-3.5 px-1 border-b-2 font-bold text-sm flex items-center gap-2 transition-all relative ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab 1: Stream (Announcements, Pinned Formulas, Quick Activity) */}
      {subjectActiveTab === 'stream' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Quick Class Announcement & Upcoming Deadlines */}
          <div className="space-y-6 lg:order-2">
            
            {/* Quick Share / Upload Box */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                Class Action
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Post study material</p>
                  <p className="text-[11px] text-slate-400">PDFs, videos, links or photos</p>
                </div>
              </button>
            </div>

            {/* Upcoming Homework / Tasks for this subject */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-500" />
                  <span>Subject Homework</span>
                </h3>
                <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {subjectTasks.filter(t => !t.completed).length} pending
                </span>
              </div>

              {subjectTasks.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">No assignments due right now. Woohoo! 🎉</p>
              ) : (
                <div className="space-y-2.5">
                  {subjectTasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5"
                    >
                      <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${task.completed ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-snug ${task.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                          {task.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Due: {task.dueDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Doubt solver bot banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-200/60 dark:border-indigo-800/40">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">24/7 AI Peer Help</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                Have a doubt in {activeSubject.name}? Chat with classmates and StudyBot in the live lounge!
              </p>
              <button
                onClick={() => openChatWithChannel(activeSubject.id)}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all text-center shadow-sm"
              >
                Join {activeSubject.name} Chatroom
              </button>
            </div>

          </div>

          {/* Right Column: Pinned Notes & Activity Stream */}
          <div className="lg:col-span-2 space-y-6 lg:order-1">
            
            {/* Pinned Important Materials */}
            {pinnedResources.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  <Pin className="w-3.5 h-3.5" />
                  <span>Pinned Master Cheatsheets & Formula Notes</span>
                </div>
                <ResourceList resources={pinnedResources} hideHeader={true} />
              </div>
            )}

            {/* Recent Materials Stream */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Recent Stream Activity
                </h2>
                <button
                  onClick={() => setSubjectActiveTab('classwork')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                >
                  View all in Classwork →
                </button>
              </div>

              {subjectResources.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-6">
                  <FolderOpen className="w-12 h-12 mx-auto text-slate-400 mb-3 opacity-60" />
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No materials uploaded yet</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Upload your first PDF notes, YouTube video tutorial, WhatsApp study links, or diagrams!
                  </p>
                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
                  >
                    Upload Now
                  </button>
                </div>
              ) : (
                <ResourceList resources={subjectResources.slice(0, 5)} hideHeader={true} />
              )}
            </div>

          </div>

        </div>
      )}

      {/* Tab 2: Classwork & Resources (Categorized by Topics/Chapters + Filter Chips) */}
      {subjectActiveTab === 'classwork' && (
        <div className="space-y-6">
          
          {/* Chapter / Topic Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex-shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Chapter:
            </span>
            {topicsList.map(topic => (
              <button
                key={topic}
                onClick={() => setSelectedTopic(topic)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTopic === topic
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Type Filter Chips (All, PDFs, Videos, Presentations, Links, Photos) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex-shrink-0">
              Type:
            </span>
            {[
              { id: 'all', label: 'All Formats' },
              { id: 'pdf', label: '📄 PDFs' },
              { id: 'video', label: '🎥 Videos' },
              { id: 'presentation', label: '📊 Presentations' },
              { id: 'link', label: '🔗 Links & Web' },
              { id: 'photo', label: '🖼️ Photos & Files' },
            ].map(typeItem => (
              <button
                key={typeItem.id}
                onClick={() => setSelectedType(typeItem.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedType === typeItem.id
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {typeItem.label}
              </button>
            ))}
          </div>

          {/* Filtered Resource List */}
          <ResourceList
            resources={subjectResources.filter(r => {
              const matchTopic = selectedTopic === 'All' || r.topic === selectedTopic;
              const matchType = selectedType === 'all' || r.type === selectedType;
              return matchTopic && matchType;
            })}
          />

        </div>
      )}

      {/* Tab 3: Study Tools & Flashcards for this Subject */}
      {subjectActiveTab === 'tools' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FlashcardDeck initialSubjectId={activeSubject.id} />
          </div>
          <div>
            <TaskTracker subjectFilter={activeSubject.id} />
          </div>
        </div>
      )}

    </div>
  );
}
