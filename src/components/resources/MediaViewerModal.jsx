import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  Video,
  Presentation,
  Image as ImageIcon,
  Link as LinkIcon,
  Sparkles,
  Share2,
  Clock,
  Tag
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { useChat } from '../../context/ChatContext';
import { getBlob } from '../../utils/storage';
import { getYouTubeId, isYouTubeUrl, formatBytes, formatRelativeTime } from '../../utils/helpers';

export function MediaViewerModal() {
  const { activeMediaResource, setActiveMediaResource, subjects } = useStudyApp();
  const { openChatWithChannel, sendMessage } = useChat();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [blobSource, setBlobSource] = useState(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    let isMounted = true;
    async function loadBinary() {
      if (activeMediaResource?.hasBinaryInIndexedDB) {
        const data = await getBlob(activeMediaResource.id);
        if (isMounted && data) {
          setBlobSource(data);
        }
      } else if (activeMediaResource?.blobData) {
        setBlobSource(activeMediaResource.blobData);
      } else {
        setBlobSource(null);
      }
    }
    loadBinary();
    setZoomLevel(1);
    return () => { isMounted = false; };
  }, [activeMediaResource]);

  if (!activeMediaResource) return null;

  const subject = subjects.find(s => s.id === activeMediaResource.subjectId);
  const isYouTube = isYouTubeUrl(activeMediaResource.url);
  const youtubeId = isYouTube ? getYouTubeId(activeMediaResource.url) : null;

  const handleShareToChat = () => {
    openChatWithChannel(activeMediaResource.subjectId || 'general');
    sendMessage(`Discussing material: **${activeMediaResource.title}**`, activeMediaResource);
  };

  const handleDownload = () => {
    if (blobSource) {
      const a = document.createElement('a');
      a.href = blobSource;
      a.download = activeMediaResource.fileName || `${activeMediaResource.title}.pdf`;
      a.click();
    } else if (activeMediaResource.url) {
      window.open(activeMediaResource.url, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              {activeMediaResource.type === 'video' && <Video className="w-5 h-5" />}
              {activeMediaResource.type === 'pdf' && <FileText className="w-5 h-5" />}
              {activeMediaResource.type === 'photo' && <ImageIcon className="w-5 h-5" />}
              {activeMediaResource.type === 'presentation' && <Presentation className="w-5 h-5" />}
              {activeMediaResource.type === 'link' && <LinkIcon className="w-5 h-5" />}
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-extrabold truncate text-white">
                {activeMediaResource.title}
              </h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{subject?.name || 'Classroom'}</span>
                <span>•</span>
                <span>{activeMediaResource.topic}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShareToChat}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Share to Study Lounge Chat"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Discuss in Chat</span>
            </button>

            {(blobSource || activeMediaResource.url) && (
              <button
                onClick={handleDownload}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-sm"
                title="Download / Open source"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download</span>
              </button>
            )}

            <button
              onClick={() => setActiveMediaResource(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Viewport Area */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col items-center justify-center relative p-4">
          
          {/* 1. YouTube Video Embed */}
          {isYouTube && youtubeId && (
            <div className="w-full h-full max-w-4xl flex items-center justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                title={activeMediaResource.title}
                className="w-full aspect-video rounded-2xl shadow-xl border border-slate-800"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* 2. Direct Video File Player */}
          {!isYouTube && activeMediaResource.type === 'video' && blobSource && (
            <div className="w-full h-full flex flex-col items-center justify-center max-w-4xl">
              <video
                src={blobSource}
                controls
                autoPlay
                className="max-h-[70vh] rounded-2xl shadow-2xl bg-black"
                playbackRate={playbackSpeed}
              />
              <div className="flex items-center gap-2 mt-3 bg-slate-800 px-3 py-1.5 rounded-full text-xs text-white">
                <span>Speed:</span>
                {[0.75, 1, 1.25, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackSpeed(rate)}
                    className={`px-2 py-0.5 rounded-md font-bold ${
                      playbackSpeed === rate ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Photo / Image Lightbox */}
          {activeMediaResource.type === 'photo' && (blobSource || activeMediaResource.url) && (
            <div className="w-full h-full flex flex-col items-center justify-center relative overflow-auto">
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm p-1.5 rounded-2xl border border-slate-700 text-white">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
                  className="p-1.5 hover:bg-slate-800 rounded-xl"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono px-2">{Math.round(zoomLevel * 100)}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
                  className="p-1.5 hover:bg-slate-800 rounded-xl"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <img
                src={blobSource || activeMediaResource.url}
                alt={activeMediaResource.title}
                style={{ transform: `scale(${zoomLevel})` }}
                className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-xl transition-transform duration-200"
              />
            </div>
          )}

          {/* 4. PDF Document & Text Notes Reader */}
          {(activeMediaResource.type === 'pdf' || activeMediaResource.textContent) && (
            <div className="w-full h-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 overflow-y-auto">
              {blobSource && blobSource.startsWith('data:application/pdf') ? (
                <iframe
                  src={blobSource}
                  title={activeMediaResource.title}
                  className="w-full h-full min-h-[65vh] rounded-xl border border-slate-200"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none space-y-4">
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
                    <FileText className="w-6 h-6 text-rose-500" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      {activeMediaResource.title}
                    </h2>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700 whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                    {activeMediaResource.textContent || activeMediaResource.description || 'No direct text content. Click Download above to open the file in your preferred PDF viewer.'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 5. External Web Link / Presentation */}
          {(activeMediaResource.type === 'link' || activeMediaResource.type === 'presentation') && !isYouTube && (
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400">
                {activeMediaResource.type === 'presentation' ? <Presentation className="w-8 h-8" /> : <LinkIcon className="w-8 h-8" />}
              </div>

              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {activeMediaResource.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {activeMediaResource.description || 'Web resource shared by your classroom.'}
                </p>
              </div>

              {activeMediaResource.url && (
                <a
                  href={activeMediaResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
                >
                  <span>Open Resource in New Tab</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          )}

        </div>

        {/* Modal Bottom Footer Info */}
        <div className="px-6 py-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 flex-shrink-0 gap-2">
          <div className="flex items-center gap-3">
            <span>Uploaded by <strong>{activeMediaResource.uploadedBy}</strong></span>
            <span>•</span>
            <span>{formatRelativeTime(activeMediaResource.uploadedAt)}</span>
            {activeMediaResource.fileSize > 0 && (
              <>
                <span>•</span>
                <span>{formatBytes(activeMediaResource.fileSize)}</span>
              </>
            )}
          </div>

          {activeMediaResource.tags && (
            <div className="flex items-center gap-1.5">
              {activeMediaResource.tags.map((t, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
