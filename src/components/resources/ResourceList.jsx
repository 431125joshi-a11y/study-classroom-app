import React from 'react';
import { ResourceCard } from './ResourceCard';
import { FolderOpen, Sparkles } from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';

export function ResourceList({ resources = [], hideHeader = false }) {
  const { searchQuery, setIsUploadModalOpen } = useStudyApp();

  // Apply search query filtering
  const filtered = resources.filter(res => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      res.title.toLowerCase().includes(query) ||
      (res.description && res.description.toLowerCase().includes(query)) ||
      (res.topic && res.topic.toLowerCase().includes(query)) ||
      (res.tags && res.tags.some(t => t.toLowerCase().includes(query)))
    );
  });

  if (filtered.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center">
        <FolderOpen className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {searchQuery ? `No study materials matching "${searchQuery}"` : 'No materials found in this category'}
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          {searchQuery ? 'Try clearing your search query or searching for a different keyword.' : 'Upload PDFs, video links, diagrams, or WhatsApp study materials.'}
        </p>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all"
        >
          Upload Material Now
        </button>
      </div>
    );
  }

  // Group by topics
  const groupedByTopic = filtered.reduce((acc, resource) => {
    const topic = resource.topic || 'General Topic Resources';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(resource);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {Object.entries(groupedByTopic).map(([topicName, items]) => (
        <div key={topicName} className="space-y-3">
          
          {!hideHeader && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {topicName}
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                ({items.length} item{items.length > 1 ? 's' : ''})
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}
