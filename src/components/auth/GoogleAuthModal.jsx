import React, { useState } from 'react';
import {
  X,
  Mail,
  User,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  LogOut,
  Copy,
  Check
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';
import { AVATAR_COLORS, generateId } from '../../utils/helpers';

export function GoogleAuthModal() {
  const {
    isGoogleAuthModalOpen,
    setIsGoogleAuthModalOpen,
    userProfile,
    setUserProfile,
    users,
    setUsers,
  } = useStudyApp();

  const [step, setStep] = useState('choose'); // 'choose' | 'form' | 'success'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [statusText, setStatusText] = useState('Enrolled in Science, Maths & SST 🚀');
  const [selectedGradient, setSelectedGradient] = useState(AVATAR_COLORS[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isGoogleAuthModalOpen) return null;

  // One-click Google Quick Sign-In
  const handleQuickGoogleSignIn = (googleEmail, defaultName, defaultRole = 'student') => {
    const finalName = defaultName || googleEmail.split('@')[0].replace(/[._]/g, ' ');
    const formattedName = finalName.charAt(0).toUpperCase() + finalName.slice(1);
    
    const newProfile = {
      id: generateId('usr_google'),
      name: formattedName,
      email: googleEmail,
      role: defaultRole,
      status: 'active',
      statusText: `Signed in with Google Account (${googleEmail})`,
      avatarGradient: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
      isGoogleAuth: true,
      lastActive: new Date().toISOString(),
    };

    setUserProfile(newProfile);

    // Sync to user directory
    setUsers(prev => {
      const existing = prev.find(u => u.email === googleEmail);
      if (existing) {
        return prev.map(u => u.email === googleEmail ? { ...u, ...newProfile } : u);
      }
      return [newProfile, ...prev];
    });

    setStep('success');
  };

  const handleCustomGoogleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) return;

    const googleEmail = email.includes('@') ? email.trim() : `${email.trim()}@gmail.com`;

    const newProfile = {
      id: generateId('usr_google'),
      name: name.trim(),
      email: googleEmail,
      role: role,
      status: 'active',
      statusText: statusText.trim(),
      avatarGradient: selectedGradient,
      isGoogleAuth: true,
      lastActive: new Date().toISOString(),
    };

    setUserProfile(newProfile);

    setUsers(prev => {
      const existing = prev.find(u => u.email === googleEmail);
      if (existing) {
        return prev.map(u => u.email === googleEmail ? { ...u, ...newProfile } : u);
      }
      return [newProfile, ...prev];
    });

    setStep('success');
  };

  const shareableJoinLink = `${window.location.origin}${window.location.pathname}?join=google`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableJoinLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white p-2 flex items-center justify-center shadow-md">
              {/* Google Colored 'G' SVG Logo */}
              <svg className="w-full h-full" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                Google Classroom Sign-In
              </h2>
              <p className="text-xs text-slate-400">
                Connect your Gmail or School account
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGoogleAuthModalOpen(false)}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5">
          
          {/* STEP 1: Quick Google Accounts or Custom Gmail */}
          {step === 'choose' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Sign in with your Google or Gmail account to save your personal notes, study tasks, and chat with classmates.
              </p>

              {/* One-Click Demo Google Account Buttons */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Select Account:
                </p>

                <button
                  type="button"
                  onClick={() => handleQuickGoogleSignIn('tanush.student@gmail.com', 'Tanush', 'student')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center">
                      T
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        Tanush
                      </p>
                      <p className="text-[11px] text-slate-400">tanush.student@gmail.com (Student)</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickGoogleSignIn('sarah.verma@school.edu', 'Dr. Sarah Verma', 'teacher')}
                  className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-slate-700 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-600 text-white font-bold text-xs flex items-center justify-center">
                      S
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 flex items-center gap-1.5">
                        <span>Dr. Sarah Verma</span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                          TEACHER
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-400">sarah.verma@school.edu (Faculty)</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-purple-600 transition-all" />
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
                <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-bold text-slate-400 uppercase">
                  Or enter your Gmail
                </span>
              </div>

              <button
                type="button"
                onClick={() => setStep('form')}
                className="w-full py-3 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Mail className="w-4 h-4 text-rose-500" />
                <span>Use Custom Google / Gmail Account</span>
              </button>

              {/* Shareable Invite Link Box */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                    🔗 Direct Shareable Link for Classmates:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  readOnly
                  value={shareableJoinLink}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 text-[11px] text-slate-600 dark:text-slate-300 font-mono select-all"
                />
              </div>

            </div>
          )}

          {/* STEP 2: Custom Gmail Form */}
          {step === 'form' && (
            <form onSubmit={handleCustomGoogleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Google / Gmail Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tanush Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher / Faculty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Status Message
                  </label>
                  <input
                    type="text"
                    value={statusText}
                    onChange={(e) => setStatusText(e.target.value)}
                    placeholder="e.g. Studying Maths 📐"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              {/* Avatar Theme Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Profile Avatar Color
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVATAR_COLORS.map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedGradient(grad)}
                      className={`h-8 rounded-xl bg-gradient-to-tr ${grad} transition-transform ${
                        selectedGradient === grad ? 'scale-110 ring-2 ring-indigo-500' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep('choose')}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
                >
                  Complete Google Profile
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Success Screen */}
          {step === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  Welcome, {userProfile.name}!
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Signed in as <strong className="text-indigo-600 dark:text-indigo-400">{userProfile.email}</strong> ({userProfile.role.toUpperCase()})
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                Your profile is now synced! Your uploaded notes, study checklist, and study chat messages are linked to your account.
              </div>

              <button
                type="button"
                onClick={() => setIsGoogleAuthModalOpen(false)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
              >
                Go to Classroom
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
