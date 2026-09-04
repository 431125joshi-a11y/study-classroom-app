import React, { useState } from 'react';
import {
  Rotate3d,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Plus,
  Sparkles,
  Shuffle,
  BookOpen
} from 'lucide-react';
import { useStudyApp } from '../../context/StudyAppContext';

export function FlashcardDeck({ initialSubjectId = 'all' }) {
  const { flashcards, toggleFlashcardMastery, addFlashcard, subjects } = useStudyApp();

  const [selectedSubject, setSelectedSubject] = useState(initialSubjectId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New card form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [newSubjectId, setNewSubjectId] = useState(subjects[0]?.id || 'science');

  // Filter flashcards by subject
  const filteredCards = flashcards.filter(c => {
    if (selectedSubject === 'all') return true;
    return c.subjectId === selectedSubject;
  });

  const activeCard = filteredCards[currentIndex] || null;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    addFlashcard({
      subjectId: newSubjectId,
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      topic: newTopic.trim() || 'General Revision',
    });

    setNewQuestion('');
    setNewAnswer('');
    setNewTopic('');
    setIsAddModalOpen(false);
  };

  const masteredCount = filteredCards.filter(c => c.mastered).length;
  const progressPercent = filteredCards.length > 0 ? (masteredCount / filteredCards.length) * 100 : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-card space-y-6">
      
      {/* Header & Subject Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Interactive Flashcard Deck</span>
          </h3>
          <p className="text-xs text-slate-400">
            Click card to flip and test your memory
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span>Mastery Progress</span>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {masteredCount} of {filteredCards.length} Mastered ({Math.round(progressPercent)}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard View */}
      {filteredCards.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <p className="text-sm font-bold">No flashcards found for this subject.</p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Create Your First Flashcard
          </button>
        </div>
      ) : (
        activeCard && (
          <div className="space-y-4">
            
            {/* 3D-Like Flipping Flashcard */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="min-h-[240px] sm:min-h-[260px] p-6 sm:p-8 rounded-3xl cursor-pointer select-none transition-all duration-300 transform hover:scale-[1.01] flex flex-col justify-between relative shadow-lg border border-slate-200/80 dark:border-slate-800 text-left bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {isFlipped ? '💡 Answer & Explanation' : '❓ Question'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Card {currentIndex + 1} of {filteredCards.length}
                </span>
              </div>

              {/* Card Body */}
              <div className="py-6">
                <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                  {isFlipped ? activeCard.answer : activeCard.question}
                </p>
                {activeCard.topic && (
                  <p className="text-xs text-slate-400 mt-2">
                    Topic: {activeCard.topic}
                  </p>
                )}
              </div>

              {/* Card Footer Hint */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="flex items-center gap-1">
                  <Rotate3d className="w-3.5 h-3.5" />
                  <span>Click to flip</span>
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFlashcardMastery(activeCard.id);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs transition-colors ${
                    activeCard.mastered
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeCard.mastered ? 'Mastered ✓' : 'Mark as Mastered'}</span>
                </button>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={() => {
                  const rand = Math.floor(Math.random() * filteredCards.length);
                  setIsFlipped(false);
                  setCurrentIndex(rand);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
                title="Shuffle card"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )
      )}

      {/* Add Card Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Flashcard
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Subject Space
                </label>
                <select
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Chapter / Topic
                </label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                  placeholder="e.g. Ohm's Law, Trigonometry, Nationalism"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Question *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g. State the formula for Electric Current and its SI unit."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Answer *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="e.g. I = Q / t (Current = Charge / Time). SI unit is Ampere (A)."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
