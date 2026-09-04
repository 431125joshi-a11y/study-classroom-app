import React from 'react';
import {
  Sparkles,
  Smile,
  FileText,
  Video,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  GraduationCap,
  ShieldCheck
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { formatRelativeTime } from '../../utils/helpers';

const REACTION_EMOJIS = ['👍', '🔥', '💡', '❤️', '🙌', '💯', '🤔'];

export function MessageItem({ message, onToggleReaction }) {
  const { setActiveMediaResource, users } = useStudyApp();

  const handleResourceClick = (e) => {
    e.stopPropagation();
    if (message.attachedResource) {
      setActiveMediaResource(message.attachedResource);
    }
  };

  // Check if sender is a teacher in users directory or message payload
  const senderUser = users.find(u => u.name === message.sender);
  const isTeacher = message.senderRole === 'teacher' || senderUser?.role === 'teacher';

  return (
    <div className={`group flex items-start gap-3 p-2.5 rounded-2xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
      message.isBot
        ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100/60 dark:border-indigo-900/40'
        : isTeacher
        ? 'bg-purple-50/30 dark:bg-purple-950/20 border border-purple-100/50 dark:border-purple-900/30'
        : ''
    }`}>
      
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${message.avatarGradient || 'from-indigo-500 to-purple-600'} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5`}>
        {message.isBot ? <Sparkles className="w-4 h-4 text-yellow-300" /> : isTeacher ? <GraduationCap className="w-4 h-4" /> : message.sender?.charAt(0)?.toUpperCase()}
      </div>

      {/* Message Content */}
      <div className="flex-1 min-w-0">
        
        {/* Header: Sender & Badges */}
        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            {message.sender}
          </span>
          
          {isTeacher && (
            <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-md bg-purple-600 text-white shadow-xs flex items-center gap-1">
              <GraduationCap className="w-3 h-3" />
              <span>TEACHER</span>
            </span>
          )}

          {message.isBot && (
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-indigo-600 text-white shadow-xs">
              AI BOT
            </span>
          )}

          <span className="text-[10px] text-slate-400">
            {formatRelativeTime(message.timestamp)}
          </span>
        </div>

        {/* Message Text */}
        <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
          {message.text}
        </div>

        {/* Attached Resource Embed if any */}
        {message.attachedResource && (
          <div
            onClick={handleResourceClick}
            className="mt-2.5 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-400 flex items-center justify-between gap-3 cursor-pointer shadow-sm group/res transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
                {message.attachedResource.type === 'video' ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate group-hover/res:text-indigo-600">
                  {message.attachedResource.title}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {message.attachedResource.topic}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </div>
          </div>
        )}

        {/* Emoji Reactions & Quick Reaction Bar */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {message.reactions &&
            Object.entries(message.reactions).map(([emoji, count]) => {
              if (count <= 0) return null;
              return (
                <button
                  key={emoji}
                  onClick={() => onToggleReaction(message.id, emoji)}
                  className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-1 transition-all active:scale-95"
                >
                  <span>{emoji}</span>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{count}</span>
                </button>
              );
            })}

          {/* Quick React Picker on hover */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-1 py-0.5 shadow-sm">
            {REACTION_EMOJIS.slice(0, 4).map(emoji => (
              <button
                key={emoji}
                onClick={() => onToggleReaction(message.id, emoji)}
                className="hover:scale-125 transition-transform p-0.5 text-xs"
                title={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
