import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Video,
  Presentation,
  Image as ImageIcon,
  FolderOpen,
  Sparkles,
  CheckCircle,
  Tag,
  AlertCircle
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import {
  detectFileType,
  formatBytes,
  fileToDataUrl,
  isYouTubeUrl,
  isWhatsAppUrl
} from '../../utils/helpers';

const PRESET_TAGS = [
  'Important',
  'Formula Sheet',
  'Cheatsheet',
  'Exam Notes',
  'Homework',
  'Lab Practical',
  'Board Prep',
  'Sample Paper',
];

export function UploadModal() {
  const {
    isUploadModalOpen,
    setIsUploadModalOpen,
    subjects,
    activeSubjectId,
    addResource,
  } = useStudyApp();

  const [selectedTab, setSelectedTab] = useState('file'); // 'file' | 'link' | 'text'
  const [selectedSubjectId, setSelectedSubjectId] = useState(activeSubjectId || subjects[0]?.id || 'science');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedTags, setSelectedTags] = useState(['Important']);
  const [customTag, setCustomTag] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  
  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [detectedType, setDetectedType] = useState('file');
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [textContent, setTextContent] = useState('');

  const fileInputRef = useRef(null);

  if (!isUploadModalOpen) return null;

  const currentSubject = subjects.find(s => s.id === selectedSubjectId) || subjects[0];
  const topicsList = currentSubject?.topics || [];

  // Handle file drop / select
  const handleFileSelection = async (file) => {
    if (!file) return;
    setSelectedFile(file);
    const type = detectFileType(file);
    setDetectedType(type);
    
    if (!title) {
      // Auto populate title from file name
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setFilePreviewUrl(dataUrl);
    } catch (e) {
      console.warn('Could not generate preview data URL', e);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      setSelectedTags([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    try {
      let finalType = detectedType;
      if (selectedTab === 'link') {
        finalType = isYouTubeUrl(url) ? 'video' : 'link';
      } else if (selectedTab === 'text') {
        finalType = 'pdf'; // Formatted as readable document
      }

      const finalTopic = customTopic.trim() || selectedTopic || topicsList[0] || 'General Notes';

      const resourcePayload = {
        subjectId: selectedSubjectId,
        title: title.trim(),
        description: description.trim(),
        type: finalType,
        topic: finalTopic,
        tags: selectedTags,
        url: url.trim(),
        fileName: selectedFile?.name || '',
        fileSize: selectedFile?.size || 0,
        blobData: filePreviewUrl || '',
        textContent: textContent.trim(),
      };

      await addResource(resourcePayload, filePreviewUrl);

      setIsUploadModalOpen(false);
      // Reset form
      setTitle('');
      setDescription('');
      setUrl('');
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setTextContent('');
    } catch (err) {
      console.error('Failed to upload material', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                Upload & Share Study Material
              </h2>
              <p className="text-xs text-slate-400">
                PDFs, Videos, Presentations, Photos from Photos app, or WhatsApp links
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Selector Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 pt-3 bg-slate-50 dark:bg-slate-900/50">
          {[
            { id: 'file', label: '📁 File / Photo / PDF / Video', icon: FolderOpen },
            { id: 'link', label: '🔗 URL / YouTube / WhatsApp', icon: LinkIcon },
            { id: 'text', label: '📝 Quick Text Note', icon: FileText },
          ].map(tab => {
            const Icon = tab.icon;
            const active = selectedTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedTab(tab.id)}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
                  active
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Subject & Chapter Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Target Subject Space *
              </label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedTopic('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {subjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Chapter / Unit Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">-- Choose or add chapter below --</option>
                {topicsList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional custom topic name */}
          {!selectedTopic && (
            <div>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Or type a new chapter / topic name..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Tab 1: File / Photo / PDF Upload Area */}
          {selectedTab === 'file' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Upload File from Device (Photos, PDFs, Videos, PPTX, Docs)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 scale-[0.99]'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])}
                  className="hidden"
                  accept="application/pdf,video/*,image/*,.ppt,.pptx,.doc,.docx,.txt"
                />

                {selectedFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatBytes(selectedFile.size)} • Type: {detectedType.toUpperCase()}
                      </p>
                    </div>
                    <span className="text-[11px] font-semibold text-indigo-600 hover:underline mt-1">
                      Click to choose a different file
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Drag & Drop or Click to browse files
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Supports PDF notes, MP4 lecture videos, Photos app images, PPT presentations
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Link / WhatsApp URL */}
          {selectedTab === 'link' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Web, YouTube or WhatsApp Shared Link *
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required={selectedTab === 'link'}
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      if (isYouTubeUrl(e.target.value)) setDetectedType('video');
                      else setDetectedType('link');
                    }}
                    placeholder="https://youtube.com/watch?v=... or https://chat.whatsapp.com/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                  />
                </div>
              </div>

              {isYouTubeUrl(url) && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-700 dark:text-red-400">
                  <Video className="w-4 h-4 flex-shrink-0" />
                  <span>YouTube Video Link Detected! Will render an inline video player for students.</span>
                </div>
              )}

              {isWhatsAppUrl(url) && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>WhatsApp Study Group / Resource Link detected!</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Text Note */}
          {selectedTab === 'text' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Markdown / Text Study Notes
              </label>
              <textarea
                rows={4}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Write or paste formulas, quick revision points, or homework questions here..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Title & Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Material Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1 Chemical Reactions Master Formula Sheet"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Description / Instructions for Students
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key points covered, questions to solve, or why this resource is useful..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Resource Badges & Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_TAGS.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add custom tag..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-300"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish Material</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
