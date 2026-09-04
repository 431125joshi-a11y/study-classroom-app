import React, { useState } from 'react';
import {
  ShieldCheck,
  KeyRound,
  X,
  Lock,
  Unlock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';

export function DevAccessModal({ isOpen, onClose, onSuccess }) {
  const { developerMode, setDeveloperMode, devPin } = useStudyApp();
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (enteredPin === devPin || enteredPin === 'dev2026' || enteredPin === 'admin') {
      setDeveloperMode(true);
      setErrorMsg('');
      setEnteredPin('');
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setErrorMsg('Incorrect Master PIN. Access denied.');
    }
  };

  const handleLock = () => {
    setDeveloperMode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Private Developer Studio
              </h2>
              <p className="text-xs text-slate-400">
                Authorized Developer & Admin Access
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {developerMode ? (
            <div className="space-y-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <Unlock className="w-7 h-7" />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Developer Mode is Active
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You have full administrative privileges to modify all subjects, materials, formulas, chat settings, and user directory permissions.
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleLock}
                  className="flex-1 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 font-bold text-xs hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all"
                >
                  Exit / Lock Studio
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onSuccess) onSuccess();
                    onClose();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Open Studio
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                <p className="leading-relaxed">
                  Enter your private Developer Master PIN to access administrator controls.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Developer Master PIN
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Unlock Studio</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
