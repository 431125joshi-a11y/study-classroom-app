import React, { useState } from 'react';
import { X, User, Check, Sparkles } from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { AVATAR_COLORS } from '../../utils/helpers';

export function UserProfileModal() {
  const { isUserProfileModalOpen, setIsUserProfileModalOpen, userProfile, setUserProfile } = useStudyApp();

  const [name, setName] = useState(userProfile.name || 'Tanush');
  const [role, setRole] = useState(userProfile.role || 'Student');
  const [statusText, setStatusText] = useState(userProfile.statusText || 'Studying for Board Exams 🚀');
  const [selectedGradient, setSelectedGradient] = useState(userProfile.avatarGradient || AVATAR_COLORS[0]);

  if (!isUserProfileModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setUserProfile({
      name: name.trim(),
      role: role.trim(),
      statusText: statusText.trim(),
      avatarGradient: selectedGradient,
    });
    setIsUserProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedGradient} text-white font-bold text-lg flex items-center justify-center shadow-md`}>
              {name.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Customize Profile
              </h2>
              <p className="text-xs text-slate-400">
                Visible to classmates in Study Lounge
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUserProfileModalOpen(false)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Your Display Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Tanush, Alex, Priya"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Role / Grade
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Class 10th Student, Study Group Leader"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Status Message / Goal
            </label>
            <input
              type="text"
              value={statusText}
              onChange={(e) => setStatusText(e.target.value)}
              placeholder="e.g. Solving Maths Trigonometry 📐"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Avatar Color Palette */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Avatar Color Theme
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_COLORS.map((grad, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedGradient(grad)}
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${grad} flex items-center justify-center text-white transition-transform ${
                    selectedGradient === grad ? 'scale-110 ring-4 ring-indigo-500/40 shadow-md' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {selectedGradient === grad && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsUserProfileModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
            >
              Save Profile
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
