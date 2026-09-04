import React, { useState } from 'react';
import { X, Plus, BookMarked, Sparkles } from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';

const GRADIENT_PRESETS = [
  { id: 'emerald', label: 'Emerald Mint', gradient: 'from-emerald-600 via-teal-600 to-cyan-700' },
  { id: 'violet', label: 'Violet Indigo', gradient: 'from-indigo-600 via-purple-600 to-pink-600' },
  { id: 'orange', label: 'Amber Orange', gradient: 'from-amber-600 via-orange-600 to-rose-600' },
  { id: 'blue', label: 'Ocean Blue', gradient: 'from-blue-600 via-sky-600 to-indigo-700' },
  { id: 'rose', label: 'Rose Magenta', gradient: 'from-pink-600 via-rose-600 to-red-600' },
  { id: 'dark', label: 'Midnight Slate', gradient: 'from-slate-800 via-zinc-800 to-neutral-900' },
];

const ICONS_LIST = [
  { id: 'FlaskConical', label: 'Science Flask' },
  { id: 'Calculator', label: 'Maths Calculator' },
  { id: 'Globe', label: 'Globe / Social Studies' },
  { id: 'Laptop', label: 'Computer / Coding' },
  { id: 'BookMarked', label: 'Literature / Books' },
];

export function SubjectModal() {
  const { isSubjectModalOpen, setIsSubjectModalOpen, addSubject, selectSubject } = useStudyApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [description, setDescription] = useState('');
  const [room, setRoom] = useState('Online / Lab');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[3]);
  const [selectedIcon, setSelectedIcon] = useState('Laptop');
  const [topicsInput, setTopicsInput] = useState('Chapter 1: Foundations, Chapter 2: Core Concepts, Chapter 3: Advanced Applications');

  if (!isSubjectModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const topics = topicsInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newSub = addSubject({
      name: name.trim(),
      code: code.trim() || `${name.substring(0, 3).toUpperCase()}-101`,
      teacher: teacher.trim() || 'Classroom Instructor',
      description: description.trim() || `Course study hub for ${name}`,
      room: room.trim() || 'Online Class',
      theme: selectedGradient.id,
      gradient: selectedGradient.gradient,
      icon: selectedIcon,
      topics: topics.length > 0 ? topics : ['Unit 1: Overview', 'Unit 2: Exercises'],
    });

    setIsSubjectModalOpen(false);
    selectSubject(newSub.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header with Preview Banner */}
        <div className={`p-6 bg-gradient-to-tr ${selectedGradient.gradient} text-white flex items-center justify-between`}>
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-black/25 backdrop-blur-sm">
              New Classroom Space
            </span>
            <h2 className="text-xl font-extrabold mt-1">
              {name || 'Subject Name Preview'}
            </h2>
          </div>
          <button
            onClick={() => setIsSubjectModalOpen(false)}
            className="p-2 rounded-full bg-black/20 hover:bg-black/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Subject Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Computer Science, English Literature, Economics"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Subject Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS-401"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Teacher / Instructor
              </label>
              <input
                type="text"
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="e.g. Mr. David"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Course Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief course objectives and topics covered..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Chapters / Topics (Comma separated)
            </label>
            <input
              type="text"
              value={topicsInput}
              onChange={(e) => setTopicsInput(e.target.value)}
              placeholder="Unit 1, Unit 2, Unit 3"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Color Banner Theme Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Banner Gradient Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => setSelectedGradient(preset)}
                  className={`h-10 rounded-xl bg-gradient-to-r ${preset.gradient} text-white text-[11px] font-bold flex items-center justify-center transition-all ${
                    selectedGradient.id === preset.id
                      ? 'ring-4 ring-indigo-500/40 scale-105 shadow-md'
                      : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Subject Category Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {ICONS_LIST.map((ic) => (
                <button
                  type="button"
                  key={ic.id}
                  onClick={() => setSelectedIcon(ic.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedIcon === ic.id
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {ic.label}
                </button>
              ))}
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/25 transition-all"
            >
              Create Subject Space
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
