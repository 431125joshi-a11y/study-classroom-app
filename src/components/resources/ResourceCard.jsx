import React from 'react';
import {
  FileText,
  Video,
  Presentation,
  Image as ImageIcon,
  Link as LinkIcon,
  FolderOpen,
  Pin,
  Trash2,
  Download,
  ExternalLink,
  Eye,
  MessageSquare,
  Share2
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { useChat } from '../../context/ChatContext';
import { formatBytes, formatRelativeTime, isYouTubeUrl } from '../../utils/helpers';

const TYPE_CONFIG = {
  pdf: {
    icon: FileText,
    label: 'PDF Document',
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200/60 dark:border-rose-900/40',
    badge: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300',
  },
  video: {
    icon: Video,
    label: 'Video Lesson',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/40',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  },
  presentation: {
    icon: Presentation,
    label: 'Presentation Slide',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/40',
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  },
  photo: {
    icon: ImageIcon,
    label: 'Image / Chart',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/40',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  },
  link: {
    icon: LinkIcon,
    label: 'Web Link',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/60 dark:border-indigo-900/40',
    badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  },
  file: {
    icon: FolderOpen,
    label: 'File / Asset',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200/60 dark:border-purple-900/40',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300',
  },
};

export function ResourceCard({ resource }) {
  const {
    deleteResource,
    togglePinResource,
    setActiveMediaResource,
  } = useStudyApp();

  const { openChatWithChannel, sendMessage } = useChat();

  const config = TYPE_CONFIG[resource.type] || TYPE_CONFIG.file;
  const IconComponent = config.icon;

  const handleCardClick = () => {
    setActiveMediaResource(resource);
  };

  const handleShareToChat = (e) => {
    e.stopPropagation();
    openChatWithChannel(resource.subjectId || 'general');
    sendMessage(`Shared resource: **${resource.title}**`, resource);
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    if (resource.blobData) {
      const a = document.createElement('a');
      a.href = resource.blobData;
      a.download = resource.fileName || `${resource.title}.pdf`;
      a.click();
    } else if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 shadow-sm hover:shadow-card p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:-translate-y-0.5"
    >
      
      {/* Top row: Type Badge + Pin / Action Buttons */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${config.bg} ${config.color}`}>
            <IconComponent className="w-4 h-4" />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${config.badge}`}>
            {config.label}
          </span>
        </div>

        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePinResource(resource.id);
            }}
            className={`p-1.5 rounded-lg transition-colors ${
              resource.pinned
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title={resource.pinned ? 'Unpin' : 'Pin to top'}
          >
            <Pin className={`w-3.5 h-3.5 ${resource.pinned ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShareToChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            title="Share to Study Lounge Chat"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Are you sure you want to delete this material?')) {
                deleteResource(resource.id);
              }
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-1.5 mb-3 flex-1">
        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug">
          {resource.title}
        </h4>
        {resource.description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>
        )}
      </div>

      {/* Media Image / Video Thumbnail preview if available */}
      {resource.type === 'photo' && resource.url && (
        <div className="mb-3 rounded-xl overflow-hidden h-32 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <img
            src={resource.url}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>
      )}

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {resource.tags.slice(0, 3).map((tag, i) => (
            <span
              key={i}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
          {resource.tags.length > 3 && (
            <span className="text-[10px] text-slate-400 self-center">
              +{resource.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Card Footer: Metadata & Actions */}
      <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span>By {resource.uploadedBy || 'Student'}</span>
          <span>•</span>
          <span>{formatRelativeTime(resource.uploadedAt)}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {(resource.blobData || resource.url) && (
            <button
              onClick={handleDownload}
              className="p-1 rounded text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
              title="Download / Open source"
            >
              {resource.url ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={handleCardClick}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100"
          >
            <Eye className="w-3 h-3" />
            <span>View</span>
          </button>
        </div>
      </div>

    </div>
  );
}
