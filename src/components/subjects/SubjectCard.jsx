import React from 'react';
import {
  FlaskConical,
  Calculator,
  Globe,
  Laptop,
  BookMarked,
  ArrowRight,
  Plus,
  FileText,
  Video,
  ExternalLink,
  MoreVertical,
  MessageSquare
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

export function SubjectCard({ subject }) {
  const { selectSubject, resources, setIsUploadModalOpen, tasks } = useStudyApp();
  const { openChatWithChannel } = useChat();

  const IconComponent = ICON_MAP[subject.icon] || BookMarked;

  // Filter resources and pending tasks for this subject
  const subjectResources = resources.filter(r => r.subjectId === subject.id);
  const pdfCount = subjectResources.filter(r => r.type === 'pdf').length;
  const videoCount = subjectResources.filter(r => r.type === 'video').length;
  const pendingTasks = tasks.filter(t => t.subjectId === subject.id && !t.completed).length;

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-hover transition-all duration-300 overflow-hidden flex flex-col justify-between hover:-translate-y-1">
      
      {/* Top Banner Header (Google Classroom Style) */}
      <div
        onClick={() => selectSubject(subject.id)}
        className={`relative h-36 p-5 bg-gradient-to-tr ${subject.gradient} text-white cursor-pointer overflow-hidden flex flex-col justify-between`}
      >
        {/* Decorative Background Glow and Patterns */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />
        <div className="absolute right-4 top-4 text-white/20 group-hover:text-white/30 transition-colors">
          <IconComponent className="w-20 h-20 -mr-4 -mt-4 opacity-50 rotate-12" />
        </div>

        {/* Top Info */}
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/20">
              {subject.code}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
            {subject.room || 'Online'}
          </span>
        </div>

        {/* Subject Title & Teacher */}
        <div className="relative z-10">
          <h3 className="text-xl font-extrabold tracking-tight drop-shadow-sm group-hover:underline decoration-white/60 underline-offset-4">
            {subject.name}
          </h3>
          <p className="text-xs text-white/85 font-medium mt-0.5">
            {subject.teacher}
          </p>
        </div>
      </div>

      {/* Card Content & Stats */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Description */}
        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
          {subject.description}
        </p>

        {/* Materials Summary Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <FileText className="w-3.5 h-3.5 text-rose-500" />
            <span>{pdfCount} PDFs</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300">
            <Video className="w-3.5 h-3.5 text-blue-500" />
            <span>{videoCount} Videos</span>
          </div>

          {pendingTasks > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              <span>{pendingTasks} Due Task{pendingTasks > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-2">
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              openChatWithChannel(subject.id);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Open subject doubt chat"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Doubts</span>
          </button>

          <button
            onClick={() => selectSubject(subject.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-sm group/btn"
          >
            <span>Open Class</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
}
