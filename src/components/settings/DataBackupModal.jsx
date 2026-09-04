import React, { useRef, useState } from 'react';
import {
  X,
  Database,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';

export function DataBackupModal() {
  const {
    isDataBackupModalOpen,
    setIsDataBackupModalOpen,
    exportData,
    importData,
    resetToSampleData,
    resources,
    subjects,
  } = useStudyApp();

  const [importStatus, setImportStatus] = useState(null);
  const fileInputRef = useRef(null);

  if (!isDataBackupModalOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result);
        const res = importData(json);
        if (res.success) {
          setImportStatus('Data imported successfully! 🎉');
        } else {
          setImportStatus('Failed to import file: ' + res.error);
        }
      } catch (err) {
        setImportStatus('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Data Backup & Storage Manager
              </h2>
              <p className="text-xs text-slate-400">
                Persistent offline IndexedDB storage & JSON export
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDataBackupModalOpen(false)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-600 dark:text-slate-300">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
              Current Local Storage Stats
            </h4>
            <p>• {subjects.length} Enrolled Subject Spaces (Science, Maths, SST...)</p>
            <p>• {resources.length} Saved Study Materials, PDFs, Videos & Notes</p>
            <p className="text-[11px] text-slate-400 pt-1">
              All materials are saved locally in high-capacity browser IndexedDB.
            </p>
          </div>

          {importStatus && (
            <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Export */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Export All Classroom Data
            </h4>
            <p className="text-slate-400">
              Download your complete subject notes, formulas, assignments, and profile as a JSON backup file.
            </p>
            <button
              onClick={exportData}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export & Download JSON Backup</span>
            </button>
          </div>

          {/* Import */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Import from Backup
            </h4>
            <p className="text-slate-400">
              Restore notes and classroom materials from an existing JSON backup file.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-2 transition-all border border-slate-200 dark:border-slate-700"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Backup File (.json)</span>
            </button>
          </div>

          {/* Reset */}
          <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Reset to Sample Curriculum Data</span>
            </h4>
            <p className="text-slate-400">
              Reset Science, Maths, and SST back to original demo notes and formula sheets.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Reset all classroom data to starter sample notes?')) {
                  resetToSampleData();
                  setImportStatus('Reset completed successfully!');
                }
              }}
              className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 font-bold transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Initial Data</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
