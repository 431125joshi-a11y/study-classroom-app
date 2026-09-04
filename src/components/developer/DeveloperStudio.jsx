import React, { useState } from 'react';
import {
  Code,
  Sliders,
  FolderOpen,
  BookOpen,
  CheckSquare,
  MessageSquare,
  Database,
  Save,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Layers,
  Lock,
  ExternalLink,
  Terminal
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { useChat } from '../../context/ChatContext';

const GRADIENT_OPTIONS = [
  { id: 'emerald', label: 'Emerald Mint', gradient: 'from-emerald-600 via-teal-600 to-cyan-700' },
  { id: 'violet', label: 'Violet Indigo', gradient: 'from-indigo-600 via-purple-600 to-pink-600' },
  { id: 'orange', label: 'Amber Orange', gradient: 'from-amber-600 via-orange-600 to-rose-600' },
  { id: 'blue', label: 'Ocean Blue', gradient: 'from-blue-600 via-sky-600 to-indigo-700' },
  { id: 'rose', label: 'Rose Magenta', gradient: 'from-pink-600 via-rose-600 to-red-600' },
  { id: 'dark', label: 'Midnight Slate', gradient: 'from-slate-800 via-zinc-800 to-neutral-900' },
];

export function DeveloperStudio() {
  const {
    subjects,
    setSubjects,
    resources,
    setResources,
    flashcards,
    setFlashcards,
    tasks,
    setTasks,
    userProfile,
    setUserProfile,
    exportData,
    importData,
    resetToSampleData,
    setCurrentView,
    setDeveloperMode
  } = useStudyApp();

  const { messages, setMessages, sendMessage } = useChat();

  const [activeTab, setActiveTab] = useState('subjects'); // 'subjects' | 'resources' | 'flashcards' | 'tasks' | 'chat' | 'rawjson'
  const [editingSubject, setEditingSubject] = useState(null);
  const [editingResource, setEditingResource] = useState(null);
  const [rawJsonText, setRawJsonText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [announcementText, setAnnouncementText] = useState('');

  // 1. SUBJECT OPERATIONS
  const handleSaveSubject = (e) => {
    e.preventDefault();
    if (!editingSubject) return;

    setSubjects(prev =>
      prev.map(s => (s.id === editingSubject.id ? editingSubject : s))
    );
    setEditingSubject(null);
    showNotice('Subject space updated successfully!');
  };

  const handleDeleteSubject = (id) => {
    if (window.confirm(`Are you sure you want to delete this subject? All its resources will remain in storage.`)) {
      setSubjects(prev => prev.filter(s => s.id !== id));
      showNotice('Subject deleted.');
    }
  };

  // 2. RESOURCE OPERATIONS
  const handleSaveResource = (e) => {
    e.preventDefault();
    if (!editingResource) return;

    setResources(prev =>
      prev.map(r => (r.id === editingResource.id ? editingResource : r))
    );
    setEditingResource(null);
    showNotice('Study material updated successfully!');
  };

  const handleDeleteResource = (id) => {
    if (window.confirm('Delete this material?')) {
      setResources(prev => prev.filter(r => r.id !== id));
      showNotice('Material deleted.');
    }
  };

  // 3. FLASHCARD OPERATIONS
  const handleDeleteFlashcard = (id) => {
    setFlashcards(prev => prev.filter(f => f.id !== id));
    showNotice('Flashcard deleted.');
  };

  // 4. CHATROOM BROADCAST
  const handleBroadcastAnnouncement = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    subjects.forEach(s => {
      sendMessage(`📢 **OFFICIAL ANNOUNCEMENT**: ${announcementText.trim()}`);
    });
    setAnnouncementText('');
    showNotice('Announcement broadcasted to all channels!');
  };

  const handleClearChat = () => {
    if (window.confirm('Clear all chat messages?')) {
      setMessages([]);
      showNotice('Chat history cleared.');
    }
  };

  // 5. RAW JSON DATABASE
  const handleLoadRawJson = () => {
    const data = {
      subjects,
      resources,
      flashcards,
      tasks,
      userProfile,
    };
    setRawJsonText(JSON.stringify(data, null, 2));
  };

  const handleApplyRawJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      const res = importData(parsed);
      if (res.success) {
        showNotice('Raw database applied successfully! 🎉');
      } else {
        showNotice('Failed: ' + res.error);
      }
    } catch (e) {
      showNotice('Invalid JSON syntax.');
    }
  };

  const showNotice = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-tight">
                Private Developer Control Studio
              </h1>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-400/30">
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live configuration engine — customize all subjects, materials, formulas, and data.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
          >
            Back to App View
          </button>
          <button
            onClick={() => {
              setDeveloperMode(false);
              setCurrentView('dashboard');
            }}
            className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock Studio</span>
          </button>
        </div>
      </div>

      {/* Live Notice Banner */}
      {statusMessage && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'subjects', label: '🏫 Subject Spaces', icon: Layers, count: subjects.length },
          { id: 'resources', label: '📂 Materials & Notes', icon: FolderOpen, count: resources.length },
          { id: 'flashcards', label: '🗂️ Flashcards & Formulas', icon: BookOpen, count: flashcards.length },
          { id: 'tasks', label: '✅ Tasks & Homework', icon: CheckSquare, count: tasks.length },
          { id: 'chat', label: '💬 Chatroom & Announcements', icon: MessageSquare },
          { id: 'rawjson', label: '⚡ Raw JSON Engine', icon: Database },
        ].map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'rawjson') handleLoadRawJson();
              }}
              className={`py-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                active
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  active ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: SUBJECTS MANAGER */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects.map(sub => (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className={`h-12 rounded-xl bg-gradient-to-r ${sub.gradient} p-3 text-white flex items-center justify-between`}>
                    <span className="font-extrabold text-sm">{sub.name}</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-black/20 rounded-md">{sub.code}</span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {sub.description}
                  </p>

                  <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                    <p>Instructor: <strong className="text-slate-700 dark:text-slate-300">{sub.teacher}</strong></p>
                    <p>Room: {sub.room}</p>
                    <p>Topics: {sub.topics?.length || 0} chapters defined</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Delete subject space"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditingSubject(sub)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Space</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Subject Edit Form Modal */}
          {editingSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Edit Subject Space: {editingSubject.name}
                </h3>

                <form onSubmit={handleSaveSubject} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Subject Name</label>
                    <input
                      type="text"
                      required
                      value={editingSubject.name}
                      onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Code</label>
                      <input
                        type="text"
                        value={editingSubject.code}
                        onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Teacher</label>
                      <input
                        type="text"
                        value={editingSubject.teacher}
                        onChange={(e) => setEditingSubject({ ...editingSubject, teacher: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingSubject.description}
                      onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Chapter Topics (Comma separated)</label>
                    <textarea
                      rows={3}
                      value={editingSubject.topics?.join(', ')}
                      onChange={(e) => setEditingSubject({ ...editingSubject, topics: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingSubject(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESOURCES MANAGER */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="p-3.5">Title</th>
                    <th className="p-3.5">Type</th>
                    <th className="p-3.5">Subject</th>
                    <th className="p-3.5">Topic</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {resources.map(res => (
                    <tr key={res.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3.5 font-bold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                        {res.title}
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-semibold uppercase text-[10px]">
                          {res.type}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500 capitalize">
                        {res.subjectId}
                      </td>
                      <td className="p-3.5 text-slate-400 max-w-[150px] truncate">
                        {res.topic}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setEditingResource(res)}
                          className="text-indigo-600 hover:underline font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteResource(res.id)}
                          className="text-rose-500 hover:underline font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resource Edit Form Modal */}
          {editingResource && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] overflow-y-auto">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
                  Edit Material: {editingResource.title}
                </h3>

                <form onSubmit={handleSaveResource} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={editingResource.title}
                      onChange={(e) => setEditingResource({ ...editingResource, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingResource.description}
                      onChange={(e) => setEditingResource({ ...editingResource, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">URL / Link</label>
                    <input
                      type="text"
                      value={editingResource.url}
                      onChange={(e) => setEditingResource({ ...editingResource, url: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Markdown / Formula Notes</label>
                    <textarea
                      rows={4}
                      value={editingResource.textContent || ''}
                      onChange={(e) => setEditingResource({ ...editingResource, textContent: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingResource(null)}
                      className="px-4 py-2 text-xs font-bold text-slate-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flashcards.map(fc => (
              <div
                key={fc.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] text-indigo-600 font-bold mb-1">
                    <span className="uppercase">{fc.subjectId}</span>
                    <span>{fc.topic}</span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">
                    Q: {fc.question}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl whitespace-pre-wrap">
                    A: {fc.answer}
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => handleDeleteFlashcard(fc.id)}
                    className="text-xs text-rose-500 hover:underline font-bold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Card</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CHAT & BROADCAST */}
      {activeTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Broadcast Official Announcement
            </h3>
            <form onSubmit={handleBroadcastAnnouncement} className="space-y-2">
              <textarea
                rows={2}
                required
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="Post teacher announcement to all classroom channels..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Send Broadcast
              </button>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Clear Chat History
              </h4>
              <p className="text-[11px] text-slate-400">
                Wipe all study group messages
              </p>
            </div>
            <button
              onClick={handleClearChat}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-bold"
            >
              Clear Messages
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: RAW JSON ENGINE */}
      {activeTab === 'rawjson' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Raw JSON Database Editor
              </h3>
              <p className="text-xs text-slate-400">
                Directly view and edit the entire schema and dataset
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleLoadRawJson}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                Reload JSON
              </button>
              <button
                onClick={handleApplyRawJson}
                className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Apply Database Changes</span>
              </button>
            </div>
          </div>

          <textarea
            rows={18}
            value={rawJsonText}
            onChange={(e) => setRawJsonText(e.target.value)}
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-emerald-400 font-mono text-xs outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      )}

    </div>
  );
}
